// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps as Props } from '@polkadot/react-components/types';

import React, { useContext } from 'react';
import styled from 'styled-components';
import { ApiContext } from '@polkadot/react-api';
import settings from '@polkadot/ui-settings';

import translate from '../translate';
import BaseOverlay from './Base';

const isFirefox = typeof (window as any).InstallTrigger !== 'undefined';
const wsUrl = settings.apiUrl;
const isWs = wsUrl.startsWith('ws://');
const isWsLocal = wsUrl.includes('127.0.0.1');
const isHttps = window.location.protocol.startsWith('https:');

function ExtensionOverlay ({ className, isWaitingInjected, t }: ApiProps & Props): React.ReactElement<Props> | null {
  if (!isWaitingInjected) {
    return null;
  }

  return (
    <BaseOverlay
      className={className}
      icon='puzzle'
    >
      <div>{t('Waiting for authorization from the extension. Please open the installed extension and approve or reject access.')}</div>
    </BaseOverlay>
  );
}

function ConnectOverlay ({ className, isApiConnected, t }: ApiProps & Props): React.ReactElement<Props> | null {
  if (isApiConnected) {
    return null;
  }

  return (
    <BaseOverlay
      className={className}
      icon='globe'
    >
      <div>{t('You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.')}</div>
      {
        isFirefox && isWs
          ? <div>{t('With the Firefox browser connecting to insecure WebSockets ({{wsUrl}}) will fail due to the browser not allowing localhost access from a secure site.', { replace: { wsUrl } })}</div>
          : undefined
      }
      {
        isWs && !isWsLocal && isHttps
          ? <div>{t('You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure \'wss\' endpoint.', { replace: { wsUrl } })}</div>
          : undefined
      }
    </BaseOverlay>
  );
}

function Connecting (props: Props): React.ReactElement<Props> | null {
  const api = useContext(ApiContext);

  return ExtensionOverlay({ ...props, ...api }) || ConnectOverlay({ ...props, ...api });
}

export default translate(
  styled(Connecting)`
    background: #ffe6e6;
    border-color: #c00;
    color: #4d0000;
  `
);
