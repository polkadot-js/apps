// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';

import { BareProps } from './types';

const rootElement = document.getElementById('tooltips');

type Props = BareProps & {
  delayShow?: number,
  dataFor?: string,
  effect?: 'solid' | 'float'
  offset?: { bottom?: number, left?: number, right?: number, top?: number },
  place?: 'bottom' | 'top' | 'right' | 'left',
  text: React.ReactNode,
  trigger: string
};

export default class Tooltip extends React.PureComponent<Props> {
  static defaultProps = {
    delayShow: 250,
    effect: 'solid',
    place: 'bottom',
    className: 'ui--Tooltip'
  };

  private tooltipContainer: HTMLElement;

  constructor (props: Props) {
    super(props);

    this.tooltipContainer = document.createElement('div');
  }

  componentDidMount () {
    if (rootElement !== null) {
      rootElement.appendChild(this.tooltipContainer);
    }
  }

  componentWillUnmount () {
    if (rootElement !== null) {
      rootElement.removeChild(this.tooltipContainer);
    }
  }

  render () {
    const { className, delayShow, effect, offset, place, text, trigger } = this.props;

    return ReactDOM.createPortal(
      <ReactTooltip
        id={trigger}
        delayShow={delayShow}
        effect={effect}
        offset={offset}
        place={place}
        className={className}
      >
        {text}
      </ReactTooltip>,
      this.tooltipContainer
    );
  }
}
