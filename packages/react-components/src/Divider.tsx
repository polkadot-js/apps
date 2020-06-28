// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from './types';

import React from 'react';
import styled from 'styled-components';

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
