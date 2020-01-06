// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import { classes } from './util';

const rootElement = document.getElementById('tooltips');

interface Props extends BareProps {
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

function Tooltip ({ className, effect = 'solid', offset, place = 'bottom', text, trigger }: Props): React.ReactElement<Props> | null {
  const [tooltipContainer] = useState(document.createElement('div'));

  useEffect((): () => void => {
    if (rootElement !== null) {
      rootElement.appendChild(tooltipContainer);
    }

    return (): void => {
      if (rootElement !== null) {
        rootElement.removeChild(tooltipContainer);
      }
    };
  }, []);

  return ReactDOM.createPortal(
    <ReactTooltip
      id={trigger}
      effect={effect}
      offset={offset}
      place={place}
      className={classes('ui--Tooltip', className)}
    >
      {text}
    </ReactTooltip>,
    tooltipContainer
  );
}

export default styled(Tooltip)`
  table {
    border: 0;

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
`;
