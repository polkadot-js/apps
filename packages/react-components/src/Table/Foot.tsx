// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  footer?: React.ReactNode;
  isEmpty: boolean;
}

function Foot ({ className = '', footer, isEmpty }: Props): React.ReactElement<Props> | null {
  if (!footer || isEmpty) {
    return null;
  }

  return (
    <tfoot className={className}>
      {footer}
    </tfoot>
  );
}

export default React.memo(styled(Foot)`
  td {
    color: rgba(78, 78, 78, .66);
    font-family: sans-serif;
    font-weight: 100;
    padding: 0.75rem 1rem 0.25rem;
    text-align: right;
    vertical-align: baseline;
    white-space: nowrap;
  }

  tr {
    background: #f5f3f1;
  }
`);
