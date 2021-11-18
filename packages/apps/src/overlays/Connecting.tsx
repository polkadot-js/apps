// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useApi } from '@polkadot/react-hooks';
import { settings } from '@polkadot/ui-settings';

import { useTranslation } from '../translate';
import BaseOverlay from './Base';

const wsUrl = settings.apiType.param;
const isWs = settings.apiType.type === 'json-rpc' && typeof wsUrl === 'string' && wsUrl.startsWith('ws://');
const isWsLocal = typeof wsUrl === 'string' && wsUrl.includes('127.0.0.1');
const isHttps = window.location.protocol.startsWith('https:');

interface Props {
  className?: string;
}

function Connecting ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { apiError, isApiConnected, isApiReady, isWaitingInjected } = useApi();

  if (apiError) {
    return (
      <BaseOverlay
        className={className}
        icon='globe'
        type='error'
      >
        <div>{apiError}</div>
      </BaseOverlay>
    );
  } else if (!isApiReady) {
    return (
      <BaseOverlay
        className={className}
        icon='globe'
        type='info'
      >
        <div>{t<string>('Waiting to make a connection to the remote endpoint and finishing API initialization.')}</div>
      </BaseOverlay>
    );
  } else if (isWaitingInjected) {
    return (
      <BaseOverlay
        className={className}
        icon='puzzle-piece'
        type='info'
      >
        <div>{t<string>('Waiting for authorization from the extension. Please open the installed extension and approve or reject access.')}</div>
      </BaseOverlay>
    );
  } else if (!isApiConnected) {
    return (
      <BaseOverlay
        className={className}
        icon='globe'
        type='error'
      >
        <div>{t<string>('You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.')}</div>
        {
          isWs && !isWsLocal && isHttps
            ? <div>{t<string>('You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure \'wss\' endpoint.', { replace: { wsUrl } })}</div>
            : undefined
        }
      </BaseOverlay>
    );
  }

  return null;
}

export default React.memo(Connecting);
