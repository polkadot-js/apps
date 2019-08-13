// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';

import { classes } from './util';

const rootElement = document.getElementById('tooltips');

interface Props extends BareProps {
  dataFor?: string;
  effect?: 'solid' | 'float';
  offset?: {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  place?: 'bottom' | 'top' | 'right' | 'left';
  text: React.ReactNode;
  trigger: string;
}

export default class Tooltip extends React.PureComponent<Props> {
  private tooltipContainer: HTMLElement;

  public constructor (props: Props) {
    super(props);

    this.tooltipContainer = document.createElement('div');
  }

  public componentDidMount (): void {
    if (rootElement !== null) {
      rootElement.appendChild(this.tooltipContainer);
    }
  }

  public componentWillUnmount (): void {
    if (rootElement !== null) {
      rootElement.removeChild(this.tooltipContainer);
    }
  }

  public render (): React.ReactNode {
    const { className, effect = 'solid', offset, place = 'bottom', text, trigger } = this.props;

    return ReactDOM.createPortal(
      <ReactTooltip
        id={trigger}
        delayShow={250}
        effect={effect}
        offset={offset}
        place={place}
        className={classes('ui--Tooltip', className)}
      >
        {text}
      </ReactTooltip>,
      this.tooltipContainer
    );
  }
}
