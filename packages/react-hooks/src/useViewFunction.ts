// Copyright 2017-2026 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The polkadot-js metadata API is dynamically typed - lookups and created
// types are all `any`. These checks are disabled file-wide to keep the hook
// readable. This matches the pre-existing posture of this file.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

import type { ApiPromise } from '@polkadot/api';
import type { Codec } from '@polkadot/types/types';

import { useEffect, useState } from 'react';

import { compactToU8a, u8aConcat, u8aToHex } from '@polkadot/util';

import { useApi } from './useApi.js';
import { useMemoValue } from './useMemoValue.js';

interface ViewFunctionInfo {
  id: Uint8Array;
  inputTypeIds: number[];
  outputTypeId?: number;
}

// One cache per registry (i.e. per chain connection). Lookups are keyed by
// `pallet::fn`; a miss is cached as `undefined` too so we don't repeat the
// metadata walk + warn log every render.
const viewFunctionCache = new WeakMap<object, Map<string, ViewFunctionInfo | undefined>>();
const EMPTY_ARGS: readonly unknown[] = [];

function resolveViewFunction (api: ApiPromise, palletName: string, fnName: string): ViewFunctionInfo | undefined {
  try {
    const metadata = api.registry.metadata as any;
    const pallets = metadata.pallets;

    if (pallets) {
      const pallet = pallets.find((pallet: any) => pallet.name.toString() === palletName);

      if (!pallet) {
        console.warn(`useViewFunction: pallet "${palletName}" not found in metadata. Available pallets: ${pallets.map((pallet: any) => pallet.name.toString()).join(', ')}`);

        return undefined;
      }

      // `viewFunctions` only exists on metadata v16+. On older metadata the
      // getter is undefined (not an empty Vec), so there is no reliable id to
      // call.
      const vfs = pallet.viewFunctions;

      if (!vfs) {
        console.warn(`useViewFunction: pallet "${palletName}" metadata has no viewFunctions field - runtime is probably on metadata < v16`);

        return undefined;
      }

      const viewFunction = vfs.find((viewFunction: any) => viewFunction.name.toString() === fnName);

      if (!viewFunction) {
        console.warn(`useViewFunction: pallet "${palletName}" has ${vfs.length} view functions but "${fnName}" not found. Available: ${vfs.map((viewFunction: any) => viewFunction.name.toString()).join(', ')}`);

        return undefined;
      }

      return {
        id: viewFunction.id.toU8a(),
        inputTypeIds: viewFunction.inputs.map((arg: any) => arg.type.toNumber()),
        outputTypeId: viewFunction.output.toNumber()
      };
    }

    console.warn('useViewFunction: metadata has no pallets');
  } catch (e) {
    console.warn('useViewFunction: metadata lookup failed:', e);
  }

  return undefined;
}

/**
 * Resolve a pallet view function from metadata (v16+): its 32-byte id, the
 * type ids of each input argument, and the output type id. Cached per registry
 * so repeat callers (multiple EraPots columns etc.) don't re-walk metadata.
 */
function findViewFunction (api: ApiPromise, palletName: string, fnName: string): ViewFunctionInfo | undefined {
  let byName = viewFunctionCache.get(api.registry);

  if (!byName) {
    byName = new Map();
    viewFunctionCache.set(api.registry, byName);
  }

  const cacheKey = `${palletName}::${fnName}`;

  if (byName.has(cacheKey)) {
    return byName.get(cacheKey);
  }

  const info = resolveViewFunction(api, palletName, fnName);

  byName.set(cacheKey, info);

  return info;
}

/**
 * SCALE-encode user-provided arguments using the input type ids resolved from
 * metadata. Returns the concatenated bytes. Throws if the arg count does not
 * match the signature.
 */
function encodeArgs (api: ApiPromise, info: ViewFunctionInfo, args: readonly unknown[]): Uint8Array {
  if (args.length !== info.inputTypeIds.length) {
    throw new Error(`view fn expects ${info.inputTypeIds.length} argument(s), got ${args.length}`);
  }

  if (args.length === 0) {
    return new Uint8Array();
  }

  const encoded = info.inputTypeIds.map((typeId, idx) =>
    api.registry.createType(api.registry.createLookupType(typeId), args[idx]).toU8a()
  );

  return u8aConcat(...encoded);
}

