// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './CallSelect.css';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import translate from '../translate';
import { extrinsicName } from '../subjects';
import extrinsics from '../extrinsics';

type Props = BaseProps & {};

// eslint-disable-next-line no-unused-vars
const onChange = (event: SyntheticEvent<*>, { value }): void => {
  extrinsicName.next(value);
};

const options = [];

extrinsics.sections.forEach(({ description, methods, name }) => {
  options.push({
    disabled: true,
    text: description,
    value: name
  });

  methods.forEach(({ description, name }) => {
    options.push({
      className: 'extrinsics--CallSelect-indent',
      text: description,
      value: name
    });
  });
});

function CallSelect ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['extrinsics--CallSelect', 'extrinsics--split', className].join(' ')}
      style={style}
    >
      <div className='large'>
        <Label>
          {t('callselect.label', {
            defaultValue: 'submit the following extrinsic'
          })}
        </Label>
        <Dropdown
          selection
          onChange={onChange}
          options={options}
        />
      </div>
    </div>
  );
}

export default translate(CallSelect);
