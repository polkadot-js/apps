// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Types } from '@polkadot/params/types';
import type { I18nProps } from '../../types';
import type { ComponentProps, ComponentMap, RawParam } from '../types';

import React from 'react';

import typeToString from '@polkadot/params/typeToString';

import classes from '../../util/classes';
import translate from '../../translate';
import findComponent from './findComponent';

type Props = I18nProps & {
  index: number,
  name: Stringg,
  overrides?: ComponentMap,
  onChange: (index: number, value: RawParam) => void,
  type: Param$Types,
  value: RawParam
};

type State = {
  Component: React$ComponentType<ComponentProps> | null
}

class ParamComponent extends React.PureComponent<Props, State> {
  state: State = {
    Component: null
  };

  static getDerivedStateFromProps ({ overrides, type }: Props): State {
    return {
      Component: !type
        ? null
        : findComponent(type, overrides)
    };
  }

  render (): React$Node {
    const { Component } = this.state;

    if (Component === null) {
      return null;
    }

    const { className, defaultValue, index, name, onChange, style, type } = this.props;
    const text = typeToString(type);

    return (
      <Component
        className={classes('ui--Param', className)}
        defaultValue={defaultValue}
        index={index}
        key={`${name}:${text}:${index}}`}
        label={`${name}: ${text} (${index})`}
        onChange={onChange}
        style={style}
      />
    );
  }
}

export default translate(ParamComponent);
