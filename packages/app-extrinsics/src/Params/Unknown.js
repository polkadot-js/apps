// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props as BaseProps } from './types';

import React from 'react';

import translate from '../translate';
import Base from './Base';

type Props = BaseProps & {
  t: I18Next$Translate
};

function Unknown ({ label, t, value: { type } }: Props): React$Node {
  return (
    <Base
      size='full'
      label={label}
    >
      <div className='extrinsics--Param-Unknown ui disabled dropdown selection'>
        {t('param.unknown', {
          defaultValue: `ERROR: Unknown input of type '{{type}}' found. No renderer exists`,
          replace: {
            type
          }
        })}
      </div>
    </Base>
  );
}

export default translate(Unknown);
