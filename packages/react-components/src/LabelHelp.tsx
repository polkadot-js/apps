// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import { classes } from './util';
import Tooltip from './Tooltip';

interface Props {
  help: React.ReactNode;
  className?: string;
}

let id = 0;

function LabelHelp ({ className = '', help }: Props): React.ReactElement<Props> {
  const [trigger] = useState(`label-help-${++id}`);

  return (
    <div className={classes('ui--LabelHelp', className)}>
      <Icon
        icon='question-circle'
        tooltip={trigger}
      />
      <Tooltip
        text={help}
        trigger={trigger}
      />
    </div>
  );
}

export default React.memo(styled(LabelHelp)`
  cursor: help;
  display: inline-block;
  line-height: 1rem;
  margin: 0 0 0 0.25rem;
`);
