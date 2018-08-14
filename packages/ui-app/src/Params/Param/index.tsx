// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '../../types';
import { BaseProps, Props as ComponentProps, ComponentMap } from '../types';

import React from 'react';

import typeToString from '@polkadot/params/typeToString';

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

  static getDerivedStateFromProps ({ defaultValue: { type }, isDisabled, overrides }: Props): State {
    return {
      Component: !type
        ? null
        : findComponent(type, overrides, isDisabled)
    } as State;
  }

  render () {
    const { Component } = this.state;

    if (Component === null) {
      return null;
    }

    const { className, defaultValue, isDisabled, name, onChange, style } = this.props;
    const type = typeToString(defaultValue.type);

    return (
      <Component
        className={classes('ui--Param', className)}
        defaultValue={defaultValue}
        key={`${name}:${type}`}
        isDisabled={isDisabled}
        label={`${name}: ${type}`}
        name={name}
        onChange={onChange}
        style={style}
      />
    );
  }
}

export default translate(ParamComponent);
