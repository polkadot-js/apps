// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { I18nProps } from '../types';

import React from 'react';

import map from '@polkadot/storage-substrate/keys';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';
import createOptions from './options/key';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: StorageDef$Key) => void,
  value: StorageDef$Key,
  withLabel?: boolean
};

function SelectKey ({ className, isError, label = '', onChange, style, t, value: { name, section }, withLabel }: Props): React$Node {
  // $FlowFixMe string vs ...
  if (!map[section]) {
    return null;
  }

  const keys = map[section].keys;
  const transform = (name: string): StorageDef$Key =>
    keys[name];
  const options = createOptions(section);

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
