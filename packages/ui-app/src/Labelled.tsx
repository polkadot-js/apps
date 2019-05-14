// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import media from './media';
import { classes } from './util';
import Tooltip from './Tooltip';

type Props = BareProps & {
  help?: React.ReactNode,
  isHidden?: boolean,
  isSmall?: boolean,
  label?: React.ReactNode,
  children: React.ReactNode,
  withLabel?: boolean
};

type State = {
  tooltipOpen: boolean
};

const defaultLabel: any = (// node?
  <div>&nbsp;</div>
);

const Wrapper = styled.div`
  display: block;

  > label {
    margin: 0.25rem 0 0 0;
    padding-right: 0.5rem;
    position: relative;
    text-align: left;

    i.icon.help {
      margin: 0 0 0 0.25rem;
      line-height: 1rem;
      cursor: help;
    }
  }

  &.label-small {
    display: block;

    > label {
      margin: 0;
      min-width: 0;
      padding-right: 0;
    }
  }

  > .ui--Labelled-content {
    box-sizing: border-box;
    flex: 1 1;
    min-width: 0;
  }

  ${media.DESKTOP`
    align-items: flex-start;
    display: flex;
    flex: 1 1;
    margin: 0;
    text-align: left;

    > label {
      align-items: center;
      display: flex;
      flex: 0 0 15rem;
      justify-content: flex-end;
      min-height: 2.715rem; /* more-or-less 2 lines with adjustments, 38px as per input box */
      min-width: 15rem;
      text-align: right;
    }
  `}
`;

export default class Labelled extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      tooltipOpen: false
    };
  }

  toggleTooltip () {
    const { tooltipOpen } = this.state;
    this.setState({ tooltipOpen: !tooltipOpen });
  }

  renderLabel () {
    const { help, label = defaultLabel } = this.props;
    const { tooltipOpen } = this.state;

    return help
      ? <label className='with-help' >
          {label}
          <Icon
            name='help circle'
            data-tip
            data-for='controlled-trigger'
            onMouseOver={() => this.toggleTooltip()}
            onMouseOut={() => this.toggleTooltip()}
          />
          {tooltipOpen && (
            <Tooltip trigger={'controlled-trigger'}>
              {help}
            </Tooltip>)}
        </label>
      : <label>{label}</label>;
  }
  render () {
    const { className, children, isSmall, isHidden, style, withLabel = true } = this.props;

    if (isHidden) {
      return null;
    } else if (!withLabel) {
      return (
        <div className={className}>{children}</div>
      );
    }

    return (
      <Wrapper
        className={classes('ui--Labelled', isSmall ? 'label-small' : '', className)}
        style={style}
      >
        {this.renderLabel()}
        <div className='ui--Labelled-content'>
          {children}
        </div>
      </Wrapper>
    );
  }
}
