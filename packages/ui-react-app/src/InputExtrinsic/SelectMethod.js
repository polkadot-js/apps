// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';

import React from 'react';
import extrinsics from '@polkadot/extrinsics-substrate';

import RxDropdown from '../RxDropdown';
import translate from '../translate';
import createOptions from './options/method';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: Extrinsic) => void,
  type: 'private' | 'public',
  value: Extrinsic
};

function SelectMethod ({ className, isError, label = '', onChange, style, t, type, value: { name, section } }: Props): React$Node {
  // $FlowFixMe string vs ...
  if (!extrinsics[section]) {
    return null;
  }

  const methods = extrinsics[section].methods[type];
  const transform = (name: string): Extrinsic =>
    methods[name];
  const options = createOptions(section, type);

  return (
    <RxDropdown
      className={['ui--RxDropdownLinked-Items', className].join(' ')}
      isError={isError}
      label={label || t('input.extrinsic.method', {
        defaultValue: 'with the extrinsic'
      })}
      onChange={onChange}
      options={options}
      style={style}
      transform={transform}
      value={name}
    />
  );
}

export default translate(SelectMethod);
