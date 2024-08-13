// Copyright 2017-2024 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route } from '@polkadot/apps-routing/types';
import type { MetadataDef } from '@polkadot/extension-inject/types';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import createRoutes from '@polkadot/apps-routing';
import { ErrorBoundary, Spinner, styled } from '@polkadot/react-components';
import { useApi, useQueue } from '@polkadot/react-hooks';
import { TabsCtx } from '@polkadot/react-hooks/ctx/Tabs';
import { objectSpread } from '@polkadot/util';

import useChainInfo from '../../../page-settings/src/useChainInfo.js';
import useExtensions from '../../../page-settings/src/useExtensions.js';
import useRawMetadata from '../../../page-settings/src/useRawMetadata.js';
import { findMissingApis } from '../endpoint.js';
import { useTranslation } from '../translate.js';
import NotFound from './NotFound.js';
import Status from './Status.js';

interface Props {
  className?: string;
}

const NOT_FOUND: Route = {
  Component: NotFound,
  display: {},
  group: 'settings',
  icon: 'times',
  isIgnored: false,
  name: 'unknown',
  text: 'Unknown'
};

function Content ({ className }: Props): React.ReactElement<Props> {
  const location = useLocation();
  const { t } = useTranslation();
  const { api, isApiConnected, isApiReady, isDevelopment } = useApi();
  const { queueAction } = useQueue();
  const rawMetadata = useRawMetadata();
  const chainInfo = useChainInfo();
  const isMetadataReady = rawMetadata !== null;
  const [updating, setUpdating] = useState(false);

  const { extensions } = useExtensions();

  const { Component, display: { needsApi, needsApiCheck, needsApiInstances }, icon, name, text } = useMemo(
    (): Route => {
      const app = location.pathname.slice(1) || '';

      return createRoutes(t).find((r) =>
        r &&
        app.startsWith(r.name) &&
        (isDevelopment || !r.display.isDevelopment)
      ) || NOT_FOUND;
    },
    [isDevelopment, location, t]
  );

  const missingApis = useMemo(
    () => needsApi
      ? isApiReady && isApiConnected
        ? findMissingApis(api, needsApi, needsApiInstances, needsApiCheck)
        : null
      : [],
    [api, isApiConnected, isApiReady, needsApi, needsApiCheck, needsApiInstances]
  );

  useEffect((): void => {
    if (chainInfo && isMetadataReady && !isDevelopment && !updating) {
      const rawDef: MetadataDef = objectSpread<MetadataDef>({}, { ...chainInfo, rawMetadata });

      extensions.forEach((extension) => {
        extension.update(rawDef)
          .catch(console.error);
      });
      setUpdating(true);
    }
  },
  [chainInfo, isDevelopment, isMetadataReady, extensions, rawMetadata, updating]
  );

  return (
    <StyledDiv className={className}>
      {!missingApis
        ? (
          <div className='connecting'>
            <Spinner label={t('Initializing connection')} />
          </div>
        )
        : (
          <>
            <Suspense fallback='...'>
              <ErrorBoundary trigger={name}>
                <TabsCtx.Provider value={{ icon, text }}>
                  {missingApis.length
                    ? (
                      <NotFound
                        basePath={`/${name}`}
                        location={location}
                        missingApis={missingApis}
                        onStatusChange={queueAction}
                      />
                    )
                    : (
                      <Component
                        basePath={`/${name}`}
                        location={location}
                        onStatusChange={queueAction}
                      />
                    )
                  }
                </TabsCtx.Provider>
              </ErrorBoundary>
            </Suspense>
            <Status />
          </>
        )
      }
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  flex-grow: 1;
  overflow: hidden auto;
  padding: 0 0 1rem 0;
  position: relative;
  width: 100%;

  .connecting {
    padding: 3.5rem 0;
  }

  & main > *:not(header):not(.hasOwnMaxWidth) {
    max-width: var(--width-full);
    margin-right: auto;
    margin-left: auto;
    width: 100%;
    padding: 0 1.5rem;

    @media only screen and (max-width: 1100px) {
      padding: 0 1rem;
    }

    @media only screen and (max-width: 800px) {
      padding: 0 0.75rem;
    }
  }
`;

export default React.memo(Content);
