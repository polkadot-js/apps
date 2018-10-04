// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import React from 'react';
import { StorageFunction } from '@polkadot/types/StorageKey';
// FIXME These should be created dynamically created via fromMetadata (storage)
import map from '@polkadot/storage/static';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: StorageFunction) => void,
  options: DropdownOptions,
  value: StorageFunction,
  withLabel?: boolean
};

class SelectKey extends React.PureComponent<Props> {
  render () {
    const { className, isError, label = '', onChange, options, style, t, value, withLabel } = this.props;

    if (!options.length) {
      return null;
    }

    const transform = (method: string): StorageFunction =>
      map[value.section][method];

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Items', className)}
        isError={isError}
        label={label || t('input.storage.key', {
          defaultValue: 'with state key'
        })}
        onChange={onChange}
        options={options}
        style={style}
        transform={transform}
        value={value.method}
        withLabel={withLabel}
      />
    );
  }
}

export default translate(SelectKey);
