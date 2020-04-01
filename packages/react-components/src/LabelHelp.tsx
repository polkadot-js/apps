// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useState } from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import { classes } from './util';
import Tooltip from './Tooltip';

interface Props extends BareProps {
  help: React.ReactNode;
}

function LabelHelp ({ className, help, style }: Props): React.ReactElement<Props> {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const _toggleTooltip = (): void => setIsTooltipOpen(!isTooltipOpen);

  return (
    <div
      className={classes('ui--LabelHelp', className)}
      style={style}
    >
      <Icon
        data-for='controlled-trigger'
        data-tip
        name='help circle'
        onMouseOut={_toggleTooltip}
        onMouseOver={_toggleTooltip}
      />
      {isTooltipOpen && (
        <Tooltip
          text={help}
          trigger='controlled-trigger'
        />
      )}
    </div>
  );
}

export default React.memo(styled(LabelHelp)`
  cursor: help;
  display: inline-block;
  line-height: 1rem;
  margin: 0 0 0 0.25rem;
`);
