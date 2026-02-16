// Copyright 2017-2026 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ExtDef, ExtTypes } from '@polkadot/types/extrinsic/signedExtensions/types';
import type { TypeDef } from '@polkadot/types-create/types';

import { typesBundle } from '@polkadot/apps-config';
import { allExtensions } from '@polkadot/types/extrinsic/signedExtensions';
import { encodeTypeDef, TypeDefInfo } from '@polkadot/types-create';

/**
 * Convert a TypeDef (from the portable registry) into an ExtTypes field mapping.
 *
 * - Null / empty tuple → {} (no fields, zero-sized extension)
 * - Struct with named sub fields → { fieldName: encodedType }
 * - Other types (Option, Compact, etc.) → { syntheticName: encodedType }
 *   These are newtype wrappers or direct types in the metadata; we generate
 *   a synthetic field name since ExtTypes requires named fields.
 */
function typeDefToExtTypes (api: ApiPromise, typeDef: TypeDef, identifier: string): ExtTypes {
  if (typeDef.info === TypeDefInfo.Null) {
    return {};
  }

  if (typeDef.info === TypeDefInfo.Tuple) {
    if (!typeDef.sub || (Array.isArray(typeDef.sub) && typeDef.sub.length === 0)) {
      return {};
    }
  }

  if (typeDef.info === TypeDefInfo.Struct) {
    const sub = typeDef.sub;

    if (!sub) {
      return {};
    }

    const fields = Array.isArray(sub) ? sub : [sub];

    if (fields.length > 0 && fields.every((f) => f.name)) {
      const result: ExtTypes = {};

      for (const field of fields) {
        if (field.name) {
          result[field.name] = encodeTypeDef(api.registry, field);
        }
      }

      return result;
    }
  }

  // For non-struct types (Option, Compact, Tuple with fields, etc.) or
  // structs with unnamed fields: encode the whole type as a single field.
  // Use a synthetic field name derived from the extension identifier.
  //
  // Strip displayName/lookupName from the top-level TypeDef to force
  // structural encoding. getTypeDef unwraps newtype composites (e.g.,
  // ProvideCidConfig(Option<CidConfig>) → info=Option) but preserves
  // the composite's name. If we pass that name to the registry, it
  // resolves back to the composite wrapper instead of the inner type.
  const stripped = { ...typeDef, displayName: undefined, lookupName: undefined };
  const encoded = encodeTypeDef(api.registry, stripped);
  const fieldName = identifier[0].toLowerCase() + identifier.slice(1);

  return { [fieldName]: encoded };
}

/**
 * Dynamically resolve unknown signed extensions from metadata and register
 * them with the API registry. Existing built-in and static (apps-config)
 * definitions take priority — this only fills in gaps for extensions not
 * covered by those sources.
 */
export function registerDynamicExtensions (api: ApiPromise): void {
  const metadata = api.registry.metadata;

  if (!metadata?.extrinsic?.transactionExtensions) {
    return;
  }

  const extensions = metadata.extrinsic.transactionExtensions;
  const specName = api.runtimeVersion.specName.toString();
  const staticExtensions: ExtDef = typesBundle?.spec?.[specName]?.signedExtensions ?? {};

  const dynamicExtensions: ExtDef = {};
  let dynamicCount = 0;

  for (const ext of extensions) {
    const identifier = ext.identifier.toString();

    // Skip if already known in built-in extensions or static config
    if (allExtensions[identifier] || staticExtensions[identifier]) {
      continue;
    }

    try {
      const extrinsicTypeDef = api.registry.lookup.getTypeDef(ext.type);
      const implicitTypeDef = api.registry.lookup.getTypeDef(ext.implicit);

      const extrinsic = typeDefToExtTypes(api, extrinsicTypeDef, identifier);
      const payload = typeDefToExtTypes(api, implicitTypeDef, identifier);

      dynamicExtensions[identifier] = { extrinsic, payload };

      console.log(`  ${identifier}: extrinsic=${JSON.stringify(extrinsic)}, payload=${JSON.stringify(payload)} (type info=${TypeDefInfo[extrinsicTypeDef.info]}, implicit info=${TypeDefInfo[implicitTypeDef.info]})`);

      dynamicCount++;
    } catch (error) {
      console.warn(`Dynamic extension resolution: failed to resolve "${identifier}"`, error);
    }
  }

  if (dynamicCount > 0) {
    console.log(`Dynamically resolved ${dynamicCount} signed extension(s): ${Object.keys(dynamicExtensions).join(', ')}`);

    // Merge: static takes priority over dynamic, both are passed as userExtensions
    api.registry.setSignedExtensions(
      api.registry.signedExtensions,
      { ...dynamicExtensions, ...staticExtensions }
    );
  }
}
