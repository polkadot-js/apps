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
  onChange: (value: string) => void,
  options: DropdownOptions,
  value: StorageFunction
};

class SelectSection extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isError, onChange, options, style, t, value: { section } } = this.props;

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Sections', className)}
        defaultValue={defaultValue}
        isError={isError}
        onChange={onChange}
        options={options}
        style={style}
        value={section}
        withLabel={false}
      />
    );
  }
}

export default translate(SelectSection);
