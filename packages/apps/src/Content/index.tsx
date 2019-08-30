// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { QueueProps } from '@polkadot/react-components/Status/types';

import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import routing from '@polkadot/apps-routing';
import { withCalls, withMulti } from '@polkadot/react-api';
import { QueueConsumer } from '@polkadot/react-components/Status/Context';

import Status from './Status';
import translate from '../translate';
import NotFound from './NotFound';

interface Props extends I18nProps, ApiProps, RouteComponentProps {}

const Wrapper = styled.div`
  background: #fafafa;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  padding: 0 2rem;

  @media(max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const Connecting = styled.div`
  padding: 1rem 0;
`;

const unknown = {
  display: {
    needsApi: undefined
  },
  Component: NotFound,
  name: ''
};

class Content extends React.Component<Props> {
  public render (): React.ReactNode {
    const { isApiConnected, isApiReady, location, t } = this.props;
    const app = location.pathname.slice(1) || '';
    const { Component, display: { needsApi }, name } = routing.routes.find((route): boolean =>
      !!(route && app.indexOf(route.name) === 0)
    ) || unknown;

    if (needsApi && (!isApiReady || !isApiConnected)) {
      return (
        <Wrapper>
          <Connecting>{t('Waiting for API to be connected and ready.')}</Connecting>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <QueueConsumer>
          {({ queueAction, stqueue, txqueue }: QueueProps): React.ReactNode => (
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
      </Wrapper>
    );
  }
}

// React-router needs to be first, otherwise we have blocked updates
export default withMulti(
  withRouter(Content),
  translate,
  // These API queries are used in a number of places, warm them up
  // to avoid constant un-/re-subscribe on these
  withCalls<Props>(
    'derive.accounts.indexes',
    'derive.balances.fees',
    'query.session.validators'
    // This are very ineffective queries that
    //   (a) adds load to the RPC node when activated globally
    //   (b) is used in additional information (next-up)
    // 'derive.staking.controllers'
    // 'query.staking.nominators'
  )
);
