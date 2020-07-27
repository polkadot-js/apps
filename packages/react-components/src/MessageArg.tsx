// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIArgBase } from '@polkadot/api-contract/types';
import { BareProps } from '@canvas-ui/react-components/types';
import { CodecArg } from '@polkadot/types/types';

import React from 'react';
import { displayType } from '@polkadot/types';

import { truncate } from '@canvas-ui/react-util';

export interface Props extends BareProps {
  arg?: ContractABIArgBase;
  param?: CodecArg;
}

function MessageArg ({ arg, param }: Props): React.ReactElement<Props> | null {
  if (!arg) {
    return null;
  }

  return (
    <>
      {arg.name}:
      {' '}
      <span>
        {param
          ? <b>{truncate(param.toString())}</b>
          : displayType(arg.type)
        }
      </span>
    </>
  );
}

export default React.memo(MessageArg);
