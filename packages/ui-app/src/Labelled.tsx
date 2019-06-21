// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import LabelHelp from './LabelHelp';
// import media from './media';
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
  padding-top: 0.25rem;
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
    > label,
    .labelExtra {
      position: absolute;
      text-align: left;
      top: 0.75rem;
      z-index: 1;
    }

    > label {
      left: 4.1rem;
      text-align: left;
    }

    .labelExtra {
      right: 1rem;
      text-align: right;
    }

    > .ui--Labelled-content {
      box-sizing: border-box;
      flex: 1 1;
      min-width: 0;

      .ui.selection.dropdown {
        padding-top: 2rem;

        &:not(.button) {
          padding-left: 4rem;
        }

        &.search > input.search {
          padding-top: 2rem;
        }

        > .delete.icon,
        > .dropdown.icon,
        > .search.icon {
          top: 2rem;
        }
      }

      .ui.input > input,
      .ui--output {
        padding-left: 4rem;
        padding-top: 2rem;
      }
    }

    &.ui--InputAddress > .ui--Labelled-content {
      .ui.selection.dropdown:not(.multiple) {
        padding-left: 1rem;
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
