// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '@polkadot/apps-routing/types';

import React, { Suspense, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import routing from '@polkadot/apps-routing';
import { ErrorBoundary, Spinner, StatusContext } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import Status from './Status';
import { useTranslation } from '../translate';
import NotFound from './NotFound';

interface Props {
  className?: string;
}

const NOT_FOUND: Route = {
  Component: NotFound,
  display: {
    needsApi: undefined
  },
  i18n: {
    defaultValue: 'Unknown'
  },
  icon: 'cancel',
  isIgnored: false,
  name: ''
};

function Content ({ className }: Props): React.ReactElement<Props> {
  const location = useLocation();
  const { t } = useTranslation();
  const { isApiConnected, isApiReady } = useApi();
  const { queueAction, stqueue, txqueue } = useContext(StatusContext);
  const { Component, display: { needsApi }, name } = useMemo(
    (): Route => {
      const app = location.pathname.slice(1) || '';
      const found = routing.routes.find((route) => !!(route && app.startsWith(route.name)));

      return found || NOT_FOUND;
    },
    [location]
  );

  return (
    <div className={className}>
      {needsApi && (!isApiReady || !isApiConnected)
        ? (
          <div className='connecting'>
            <Spinner label={t('Initializing connection')} />
          </div>
        )
        : (
          <>
            <Suspense fallback='...'>
              <ErrorBoundary>
                <Component
                  basePath={`/${name}`}
                  location={location}
                  onStatusChange={queueAction}
                />
              </ErrorBoundary>
            </Suspense>
            <Status
              queueAction={queueAction}
              stqueue={stqueue}
              txqueue={txqueue}
            />
          </>
        )
      }
    </div>
  );
}

export default React.memo(styled(Content)`
  background: #f2f2f2;
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

  .connecting {
    padding: 3.5rem 0;
  }
`);
