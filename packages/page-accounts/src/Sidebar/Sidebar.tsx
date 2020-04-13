// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  address: string;
  className?: string;
  closeSidebar: () => void;
}

function Sidebar ({ address, className, closeSidebar }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      onClick={closeSidebar}
    >
      {address}
    </div>
  );
}

export default React.memo(styled(Sidebar)`
  background: red;
  bottom: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 15rem;
`);
