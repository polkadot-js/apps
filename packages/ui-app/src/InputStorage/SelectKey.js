// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Storage$Key } from '@polkadot/storage/types';
import type { DropdownOptions } from '../InputExtrinsic/types';
import type { I18nProps } from '../types';

import React from 'react';

import map from '@polkadot/storage-substrate';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: Storage$Key) => void,
  options: DropdownOptions,
  value: Storage$Key,
  withLabel?: boolean
};

function SelectKey ({ className, isError, label = '', onChange, options, style, t, value: { name, section }, withLabel }: Props): React$Node {
  if (!options.length) {
    return null;
  }

  const transform = (name: string): Storage$Key =>
    map[section].keys[name];

  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Items', className)}
      isError={isError}
      label={label || t('input.storage.key', {
        defaultValue: 'with storage key'
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

export default translate(SelectKey);
