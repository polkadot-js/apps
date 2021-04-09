// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { ThemeProps } from '@polkadot/react-components/types';

import { bountyLabelColor } from './theme';

interface Props {
  className?: string;
  dataTestId?: string;
  description: string;
}

function Description ({ className = '', dataTestId = '', description }: Props): JSX.Element {
  return (
    <div
      className={className}
      data-testid={dataTestId}>
      {description}
    </div>
  );
}

export default React.memo(styled(Description)(({ theme }: ThemeProps) => `
  margin-top: 0.28rem;
  font-size: 0.7rem;
  line-height: 0.85rem;
  color: ${bountyLabelColor[theme.theme]};
`));
