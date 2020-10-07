// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InkMessageParam } from '@polkadot/api-contract/types';
import { BareProps } from '@canvas-ui/react-components/types';
import { CodecArg } from '@polkadot/types/types';

import React from 'react';
import { displayType } from '@polkadot/types';

import { truncate } from '@canvas-ui/react-util';

export interface Props extends BareProps {
  arg?: InkMessageParam;
  param?: CodecArg;
}

function MessageArg ({ arg, param }: Props): React.ReactElement<Props> | null {
  if (!arg) {
    return null;
  }

  console.log('cuntoff');
  console.log(arg);
  console.log(arg.type);

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
