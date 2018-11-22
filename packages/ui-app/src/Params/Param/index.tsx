// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '../../types';
import { BaseProps, Props as ComponentProps, ComponentMap } from '../types';

import React from 'react';
import { isUndefined } from '@polkadot/util';

import classes from '../../util/classes';
import translate from '../../translate';
import findComponent from './findComponent';

type Props = I18nProps & BaseProps & {
  isDisabled?: boolean,
  overrides?: ComponentMap
};

type State = {
  Component: React.ComponentType<ComponentProps> | null
};

class ParamComponent extends React.PureComponent<Props, State> {
  state: State = {
    Component: null
  };

  static getDerivedStateFromProps ({ overrides, type }: Props): State {
    return {
      Component: !type
        ? null
        : findComponent(type, overrides)
    } as State;
  }

  render () {
    const { Component } = this.state;

    if (Component === null) {
      return null;
    }

    const { className, defaultValue, isDisabled, name, onChange, style, type } = this.props;

    return (
      <Component
        className={classes('ui--Param', className)}
        defaultValue={defaultValue}
        key={`${name}:${type}`}
        isDisabled={isDisabled}
        label={
          isUndefined(name)
            ? type.type
            : `${name}: ${type.type}`
        }
        name={name}
        onChange={onChange}
        style={style}
        type={type}
      />
    );
  }
}

export default translate(ParamComponent);
