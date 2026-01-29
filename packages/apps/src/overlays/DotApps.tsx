// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config/endpoints';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import BaseOverlay from './Base.js';

const isDev = window.location.host.startsWith('polkadot.js.org');
const dnsLinks = createWsEndpoints(() => '')
  .map((e) => e.dnslink)
  .reduce((all: string[], dnslink) => {
    if (dnslink && !all.includes(dnslink)) {
      all.push(dnslink);
    }

    return all;
  }, []);

interface Props {
  className?: string;
}

function DotApps ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { systemChain } = useApi();

  const appsUrl = useMemo(
    () => {
      const lowerChain = systemChain?.toLowerCase();

      return (lowerChain && dnsLinks.includes(lowerChain))
        ? `https://${lowerChain}.dotapps.io`
        : 'https://dotapps.io';
    },
    [systemChain]
  );

  if (isDev) {
    return (
      <BaseOverlay
        className={className}
        icon='link'
        isBottom
        isDev
        isFull
        type='info'
      >
        <div>
          {t('You are connected to the development instance of the UI. For a fully decentralized experience, you are encouraged to use the IPFS deployed version as the canonical URL: ')}
          <a
            href={appsUrl}
            rel='noreferrer'
            target='_blank'
          >
            {appsUrl.replace('https://', '')}
          </a>
        </div>
      </BaseOverlay>
    );
  }

  return null;
}

export default React.memo(DotApps);
