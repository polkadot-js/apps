// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param } from '@polkadot/params/types';
import type { I18nProps } from '../../types';
import type { BaseProps, ComponentMap, RawParam } from '../types';

import React from 'react';

import translate from '../../translate';
import typeToText from '../typeToText';
import findComponent from './findComponent';
import Unknown from './Unknown';

type Props = I18nProps & {
  index: number,
  overrides?: ComponentMap,
  onChange: (value: RawParam) => void,
  value: Param & {
    name: string
  };
};

type ComponentProps = BaseProps;

type State = {
  Components: Array<React$ComponentType<*>> | null
}

class ParamComponent extends React.PureComponent<Props, State> {
  state: State = {
    Component: null
  };

  static getDerivedStateFromProps ({ overrides, value: { type } = {} }: Props): State {
    return {
      Components: !type
        ? null
        : findComponent(type, overrides)
    };
  }

  render (): React$Node {
    const { className, index, onChange, style, value: { name, type, options = {} } = {} } = this.props;
    const { Components } = this.state;

    if (!Components) {
      return null;
    }

    const baseProps = ({
      className,
      index,
      onChange,
      style
    }: $Shape<ComponentProps>);

    // FIXME We don't handle array or tuple inputs atm
    return Array.isArray(type)
      ? this.renderComponent(Unknown, 0, {
        ...baseProps,
        value: {
          name,
          type
        }
      })
      : Components.map((Component, rIndex) =>
        this.renderComponent(Component, rIndex, {
          ...baseProps,
          value: {
            name,
            type,
            options
          }
        })
      );
  }

  renderComponent = (Component: React$ComponentType<*>, sub: number, props: ComponentProps): React$Node => {
    const { className, index, onChange, style, value: { name, type, options = {} } } = props;
    const text = typeToText(type);

    return (
      <Component
        className={['ui--Param', className].join(' ')}
        index={index}
        key={`${name}:${text}:${index}}`}
        label={`${name}: ${text} (${index})`}
        onChange={onChange}
        style={style}
        value={{
          options,
          type
        }}
      />
    );
  }
}

export default translate(ParamComponent);
