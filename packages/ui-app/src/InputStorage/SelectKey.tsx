// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import React from 'react';
import { StorageFunction } from '@polkadot/types/StorageKey';
import { withApi, withMulti } from '@polkadot/ui-react-rx/with';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = ApiProps & I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: StorageFunction) => void,
  options: DropdownOptions,
  value: StorageFunction,
  withLabel?: boolean
};

class SelectKey extends React.PureComponent<Props> {
  render () {
    const { apiPromise, className, isError, label = '', onChange, options, style, t, value, withLabel } = this.props;

    if (!options.length) {
      return null;
    }

    const transform = (method: string): StorageFunction =>
      apiPromise.query[value.section][method];

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

export default withMulti(
  SelectKey,
  translate,
  withApi
);
