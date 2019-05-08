// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';

import { BareProps } from './types';

const rootElement = document.getElementById('tooltips');

type Props = BareProps & {
  trigger: string,
  delayShow?: number,
  place?: 'bottom' | 'top' | 'right' | 'left',
  effect?: 'solid' | 'float'
};

export default class Tooltip extends React.PureComponent<Props> {
  static defaultProps = {
    delayShow: 250,
    effect: 'solid',
    place: 'bottom',
    className: 'ui--Tooltip'
  };

  tooltipContainer: HTMLElement;

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
    const { children, trigger, delayShow, effect, place, className } = this.props;

    return ReactDOM.createPortal(
      <ReactTooltip
        id={trigger}
        delayShow={delayShow}
        effect={effect}
        place={place}
        className={className}
      >
        {children}
      </ReactTooltip>,
      this.tooltipContainer
    );
  }
}
