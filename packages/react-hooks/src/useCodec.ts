// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson, Codec, TypeDef, TypeDefInfo } from '@polkadot/types/types';
import { BareProps } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { isUndefined, isNull } from '@polkadot/util';
import { formatData } from '@canvas-ui/api-contract/util';
import { Option } from '@polkadot/types'
import useApi from './useApi';
import { truncate } from '@canvas-ui/react-util';

import AddressSmall from './AddressMini';
import Labelled from './Labelled';

// interface State {
//   codec: Codec,
//   asHex: string;
//   asString: string;
// }

export default function useCodec (source: AnyJson, type?: TypeDef): [Codec, string] {
  const { api } = useApi();

  return useMemo(
    (): [Codec, string] => {
      const codec = formatData(api.registry, source, type);

      let asString = '()';

      if (type) {
        // console.log(type);
        // console.log(codec.toString());
        asString = codec.toString();
      }

      return [codec, asString];
    },
    [api, source, type]
  );
}
