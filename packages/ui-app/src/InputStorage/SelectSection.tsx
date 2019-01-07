// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageFunction } from '@polkadot/types/StorageKey';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import React from 'react';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue?: StorageFunction,
  isError?: boolean,
  label?: string,
  onChange: (value: string) => void,
  options: DropdownOptions,
  value: StorageFunction,
  withLabel?: boolean
};

class SelectSection extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isError, label, onChange, options, style, t, value: { section }, withLabel } = this.props;

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Sections', className)}
        defaultValue={defaultValue}
        isError={isError}
        label={label || t('input.storage.section', {
          defaultValue: 'state section'
        })}
        onChange={onChange}
        options={options}
        style={style}
        value={section}
        withLabel={withLabel}
      />
    );
  }
}

export default translate(SelectSection);
