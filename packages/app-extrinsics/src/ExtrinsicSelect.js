// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import InputExtrinsic from './InputExtrinsic';
import translate from './translate';
import { extrinsicName } from './subjects';

type Props = BaseProps & {};

function ExtrinsicSelect ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['ui--ExtrinsicSelect', 'extrinsics--split', className].join(' ')}
      style={style}
    >
      <div className='large'>
        <Label>
          {t('callselect.label', {
            defaultValue: 'submit the following extrinsic'
          })}
        </Label>
        <InputExtrinsic subject={extrinsicName} />
      </div>
    </div>
  );
}

export default translate(ExtrinsicSelect);
