// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { BareProps as Props } from './types';

function Divider ({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className} />
  );
}

export default React.memo(styled(Divider)`
  margin: 2rem 0;
  height: 2px;
  width: 100%;
  border: 1px solid #aaa;
`);
