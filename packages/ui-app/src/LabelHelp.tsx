// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import { classes } from './util';
import Tooltip from './Tooltip';

type Props = BareProps & {
  help: React.ReactNode
};

type State = {
  tooltipOpen: boolean
};

const Wrapper = styled.div`
  cursor: help;
  display: inline-block;
  line-height: 1rem;
  margin: 0 0 0 0.25rem;
`;

export default class LabelHelp extends React.PureComponent<Props, State> {
  state: State = {
    tooltipOpen: false
  };

  render () {
    const { className, help, style } = this.props;
    const { tooltipOpen } = this.state;

    return (
      <Wrapper
        className={classes('ui--LabelHelp', className)}
        style={style}
      >
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
      </Wrapper>
    );
  }

  private toggleTooltip = () => {
    this.setState(({ tooltipOpen }) => ({
      tooltipOpen: !tooltipOpen
    }));
  }
}
