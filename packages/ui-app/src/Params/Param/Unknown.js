// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props as BareProps, RawParam } from '../types';

import React from 'react';

import typeToString from '@polkadot/params/typeToString';

import translate from '../../translate';
import Base from './Base';

type Props = BareProps & {
  defaultValue: RawParam,
  t: I18Next$Translate,
  withLabel?: boolean
};

function Unknown ({ defaultValue: { type }, label, t, withLabel }: Props): React$Node {
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
