// Copyright 2017-2026 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { TypeDef } from '@polkadot/types-create/types';
import type { ExtDef, ExtTypes } from '@polkadot/types/extrinsic/signedExtensions/types';

import { typesBundle } from '@polkadot/apps-config';
import { encodeTypeDef, TypeDefInfo } from '@polkadot/types-create';
import { allExtensions } from '@polkadot/types/extrinsic/signedExtensions';

/**
 * Convert a TypeDef (from the portable registry) into an ExtTypes field mapping.
 * - Null / empty tuple → {} (no fields)
 * - Struct with named sub fields → { fieldName: encodedType }
 * - Anything else → {} with a warning
 */
function typeDefToExtTypes (api: ApiPromise, typeDef: TypeDef): ExtTypes {
  if (typeDef.info === TypeDefInfo.Null) {
    return {};
  }

  if (typeDef.info === TypeDefInfo.Tuple) {
    // Empty tuple () is Null, but a non-empty tuple with no named fields
    // can't be mapped to ExtTypes. If sub is empty or undefined, treat as empty.
    if (!typeDef.sub || (Array.isArray(typeDef.sub) && typeDef.sub.length === 0)) {
      return {};
    }

    console.warn('Dynamic extension resolution: tuple type with fields encountered, treating as no-effect');

    return {};
  }

  if (typeDef.info === TypeDefInfo.Struct) {
    const sub = typeDef.sub;

    if (!sub) {
      return {};
    }

    const fields = Array.isArray(sub) ? sub : [sub];

    // Check that all fields are named
    if (fields.length > 0 && fields.every((f) => f.name)) {
      const result: ExtTypes = {};

      for (const field of fields) {
        result[field.name as string] = encodeTypeDef(api.registry, field);
      }

      return result;
    }

    console.warn('Dynamic extension resolution: struct with unnamed fields encountered, treating as no-effect');

    return {};
  }

  console.warn(`Dynamic extension resolution: unexpected type info ${TypeDefInfo[typeDef.info]}, treating as no-effect`);

  return {};
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

      dynamicExtensions[identifier] = {
        extrinsic: typeDefToExtTypes(api, extrinsicTypeDef),
        payload: typeDefToExtTypes(api, implicitTypeDef)
      };

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
