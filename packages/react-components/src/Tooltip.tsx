// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactTooltip from 'react-tooltip';

import { styled } from './styled';

function rootElement () {
  return typeof document === 'undefined'
    ? null // This hack is required for server side rendering
    : document.getElementById('tooltips');
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  isClickable?: boolean;
  place?: 'bottom' | 'top' | 'right' | 'left';
  text?: React.ReactNode;
  trigger: string;
}

function Tooltip ({ children, className = '', isClickable = false, place, text, trigger }: Props): React.ReactElement<Props> | null {
  const [tooltipContainer] = useState(
    typeof document === 'undefined'
      ? {} as HTMLElement // This hack is required for server side rendering
      : document.createElement('div')
  );

  useEffect((): () => void => {
    const root = rootElement();

    root && root.appendChild(tooltipContainer);

    return (): void => {
      root && root.removeChild(tooltipContainer);
    };
  }, [tooltipContainer]);

  return createPortal(
    <StyledReactTooltip
      className={`${className} ui--Tooltip`}
      clickable={isClickable}
      effect='solid'
      id={trigger}
      place={place}
    >
      <div className='tooltipSpacer'>
        {text}{children}
      </div>
    </StyledReactTooltip>,
    tooltipContainer
  );
}

const StyledReactTooltip = styled(ReactTooltip)`
  .tooltipSpacer {
    padding: 0.375rem;
  }

  > div {
    overflow: hidden;
  }

  &.ui--Tooltip {
    z-index: 1002;
  }

  table {
    border: 0;
    overflow: hidden;
    width: 100%;

    td {
      text-align: left;
    }

    td:first-child {
      opacity: 0.75;
      padding-right: 0.25rem;
      text-align: right;
      white-space: nowrap;
    }
  }

  div+table,
  table+div {
    margin-top: 0.75rem;
  }

  > div+div {
    margin-top: 0.5rem;
  }

  &.address div {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .faded {
    margin-top: 0;
    opacity: 0.75 !important;
    font-size: var(--font-size-tiny) !important;

    .faded {
      font-size: 1em !important;
    }
  }

  .faded+.faded {
    margin-top: 0;
  }

  .row+.row {
    margin-top: 0.5rem;
  }
`;

export default React.memo(Tooltip);
