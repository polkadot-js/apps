// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';
import { ParamDef } from '@canvas-ui/react-params/types';
import React from 'react';

import { encodeTypeDef } from '@polkadot/types';
import { CodecArg, Registry } from '@polkadot/types/types';

import Data from './Data';

export interface Props extends BareProps {
  arg?: ParamDef;
  param?: CodecArg;
  registry?: Registry;
}

function MessageArg ({ arg, param, registry }: Props): React.ReactElement<Props> | null {
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
          ? <b>
            <Data
              registry={registry}
              type={arg.type}
              value={param}
            />
          </b>
          : encodeTypeDef(arg.type)
        }
      </span>
    </>
  );
}

export default React.memo(MessageArg);
