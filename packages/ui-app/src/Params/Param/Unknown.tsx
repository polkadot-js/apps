// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithNamespaces } from 'react-i18next';
import { Props as BareProps, RawParam } from '../types';

import React from 'react';

import Static from '../../Static';
import translate from '../../translate';
import BaseBytes from './BaseBytes';

type Props = BareProps & WithNamespaces & {
  defaultValue: RawParam,
  withLabel?: boolean
};

class Unknown extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, label, name, onChange, style, t, type } = this.props;

    if (isDisabled) {
      const value = defaultValue && defaultValue.value && defaultValue.value.toString();

      return (
        <Static
          label={label}
          value={value || t('unknown.empty', {
            defaultValue: 'empty'
          })}
        />
      );
    }

    return (
      <BaseBytes
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        length={-1}
        name={name}
        onChange={onChange}
        size='full'
        style={style}
        type={type}
        withLength={false}
      />
    );
  }
}

export default translate(Unknown);
