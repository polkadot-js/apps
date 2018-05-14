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
  onChange: (index: number, value: RawParam) => void,
  value: Param & {
    name: string
  };
};

type ComponentProps = BaseProps & {
  index: number
};

type State = {
  Components: React$ComponentType<*> | Array<React$ComponentType<*>>
}

class ParamComponent extends React.PureComponent<Props, State> {
  state: State = {
    Components: []
  };

  static getDerivedStateFromProps ({ overrides, value: { type } = {} }: Props): State {
    return {
      Components: !type
        ? []
        : findComponent(type, overrides)
    };
  }

  render (): React$Node {
    const { Components } = this.state;

    if (!Components || !Components.length) {
      return null;
    }

    const { value: { type } } = this.props;

    // FIXME We don't handle array or tuple inputs atm
    return Array.isArray(type) || Array.isArray(Components)
      ? this.renderUnknown()
      : this.renderComponents();
  }

  renderComponents = (Components: React$ComponentType<*> | Array<React$ComponentType<*>> = this.state.Components, startIndex: string = '0', { name, type, options = {} } = this.props.value): Array<React$Node> => {
    const { className, index, onChange, style } = this.props;

    if (Array.isArray(Components)) {
      return [];
    }

    return [
      this.renderComponent(Components, startIndex, {
        className,
        index,
        onChange,
        style,
        value: {
          name,
          type,
          options
        }
      })
    ];
  }

  renderComponent = (Component: React$ComponentType<*>, sub: string, props: ComponentProps): React$Node => {
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

  renderUnknown = (): React$Node => {
    const { className, index, onChange, style, value: { name, type } = {} } = this.props;

    return this.renderComponent(Unknown, '0', {
      className,
      index,
      onChange,
      style,
      value: {
        name,
        type
      }
    });
  }
}

export default translate(ParamComponent);
