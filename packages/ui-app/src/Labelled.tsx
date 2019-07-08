// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import LabelHelp from './LabelHelp';
import { classes } from './util';

type Props = BareProps & {
  help?: React.ReactNode,
  isHidden?: boolean,
  isSmall?: boolean,
  label?: React.ReactNode,
  labelExtra?: React.ReactNode,
  children: React.ReactNode,
  withLabel?: boolean,
  withEllipsis?: boolean
};

const defaultLabel: React.ReactNode = (
  <div>&nbsp;</div>
);

const Wrapper = styled.div`
  display: block;
  position: relative;

  .withEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.label-small {
    display: block;

    > label {
      margin: 0;
      min-width: 0;
      padding-right: 0;
    }
  }

  &:not(.label-small) {
    padding-left: 2rem;

    > label,
    .labelExtra {
      position: absolute;
      text-align: left;
      top: 0.5rem;
      z-index: 1;
    }

    > label {
      left: 3.55rem;
      text-align: left;
    }

    .labelExtra {
      color: rgba(78, 78, 78, .75);
      font-weight: 100;
      right: 1.75rem;
      text-align: right;
    }

    > .ui--Labelled-content {
      box-sizing: border-box;
      flex: 1 1;
      min-width: 0;

      .ui.selection.dropdown {
        &:not(.floating) {
          padding-left: 1.45rem;
          padding-top: 1.75rem;
        }

        &.floating {
          > .dropdown.icon {
            top: 1.25rem;
          }

          .text {
            padding: 0.45rem 0
          }
        }

        &.search:not(.multiple) > input.search {
          padding-left: 1.45rem;
          padding-top: 1.75rem;
        }

        > .delete.icon,
        > .dropdown.icon,
        > .search.icon {
          top: 1.75rem;
        }
      }

      .ui.input > input,
      .ui--output {
        padding-left: 1.45rem;
        padding-top: 1.75rem;
      }

      .ui--InputFile,
      .ui--Messages {
        padding-left: 1.45rem;
        padding-top: 2rem;
      }
    }
  }
`;

export default class Labelled extends React.PureComponent<Props> {
  render () {
    const { className, children, help, isSmall, isHidden, label = defaultLabel, labelExtra, style, withEllipsis, withLabel = true } = this.props;

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
        <label>
          {
            withEllipsis
              ? <div className='withEllipsis'>{label}</div>
              : label
          }{help && <LabelHelp help={help} />}
        </label>
        {labelExtra && <div className='labelExtra'>{labelExtra}</div>}
        <div className='ui--Labelled-content'>
          {children}
        </div>
      </Wrapper>
    );
  }
}
