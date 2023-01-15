// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useState } from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import Tooltip from './Tooltip';

interface Props {
  help: React.ReactNode;
  icon?: IconName;
  className?: string;
}

let id = 0;

function LabelHelp ({ className = '', help, icon = 'question-circle' }: Props): React.ReactElement<Props> {
  const [trigger] = useState(() => `label-help-${++id}`);

  return (
    <StyledDiv
      className={`ui--LabelHelp ${className}`}
      tabIndex={-1}
    >
      <Icon
        icon={icon}
        tooltip={trigger}
      />
      <Tooltip
        text={help}
        trigger={trigger}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  cursor: help;
  display: inline-block;
  line-height: 1rem;
  margin: 0 0 0 0.25rem;
`;

export default React.memo(LabelHelp);
