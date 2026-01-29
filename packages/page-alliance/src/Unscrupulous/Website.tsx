// Copyright 2017-2025 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  className?: string;
  value: string;
}

function Website ({ className, value }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='start all'>
        {value}
      </td>
    </tr>
  );
}

export default React.memo(Website);
