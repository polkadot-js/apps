// Copyright 2017-2026 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Codec } from '@polkadot/types/types';

import { useEffect, useMemo, useState } from 'react';

import { xxhashAsU8a } from '@polkadot/util-crypto';

import { useApi } from './useApi.js';

interface ViewFunctionInfo {
  id: Uint8Array;
  outputTypeId?: number;
}

/**
 * Find the 32-byte view function ID and output type from metadata v16,
 * or compute the ID from twox_128 hashes.
 */
function findViewFunction (api: ApiPromise, palletName: string, fnName: string): ViewFunctionInfo | undefined {
  // api.registry.metadata returns MetadataLatest (the inner content, already v16 if
  // the runtime supports it). It has .pallets directly — no .version or .asV16 wrapper.
  try {
    const metadata = api.registry.metadata as any;
    const pallets = metadata.pallets;

    if (pallets) {
      for (let i = 0; i < pallets.length; i++) {
        const pallet = pallets[i];

        if (pallet.name.toString() === palletName) {
          const vfs = pallet.viewFunctions;

          if (!vfs || vfs.length === 0) {
            console.warn(`useViewFunction: pallet "${palletName}" has no view functions in metadata — is the runtime rebuilt?`);
            break;
          }

          for (let j = 0; j < vfs.length; j++) {
            if (vfs[j].name.toString() === fnName) {
              return {
                id: vfs[j].id.toU8a(),
                outputTypeId: vfs[j].output.toNumber()
              };
            }
          }

          console.warn(`useViewFunction: pallet "${palletName}" has ${vfs.length} view functions but "${fnName}" not found`);
          break;
        }
      }
    }
  } catch (e) {
    console.warn('useViewFunction: metadata lookup failed, falling back to hash:', e);
  }

  // Fallback: compute IDs from twox_128(pallet) ++ twox_128(fnName).
  // NOTE: FRAME hashes the full signature (e.g. "fn_name(ArgType) -> RetType") for
  // the suffix, so this fallback will likely produce incorrect IDs.
  console.warn(`useViewFunction: using hash fallback for ${palletName}::${fnName} — IDs may not match runtime`);

  try {
    const prefix = xxhashAsU8a(palletName, 128);
    const suffix = xxhashAsU8a(fnName, 128);
    const id = new Uint8Array(32);

    id.set(prefix, 0);
    id.set(suffix, 16);

    return { id };
  } catch (e) {
    console.error('useViewFunction: hash computation failed:', e);

    return undefined;
  }
}

/**
 * Hook to call a runtime view function and return the decoded result.
 *
 * @param palletName - Pallet name as in construct_runtime (e.g. "Dap")
 * @param fnName - View function name (e.g. "buffer_balance")
 * @param input - SCALE-encoded input args (empty Uint8Array for no-arg functions)
 */
export function useViewFunction (
  palletName: string,
  fnName: string,
  input: Uint8Array = new Uint8Array()
): Codec | undefined {
  const { api, isApiReady } = useApi();
  const [result, setResult] = useState<Codec | undefined>();

  // Stabilize the input reference
  const inputHex = useMemo(
    () => Array.from(input).map((b) => b.toString(16).padStart(2, '0')).join(''),
    [input]
  );

  useEffect(() => {
    if (!isApiReady) {
      return;
    }

    if (!api.call?.runtimeViewFunction?.executeViewFunction) {
      console.warn(`useViewFunction: runtimeViewFunction API not available for ${palletName}::${fnName}`);

      return;
    }

    const info = findViewFunction(api, palletName, fnName);

    if (!info) {
      console.warn(`useViewFunction: could not resolve ${palletName}::${fnName}`);

      return;
    }

    const viewFunctionId = api.registry.createType('FrameSupportViewFunctionsViewFunctionId', {
      prefix: Array.from(info.id.slice(0, 16)),
      suffix: Array.from(info.id.slice(16, 32))
    });

    api.call.runtimeViewFunction
      .executeViewFunction(viewFunctionId, input)
      .then((rawResult: any) => {
        if (rawResult.isOk) {
          const resultBytes: Uint8Array = rawResult.asOk.toU8a(true);

          // Decode using the output type from metadata if available
          if (info.outputTypeId !== undefined) {
            try {
              const typeDef = api.registry.lookup.getTypeDef(info.outputTypeId);
              const decoded = api.registry.createType(typeDef.type, resultBytes);

              setResult(decoded);

              return;
            } catch (e) {
              console.warn(`useViewFunction: type-based decoding failed for ${palletName}::${fnName}, returning raw:`, e);
            }
          }

          // Fallback: return raw Bytes
          setResult(api.registry.createType('Bytes', resultBytes));
        } else {
          console.error(`useViewFunction: ${palletName}::${fnName} returned error:`, rawResult.asErr?.toString());
        }
      })
      .catch((e: Error) => {
        console.error(`useViewFunction: call failed for ${palletName}::${fnName}:`, e);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, isApiReady, palletName, fnName, inputHex]);

  return result;
}
