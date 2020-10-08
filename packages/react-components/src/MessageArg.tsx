// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';
import { ParamDef } from '@canvas-ui/react-params/types';
import { CodecArg } from '@polkadot/types/types';

import React from 'react';
import { displayType } from '@polkadot/types';

import { truncate } from '@canvas-ui/react-util';

export interface Props extends BareProps {
  arg?: ParamDef;
  param?: CodecArg;
}

function MessageArg ({ arg, param }: Props): React.ReactElement<Props> | null {
  if (!arg) {
    return null;
  }

  return (
    <>
      {arg.name && (
        <>
          {arg.name}
          {': '}
        </>
      )}
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
