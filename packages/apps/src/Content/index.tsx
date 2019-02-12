// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';

import './Content.css';

import React from 'react';
import { withRouter } from 'react-router';
import { withCalls, withMulti } from '@polkadot/ui-api/index';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';

import Status from '../Status';
import routing from '../routing';
import translate from '../translate';
import NotFound from './NotFound';

type Props = I18nProps & ApiProps & {
  location: Location
};

const unknown = {
  display: {
    needsApi: undefined
  },
  Component: NotFound,
  name: ''
};

class Content extends React.Component<Props> {
  render () {
    const { isApiConnected, isApiReady, location, t } = this.props;
    const app = location.pathname.slice(1) || '';
    const { Component, display: { needsApi }, name } = routing.routes.find((route) =>
      !!(route && app.indexOf(route.name) === 0)
    ) || unknown;

    if (needsApi && (!isApiReady || !isApiConnected)) {
      return (
        <div className='apps--Content-body'>
          <main>{t('Waiting for API to be connected and ready.')}</main>
        </div>
      );
    }

    return (
      <div className='apps--Content'>
        <QueueConsumer>
          {({ queueAction, stqueue, txqueue }: QueueProps) => (
            <>
              <Component
                basePath={`/${name}`}
                location={location}
                onStatusChange={queueAction}
              />
              <Status
                queueAction={queueAction}
                stqueue={stqueue}
                txqueue={txqueue}
              />
            </>
          )}
        </QueueConsumer>
      </div>
    );
  }
}

// React-router needs to be first, otherwise we have blocked updates
export default withMulti(
  Content,
  withRouter,
  translate,
  // These API queries are used in a number of places, warm them up
  // to avoid constant un-/re-subscribe on these
  withCalls<Props>(
    'query.session.validators',
    'derive.accounts.indexes',
    'derive.balances.fees'
  )
);
