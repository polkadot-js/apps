// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SectionItem } from '@polkadot/params/types';
import { Interfaces, Interface$Sections } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../InputExtrinsic/types';
import { I18nProps } from '../types';

import React from 'react';

import map from '@polkadot/jsonrpc';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: SectionItem<Interfaces>) => void,
  options: DropdownOptions,
  value: SectionItem<Interfaces>,
  withLabel?: boolean
};

function SelectMethod ({ className, isError, label = '', onChange, options, style, t, value: { name, section }, withLabel }: Props) {
  if (!options.length) {
    return null;
  }

  const transform = (name: Interface$Sections): SectionItem<Interfaces> =>
    map[section].public[name];

  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Items', className)}
      isError={isError}
      label={label || t('input.rpc.method', {
        defaultValue: 'with method name'
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
