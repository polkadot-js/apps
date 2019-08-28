// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { BaseProps, Props as ComponentProps, ComponentMap } from '../types';

import React from 'react';
import { classes } from '@polkadot/react-components/util';
import translate from '@polkadot/react-components/translate';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';

interface Props extends I18nProps, BaseProps {
  isDisabled?: boolean;
  overrides?: ComponentMap;
}

interface State {
  Component: React.ComponentType<ComponentProps> | null;
}

class ParamComponent extends React.PureComponent<Props, State> {
  public state: State = {
    Component: null
  };

  public static getDerivedStateFromProps ({ overrides, type }: Props): State {
    return {
      Component: !type
        ? null
        : findComponent(type, overrides)
    };
  }

  public render (): React.ReactNode {
    const { Component } = this.state;

    if (Component === null) {
      return null;
    }

    const { className, defaultValue, isDisabled, isOptional, name, onChange, onEnter, style, type } = this.props;

    return (
      <Component
        className={classes('ui--Param', className)}
        defaultValue={defaultValue}
        key={`${name}:${type}`}
        isDisabled={isDisabled}
        isOptional={isOptional}
        label={
          isUndefined(name)
            ? type.type
            : `${name}: ${type.type}`
        }
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        style={style}
        type={type}
      />
    );
  }
}

export default translate(ParamComponent);
