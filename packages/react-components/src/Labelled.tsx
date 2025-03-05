// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from './styled.js';

interface Props {
  className?: string;
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

function Labelled ({ children, className = '', isFull, isHidden, isOuter, isSmall, label = defaultLabel, labelExtra, withEllipsis, withLabel = true }: Props): React.ReactElement<Props> | null {
  if (isHidden) {
    return null;
  } else if (!withLabel) {
    return (
      <div className={className}>{children}</div>
    );
  }

  return (
    <StyledDiv className={`${className} ui--Labelled ${isSmall ? 'isSmall' : ''} ${isFull ? 'isFull' : ''} ${isOuter ? 'isOuter' : ''}`}>
      <label>{withEllipsis
        ? <div className='withEllipsis'>{label}</div>
        : label
      }
      </label>
      {labelExtra && <div className='labelExtra'>{labelExtra}</div>}
      <div className='ui--Labelled-content'>
        {children}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  &.ui--Labelled {
    display: block;
    position: relative;

    label {
      padding-right: 1rem;
    }

    .ui--CopyButton {
      position: absolute;
      top: 0.9rem;
      right: 0.5rem;
    }

    .withEllipsis {
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
          top: 0.75rem;
          z-index: 1;
        }

        > label {
          left: 3.55rem;
          right: 0;
          text-align: left;
        }
      }

      &.isFull {
        padding-left: 0;

        > label {
          left: 1.55rem;
        }
      }

      &.isOuter {
        margin: 0.25rem 0;

        .labelExtra {
          top: -0.125rem;
          // right: 0;
        }
      }

      .labelExtra {
        color: var(--color-label);
        font-size: var(--font-size-label);
        font-weight: var(--font-weight-label);
        position: absolute;
        right: 1.25rem;
        text-align: right;
        text-transform: var(--text-transform-label);
        top: 0.75rem;
        z-index: 1;

        > .ui--Toggle > label {
          padding-right: 0 !important;
        }
      }

      > .ui--Labelled-content {
        box-sizing: border-box;
        flex: 1 1;
        min-width: 0;

        > .--tmp {
          // existing is a bit too much
          opacity: 0.15;
        }

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
`;

export default React.memo(Labelled);
