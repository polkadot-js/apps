// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { BareProps } from './types';

import React from 'react';
import { Icon, Tooltip } from '@polkadot/ui-app';

type Props = BareProps & {
  help?: string;
};

type State = {
  tooltipOpen: boolean
};

export default class HelpIcon extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      tooltipOpen: false
    };
  }

  render () {
    const { help } = this.props;
    const { tooltipOpen } = this.state;

    if (!help) {
      return null;
    }

    return (
    <>
      <Icon
        name='help circle'
        data-tip
        data-for='controlled-trigger'
        onMouseOver={this.toggleTooltip}
        onMouseOut={this.toggleTooltip}
      />
      {tooltipOpen && (
        <Tooltip
          text={help}
          trigger='controlled-trigger'
        />
      )}
    </>
    );
  }

  private toggleTooltip = () => {
    this.setState(({ tooltipOpen }) => ({
      tooltipOpen: !tooltipOpen
    }));
  }
}
