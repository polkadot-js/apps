// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import classes from './util/classes';

type Item = {
  name: string,
  text: React.ReactNode
};

type Props = BareProps & {
  activeItem: string,
  items: Array<Item>,
  onChange: (name: any) => void
};

type State = {
  active: string
};

export default class Tabs extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      active: props.activeItem
    };
  }

  render () {
    const { className, activeItem, items, style } = this.props;
    const { active } = this.state;
    const currentItem = active || activeItem;

    return (
      <div
        className={classes('ui--Menu', 'ui menu tabular', className)}
        style={style}
      >
        {items.map(({ name, text }) => (
          <a
            className={classes('item', currentItem === name ? 'active' : '')}
            key={name}
            onClick={this.onSelect(name)}
          >
            {text}
          </a>
        ))}
      </div>
    );
  }

  private onSelect = (name: string) => {
    return (): void => {
      const { onChange } = this.props;

      this.setState({ active: name }, () => {
        onChange(name);
      });
    };
  }
}
