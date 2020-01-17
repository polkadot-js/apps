// Copyright 2017-2020 @polkadot/app-dashboard authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '@polkadot/apps-routing/types';

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  route: Route;
}

function Entry ({ className, route: { i18n, icon, name } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Link to={`/${name}`}>
        <Icon
          name={icon}
          size='massive'
        />
        <div className='name'>
          {t(`entry.${name}`, i18n)}
        </div>
      </Link>
    </div>
  );
}

export default styled(Entry)`
  .name {
    margin-top: 0.75rem;
  }
`;
