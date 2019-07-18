// Copyright 2017-2019 @polkadot/app-dashboard authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '@polkadot/apps-routing/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from '@polkadot/ui-app';

import translate from './translate';

interface Props extends I18nProps {
  route: Route;
}

class Entry extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, route: { i18n, icon, name }, t } = this.props;

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
}

export default translate(styled(Entry)`
  .name {
    margin-top: 0.75rem;
  }
`);
