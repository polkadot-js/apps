// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PortableRegistry, SiLookupTypeId } from '@polkadot/types/interfaces';

export function getSiName (lookup: PortableRegistry, type: SiLookupTypeId): string {
  const typeDef = lookup.getTypeDef(type);

  return typeDef.lookupName || typeDef.type;
}
