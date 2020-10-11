// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson, Codec, TypeDef } from '@polkadot/types/types';

import { useMemo } from 'react';
import { formatData } from '@canvas-ui/api-contract/util';
import { TypeRegistry } from '@polkadot/types';

export default function useCodec (registry: TypeRegistry, source: AnyJson, type?: TypeDef): [Codec, string] {
  return useMemo(
    (): [Codec, string] => {
      const codec = formatData(registry, source, type);

      let asString = '()';

      if (type) {
        // console.log(type);
        // console.log(codec.toString());
        asString = codec.toString();
      }

      return [codec, asString];
    },
    [registry, source, type]
  );
}