interface Options {
  /**
   * Arguments encoded via metadata-resolved input types.
   *
   *   - omitted options: zero-arg view function; call with empty input.
   *   - `undefined`: skip the call entirely (no encoding/RPC). Use this when
   *     a caller conditionally wants to skip (e.g. era is unknown).
   *   - `[]`: zero-arg view function; call with empty input.
   *   - non-empty array: encode and call.
   */
  args?: readonly unknown[];
}

/**
 * Call a FRAME pallet view function and return the decoded result.
 *
 * @param palletName - Pallet name as in construct_runtime (e.g. "Staking")
 * @param fnName - View function name (e.g. "pot_account")
 * @param options - `args` encoded via metadata types. Pass `{}` or
 *                  `{ args: undefined }` to skip the call entirely; omit
 *                  options for zero-argument view functions.
 */
export function useViewFunction (
  palletName: string,
  fnName: string,
  options?: Options
): Codec | undefined {
  const { api, isApiReady } = useApi();
  const [result, setResult] = useState<Codec | undefined>();

  // Caller indicated "skip" by supplying options without args. This lets
  // consumers respect the rules of hooks (always call useViewFunction) while
  // deferring the actual runtime call until inputs are known.
  const skip = options !== undefined && options.args === undefined;

  // Identity-stable args reference - `useMemoValue` compares by value (BN-
  // aware via `@polkadot/util.stringify`) so re-renders with fresh array
  // literals don't re-trigger the effect.
  const stableArgs = useMemoValue(options?.args ?? EMPTY_ARGS);

  // Clear any stale result when the caller transitions back to "skip" — e.g.
  // era unset on prop change. Prevents a previously-resolved value from
  // lingering while the view function is no longer being requested.
  useEffect(() => {
    if (skip || !isApiReady) {
      setResult(undefined);
    }
  }, [isApiReady, skip]);

  useEffect(() => {
    if (!isApiReady || skip) {
      return;
    }

    const info = findViewFunction(api, palletName, fnName);

    if (!info) {
      console.warn(`useViewFunction: could not resolve ${palletName}::${fnName}`);
      setResult(undefined);

      return;
    }

    let input: Uint8Array;

    try {
      input = encodeArgs(api, info, stableArgs ?? []);
    } catch (e) {
      console.error(`useViewFunction: input encoding failed for ${palletName}::${fnName}:`, e);
      setResult(undefined);

      return;
    }

    // Raw `state_call` rather than `api.call.runtimeViewFunction.executeViewFunction`:
    // the latter's auto-generated decoder has proven fragile (observed: `Bytes:
    // required length less than remainder` from malformed Result-envelope decoding).
    // Going raw lets us decode the `Result<Vec<u8>, DispatchError>` envelope on
    // our terms. The RPC expects the input as `(ViewFunctionId, Vec<u8>)` scale-
    // encoded: 32-byte id, compact length, then the input bytes.
    const callArgs = u8aConcat(info.id, compactToU8a(input.length), input);

    let cancelled = false;

    setResult(undefined);

    (api.rpc.state.call as any)('RuntimeViewFunction_execute_view_function', u8aToHex(callArgs))
      .then((rawBytes: any) => {
        if (cancelled) {
          return;
        }

        try {
          // `rawBytes.toU8a(true)` strips the outer length prefix so we
          // start at the Result discriminator.
          const envelopeBytes = rawBytes?.toU8a ? rawBytes.toU8a(true) : rawBytes;
          const result = api.registry.createType(
            'Result<Bytes, FrameSupportViewFunctionsViewFunctionDispatchError>',
            envelopeBytes
          );

          if (result.isErr) {
            console.error(`useViewFunction: ${palletName}::${fnName} returned error:`, result.asErr.toString());

            return;
          }

          const payload: Uint8Array = result.asOk.toU8a(true);

          if (info.outputTypeId !== undefined) {
            try {
              const typeName = api.registry.createLookupType(info.outputTypeId);

              setResult(api.registry.createType(typeName, payload));

              return;
            } catch (e) {
              console.warn(`useViewFunction: output decode failed for ${palletName}::${fnName}, returning raw Bytes:`, e);
            }
          }

          setResult(api.registry.createType('Bytes', payload));
        } catch (e) {
          console.error(`useViewFunction: result envelope decode failed for ${palletName}::${fnName}:`, e);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          console.error(`useViewFunction: raw state_call failed for ${palletName}::${fnName}:`, e);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, isApiReady, skip, palletName, fnName, stableArgs]);

  return result;
}
