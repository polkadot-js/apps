// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Storage$Key, Storage$Sections } from '@polkadot/storage/types';
import type { DropdownOptions } from '../InputExtrinsic/types';
import type { I18nProps } from '../types';

import React from 'react';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue?: Storage$Sections,
  isError?: boolean,
  label: string,
  onChange: (value: Storage$Sections) => void,
  options: DropdownOptions,
  value: Storage$Key,
  withLabel?: boolean
};

function SelectSection ({ className, defaultValue, isError, label, onChange, options, style, t, value: { section }, withLabel }: Props): React$Node {
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
