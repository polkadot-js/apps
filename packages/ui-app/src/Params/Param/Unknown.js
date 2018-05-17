// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Types } from '@polkadot/params/types';
import type { Props as BareProps } from '../types';

import React from 'react';

import typeToString from '@polkadot/params/typeToString';

import translate from '../../translate';
import Base from './Base';

type Props = BareProps & {
  t: I18Next$Translate,
  value: {
    type: Param$Types
  },
  withLabel?: boolean
};

function Unknown ({ label, t, value: { type }, withLabel }: Props): React$Node {
  return (
    <Base
      size='full'
      label={label}
      withLabel={withLabel}
    >
      <div className='ui--Param-Unknown ui dropdown error selection'>
        {t('param.unknown', {
          defaultValue: `ERROR: Unimplemented type '{{type}}' requested. No renderer exists`,
          replace: {
            type: typeToString(type)
          }
        })}
      </div>
    </Base>
  );
}

export default translate(Unknown);
