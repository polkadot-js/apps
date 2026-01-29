// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  className?: string;
  label?: React.ReactNode;
  withEllipsis?: boolean;
}

function Label ({ className = '', label, withEllipsis }: Props): React.ReactElement<Props> {
  return (
    <label className={className}>
      {
        withEllipsis
          ? <div className='withEllipsis'>{label}</div>
          : label
      }
    </label>
  );
}

export default React.memo(Label);
