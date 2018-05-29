// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Method } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';
import type { DropdownOptions } from './types';

import React from 'react';

import extrinsics from '@polkadot/extrinsics';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: Extrinsic$Method) => void,
  options: DropdownOptions,
  type: 'private' | 'public',
  value: Extrinsic$Method,
  withLabel?: boolean
};

function SelectMethod ({ className, isError, label = '', onChange, options, style, t, type, value: { name, section }, withLabel }: Props): React$Node {
  if (!options.length) {
    return null;
  }

  const transform = (name: string): Extrinsic$Method =>
    extrinsics[section][type][name];

  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Items', className)}
      isError={isError}
      label={label || t('input.extrinsic.method', {
        defaultValue: 'with the extrinsic'
      })}
      onChange={onChange}
      options={options}
      style={style}
      transform={transform}
      value={name}
      withLabel={withLabel}
    />
  );
}

export default translate(SelectMethod);
