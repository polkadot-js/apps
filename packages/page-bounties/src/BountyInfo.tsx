// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Icon } from '@polkadot/react-components';

interface Props {
  description: string;
  title: string;
  type?: 'normal' | 'warning';
}

function BountyInfo ({ description, title, type = 'normal' }: Props): React.ReactElement<Props> {
  return (
    <div className='ui--BountyInfo'>
      <div className='title'>
        { type === 'warning' && <Icon icon={'exclamation-triangle'}/> } {title}
      </div>
      <div className='description'>
        {description}
      </div>
    </div>
  );
}

export default React.memo(styled(BountyInfo)`

`);
