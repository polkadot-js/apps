// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key, StateDb$SectionNames } from '@polkadot/storage/types';
import type { I18nProps } from '../types';

import React from 'react';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';
import createOptions from './options/section';

type Props = I18nProps & {
  defaultValue?: StateDb$SectionNames,
  isError?: boolean,
  label: string,
  onChange: (value: StateDb$SectionNames) => void,
  value: StorageDef$Key,
  withLabel?: boolean
};

const options = createOptions();

function SelectSection ({ className, defaultValue, isError, label, onChange, style, t, value: { section }, withLabel }: Props): React$Node {
  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Sections', className)}
      defaultValue={defaultValue}
      isError={isError}
      label={label || t('input.storage.section', {
        defaultValue: 'storage area'
      })}
      onChange={onChange}
      options={options}
      style={style}
      value={section}
      withLabel={withLabel}
    />
  );
}

export default translate(SelectSection);
