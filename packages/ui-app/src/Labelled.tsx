// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import media from './media';
import { classes } from './util';

type Props = BareProps & {
  help?: React.ReactNode,
  isHidden?: boolean,
  isSmall?: boolean,
  label?: React.ReactNode,
  children: React.ReactNode,
  withLabel?: boolean
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
    z-index: 1;

    .help-hover {
      background: #222;
      border-radius: 0.25rem;
      color: #fff;
      display: none;
      padding: 0.5rem 1rem;
      position: absolute;
      text-align: left;
      top: 0.5rem;
      left: 2.5rem;
      right: -5rem;
      z-index: 10;
    }

    i.icon.help {
      margin: 0 0 0 0.25rem;
      line-height: 1rem;
    }

    &.with-help:hover .help-hover {
      display: block;
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

export default class Labelled extends React.PureComponent<Props> {
  render () {
    const { className, children, help, isSmall, isHidden, label = defaultLabel, style, withLabel = true } = this.props;

    if (isHidden) {
      return null;
    } else if (!withLabel) {
      return (
        <div className={className}>{children}</div>
      );
    }

    const labelNode = help
      ? <label className='with-help'>{label}<Icon name='help circle' /><div className='help-hover'>{help}</div></label>
      : <label>{label}</label>;

    return (
      <Wrapper
        className={classes('ui--Labelled', isSmall ? 'label-small' : '', className)}
        style={style}
      >
        {labelNode}
        <div className='ui--Labelled-content'>
          {children}
        </div>
      </Wrapper>
    );
  }
}
