// Copyright 2017-2020 @polkadot/app-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from '@polkadot/apps-routing/types';

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from '@polkadot/react-components';

interface Props {
  className?: string;
  route: Route;
}

function Entry ({ className = '', route: { icon, name, text } }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Link to={`/${name}`}>
        <Icon
          icon={icon}
          size='massive'
        />
        <div className='name'>
          {text}
        </div>
      </Link>
    </div>
  );
}

export default React.memo(styled(Entry)`
  .name {
    margin-top: 0.75rem;
  }
`);
