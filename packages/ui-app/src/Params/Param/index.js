// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param, Param$Type } from '@polkadot/primitives/param';
import type { I18nProps } from '../../types';
import type { ComponentMap, RawParam } from '../types';

import React from 'react';

import translate from '../../translate';
import typeToText from '../typeToText';
import findComponent from './findComponent';

type Props = I18nProps & {
  index: number,
  overrides?: ComponentMap,
  onChange: (value: RawParam) => void,
  value: Param & {
    name: string
  };
};

type State = {
  Component: React$ComponentType<*> | Array<React$ComponentType<*>> | null
}

class ParamComponent extends React.PureComponent<Props, State> {
  state: State = {
    Component: null
  };

  static getDerivedStateFromProps ({ overrides, value: { type } = {} }: Props): State {
    return {
      Component: !type
        ? null
        : findComponent(type, overrides)
    };
  }

  render (): React$Node {
    const { Component } = this.state;

    if (!Component) {
      return null;
    }

    return Array.isArray(Component)
      ? Component.map(this.renderComponent)
      : this.renderComponent(Component);
  }

  renderComponent = (Component: React$ComponentType<*>, sub: number = -1): React$Node => {
    const { className, index, onChange, style, value: { name, type, options = {} } = {} } = this.props;
    const _type: Param$Type = Array.isArray(type)
      ? type[sub]
      : type;
    const text = typeToText(_type);
    const labelExtra = sub === -1
      ? ''
      : ` (${index})`;

    return (
      <Component
        className={['ui--Param', className].join(' ')}
        index={index}
        key={`${name}:${text}:${index}}`}
        label={`${name}: ${text}${labelExtra}`}
        // FIXME subjects are not for array components (as defined here)
        onChange={onChange}
        style={style}
        value={{
          options,
          type: _type
        }}
      />
    );
  }
}

export default translate(ParamComponent);
