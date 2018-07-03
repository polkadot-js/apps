// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SectionItem } from '@polkadot/params/types';
import { Storages } from '@polkadot/storage/types';
import { DropdownOptions } from '../InputExtrinsic/types';
import { I18nProps } from '../types';

import React from 'react';

import map from '@polkadot/storage';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: SectionItem<Storages>) => void,
  options: DropdownOptions,
  value: SectionItem<Storages>,
  withLabel?: boolean
};

function SelectKey ({ className, isError, label = '', onChange, options, style, t, value: { name, section }, withLabel }: Props) {
  if (!options.length) {
    return null;
  }

  const transform = (name: string): SectionItem<Storages> =>
    map[section].public[name];

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
