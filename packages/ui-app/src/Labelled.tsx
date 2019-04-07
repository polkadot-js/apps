// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import { classes } from './util';
import styled from 'styled-components';

type Props = BareProps & {
  children: React.ReactNode,
  help?: React.ReactNode,
  isHidden?: boolean,
  isSmall?: boolean,
  label?: React.ReactNode,
  hasInput?: boolean,
  minLabel?: boolean,
  withLabel?: boolean
};

const StyledLabelled = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1;
  position: relative;
  text-align: left;

  &.has-input {
    padding: 1.6rem 0;

    > div {
      z-index: 2;
      input {
        background: none !important;
      }
    }
  }
`;

const Label = styled.label`
  &.default {
    flex: 0 0 15rem;
    min-width: 15rem;
    padding-right: 0.5rem;
    text-align: right;
  }
  &.has-input {
    left: 0.8em;
    position: absolute;
    top: 2.3em;
    transition: top 0.2s cubic-bezier(0.215, 0.61, 0.355, 1), left 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
    width: 100%;
    z-index: 1;
    opacity: 0.75;
  }

  &.min-label {
    left: 0;
    top: 0em;
    font-size: 0.9em;
    opacity: 1;
  }
`;

const InputBackground = styled.span`
  background: #fff;
  height: 2.6em;
  position: absolute;
  top: 1.8em;
  width: 100%;
  z-index: 0;
`;

const defaultLabel: any = (// node?
  <div>&nbsp;</div>
);

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1;
  text-align: left;

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

  > label {
    flex: 0 0 15rem;
    min-width: 15rem;
    padding-right: 0.5rem;
    position: relative;
    text-align: right;
    z-index: 1;

    .help-hover {
      background: #4e4e4e;
      border-radius: 0.25rem;
      color: #eee;
      display: none;
      padding: 0.5rem 1rem;
      position: absolute;
      text-align: left;
      top: 0.5rem;
      left: 2.5rem;
      right: -5rem;
      z-index: 10;
    }

    .icon.help {
      margin-right: 0;
    }

    &.with-help:hover .help-hover {
      display: block;
    }
  }
`;

export default class Labelled extends React.PureComponent<Props> {
  render () {
    const { className, children, help, minLabel, hasInput = false, isSmall, isHidden, label = defaultLabel, style, withLabel = true } = this.props;

    if (isHidden) {
      return null;
    } else if (!withLabel) {
      return (
        <div className={className}>{children}</div>
      );
    }

    const labelNode = help
      ? <label className='with-help'>{label} <Icon name='help circle' /><div className='help-hover'>{help}</div></label>
      : <label>{label}</label>;

    return (
      <StyledLabelled
        className={
          classes(
            'ui--Labelled',
            isSmall ? 'label-small' : '', className,
            hasInput ? 'has-input' : ''
          )
        }
        style={style}
      >
        <Label
          className={
            classes(
              hasInput ? 'has-input' : '',
              (minLabel && hasInput) ? 'min-label' : ''
            )
          }
        >
          {label}
        </Label>
        {hasInput && <InputBackground />}
        <div className='ui--Labelled-content'>
          {children}
        </div>
      </StyledLabelled>
    );
  }
}
