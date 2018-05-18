// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param } from '@polkadot/params/types';
import type { I18nProps } from '../../types';
import type { Props as ComponentProps, ComponentsTyped, ComponentMap, RawParam } from '../types';

import React from 'react';

import typeToString from '@polkadot/params/typeToString';

import classes from '../../util/classes';
import translate from '../../translate';
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

type State = {
  Components: ComponentsTyped | null
}

class ParamComponent extends React.PureComponent<Props, State> {
  state: State = {
    Components: []
  };

  static getDerivedStateFromProps ({ overrides, value: { type } = {} }: Props): State {
    return {
      Components: !type
        ? null
        : findComponent(type, overrides)
    };
  }

  render (): React$Node {
    const { Components } = this.state;

    if (Components === null) {
      return null;
    }

    const { value: { type } } = this.props;

    // FIXME We don't handle array or tuple inputs atm
    return Array.isArray(type)
      ? this.renderUnknown()
      : this.renderComponents(Components);
  }

  renderComponents (Components: ComponentsTyped | null, startIndex: string = '0', { name, options } = this.props.value) {
    if (!Components) {
      return null;
    }

    const { className, index, onChange, style } = this.props;

    if (Array.isArray(Components)) {
      return Components.map((_Components, index) => {
        return this.renderComponents(Components, `${startIndex}-${index}`, {
          name,
          options: {}
        });
      });
    }

    return this.renderComponent(Components, startIndex, {
      className,
      index,
      name,
      onChange,
      options,
      style
    });
  }

  renderComponent = (Component: React$ComponentType<ComponentProps>, sub: string, props: $Shape<ComponentProps>): React$Node => {
    const { className, index, name, onChange, options = {}, style, type } = props;
    const text = typeToString(type);

    return (
      <Component
        className={classes('ui--Param', className)}
        index={index}
        key={`${name}:${text}:${index}}`}
        label={`${name}: ${text} (${index})`}
        onChange={onChange}
        style={style}
        value={{
          name,
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
      name,
      onChange,
      style,
      type
    });
  }
}

export default translate(ParamComponent);
