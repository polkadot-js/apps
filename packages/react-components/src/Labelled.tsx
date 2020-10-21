// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import LabelHelp from './LabelHelp';

interface Props {
  className?: string;
  help?: React.ReactNode;
  isHidden?: boolean;
  isFull?: boolean;
  isOuter?: boolean;
  isSmall?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  children: React.ReactNode;
  withEllipsis?: boolean;
  withLabel?: boolean;
}

const defaultLabel: React.ReactNode = <div>&nbsp;</div>;

function Labelled ({ className = '', children, help, isFull, isHidden, isOuter, isSmall, label = defaultLabel, labelExtra, withEllipsis, withLabel = true }: Props): React.ReactElement<Props> | null {
  if (isHidden) {
    return null;
  } else if (!withLabel) {
    return (
      <div className={className}>{children}</div>
    );
  }

  return (
    <div className={`ui--Labelled${isSmall ? ' isSmall' : ''}${isFull ? ' isFull' : ''}${isOuter ? ' isOuter' : ''} ${className}`}>
      <label>{withEllipsis
        ? <div className='withEllipsis'>{label}</div>
        : label
      }{help && <LabelHelp help={help} />}</label>
      {labelExtra && <div className='labelExtra'>{labelExtra}</div>}
      <div className='ui--Labelled-content'>
        {children}
      </div>
    </div>
  );
}

export default React.memo(styled(Labelled)`
  &.ui--Labelled {
    display: block;
    position: relative;

    .withEllipsis {
      display: inline;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.isSmall {
      display: block;

      > label {
        margin: 0;
        min-width: 0;
        padding-right: 0;
      }
    }

    &:not(.isSmall) {
      padding-left: 2rem;

      &:not(.isOuter) {
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
      }

      &.isFull {
        padding-left: 0;

        > label {
          left: 1.55rem;
        }
      }

      .labelExtra {
        color: rgba(78, 78, 78, .85);
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
              line-height: 1;
              padding: 0.47rem 0
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

        .ui--InputFile,
        .ui.input > input,
        .ui--output {
          padding-left: 1.45rem;
          padding-top: 1.75rem;
        }

        .ui--Messages {
          padding-bottom: 2rem;
          padding-left: 1.45rem;
          padding-top: 2rem;
        }
      }
    }
  }
`);
