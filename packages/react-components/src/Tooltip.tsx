// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

const rootElement = typeof document === 'undefined'
  ? null // This hack is required for server side rendering
  : document.getElementById('tooltips');

interface Props {
  className?: string;
  dataFor?: string;
  effect?: 'solid' | 'float';
  offset?: {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  place?: 'bottom' | 'top' | 'right' | 'left';
  text: React.ReactNode;
  trigger: string;
}

function Tooltip ({ className = '', effect = 'solid', offset, place = 'top', text, trigger }: Props): React.ReactElement<Props> | null {
  const [tooltipContainer] = useState(
    typeof document === 'undefined'
      ? {} as HTMLElement // This hack is required for server side rendering
      : document.createElement('div')
  );

  useEffect((): () => void => {
    rootElement && rootElement.appendChild(tooltipContainer);

    return (): void => {
      rootElement && rootElement.removeChild(tooltipContainer);
    };
  }, [tooltipContainer]);

  return ReactDOM.createPortal(
    <ReactTooltip
      className={`ui--Tooltip ${className}`}
      effect={effect}
      id={trigger}
      offset={offset}
      place={place}
    >
      {className?.includes('address') ? <div>{text}</div> : text}
    </ReactTooltip>,
    tooltipContainer
  );
}

export default React.memo(styled(Tooltip)`
  > div {
    overflow: hidden;
  }

  &.address div {
    overflow: hidden;
    text-overflow: ellipsis;
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

  .faded {
    margin-top: -0.25rem;
    opacity: 0.75 !important;
    font-size: 0.85em !important;
  }

  .faded+.faded {
    margin-top: -0.5rem;
  }

  .row+.row {
    margin-top: 0.5rem;
  }
`);
