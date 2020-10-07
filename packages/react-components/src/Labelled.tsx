// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import LabelHelp from './LabelHelp';
import { classes } from '@canvas-ui/react-util';

interface Props extends BareProps {
  help?: React.ReactNode;
  isHidden?: boolean;
  isFull?: boolean;
  isIndented?: boolean;
  isLabelMonospace?: boolean;
  isMonospace?: boolean;
  isOuter?: boolean;
  isSmall?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  children: React.ReactNode;
  withEllipsis?: boolean;
  withLabel?: boolean;
}

const defaultLabel: React.ReactNode = (
  <div>&nbsp;</div>
);

const Wrapper = styled.div`
  display: block;
  position: relative;

  label > div {
    display: inline-block;

    &.withEllipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;  
    }

    &.isMonospace {
      font-family: monospace;
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

  &.label-indented {
    margin-left: 2rem;
  }

  &.label-monospace {
    > .ui--Labelled-content {
      font-family: monospace;
    }
  }

  &:not(.label-small) {
    > label,
    .labelExtra {
      color: var(--grey80);
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      text-align: left;
      z-index: 1;
    }

    &.label-full {
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
      color: var(--grey70);
      display: flex;
      flex-wrap: wrap;
      font-size: 0.875rem;
      min-width: 0;

      .ui.selection.dropdown {
        &.floating {
          .text {
            padding: 0.45rem 0
          }
        }

        &.search:not(.multiple) > input.search {
          height: 100%;
          // padding-left: 1.45rem;
          // padding-top: 1.75rem;
        }

        // > .delete.icon,
        // > .dropdown.icon,
        // > .search.icon {
        //   top: 1.75rem;
        // }
      }

      .ui.input > input,
      .ui--output {
        // padding-left: 1.45rem;
        // padding-top: 1.75rem;
      }
    }
  }
`;

function Labelled ({ className = '', children, help, isFull, isHidden, isIndented, isLabelMonospace, isMonospace, isOuter, isSmall, label = defaultLabel, labelExtra, withEllipsis, withLabel = true }: Props): React.ReactElement<Props> | null {
  if (isHidden) {
    return null;
  }

  return (
    <Wrapper className={classes('ui--Labelled', isIndented && 'label-indented', isSmall && 'label-small', isFull && 'label-full', isMonospace && 'label-monospace', isOuter && 'label-outer', className)}>
      {withLabel && (
        <label>
          <div className={classes(withEllipsis && 'withEllipsis', isLabelMonospace && 'isMonospace')}>
            {label}
          </div>
          {help && <LabelHelp help={help} />}
        </label>
      )}
      {labelExtra && <div className='labelExtra'>{labelExtra}</div>}
      <div className='ui--Labelled-content'>
        {children}
      </div>
    </Wrapper>
  );
}

export default React.memo(Labelled);
