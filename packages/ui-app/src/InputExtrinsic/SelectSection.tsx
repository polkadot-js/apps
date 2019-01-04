// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MethodFunction } from '@polkadot/types/Method';
import { I18nProps } from '../types';
import { DropdownOptions } from '../util/types';

import React from 'react';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue?: string,
  isError?: boolean,
  label?: string,
  onChange: (value: string) => void,
  options: DropdownOptions,
  value: MethodFunction,
  withLabel?: boolean
};

class SelectSection extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isError, label = '', onChange, options, style, t, value, withLabel } = this.props;

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Sections', className)}
        defaultValue={defaultValue}
        isError={isError}
        label={label || t('input.extrinsic.section', {
          defaultValue: 'from extrinsic section'
        })}
        onChange={onChange}
        options={options}
        style={style}
        value={value.section}
        withLabel={withLabel}
      />
    );
  }
}

export default translate(SelectSection);
