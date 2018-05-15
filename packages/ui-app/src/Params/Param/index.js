// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param } from '@polkadot/params/types';
import type { I18nProps } from '../../types';
import type { BaseProps, ComponentMap, RawParam } from '../types';

import React from 'react';

import classes from '../../util/classes';
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
  // flowlint-next-line unclear-type:off
  Components: React$ComponentType<any> | Array<React$ComponentType<any>>
  | null
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
      : this.renderComponents();
  }

  // flowlint-next-line unclear-type:off
  renderComponents = (_Components: React$ComponentType<any> | Array<React$ComponentType<any>> | null = this.state.Components, startIndex: string = '0', { name, type, options = {} } = this.props.value) => {
    if (!_Components) {
      return null;
    }

    const { className, index, onChange, style } = this.props;

    if (!Array.isArray(type)) {
      // flowlint-next-line unclear-type:off
      const Component = ((_Components: any): React$ComponentType<any>);

      return this.renderComponent(Component, startIndex, {
        className,
        index,
        onChange,
        style,
        value: {
          name,
          type,
          options
        }
      });
    }

    // flowlint-next-line unclear-type:off
    const Components = ((_Components: any): Array<React$ComponentType<any>>);

    return Components.map((Component, index) => {
      return this.renderComponents(Component, `${startIndex}-${index}`, {
        name,
        type: type[index],
        options: {}
      });
    });
  }

  // flowlint-next-line unclear-type:off
  renderComponent = (Component: React$ComponentType<any>, sub: string, props: ComponentProps): React$Node => {
    const { className, index, onChange, style, value: { name, type, options = {} } } = props;
    const text = typeToText(type);

    return (
      <Component
        className={classes('ui--Param', className)}
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
