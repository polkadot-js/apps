// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { BaseProps, Props as ComponentProps, ComponentMap } from '../types';

import React from 'react';
import styled from 'styled-components';
import { classes } from '@polkadot/ui-app/util';
import translate from '@polkadot/ui-app/translate';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';

const Type = styled.span`
  font-family: monospace;
`;

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

    const { className, defaultValue, isDisabled, name, onChange, onEnter, style, type } = this.props;

    return (
      <Component
        className={classes('ui--Param', className)}
        defaultValue={defaultValue}
        key={`${name}:${type}`}
        isDisabled={isDisabled}
        label={
          <Type>
            {isUndefined(name)
              ? type.type
              : `${name}: ${type.type}`}
          </Type>
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
