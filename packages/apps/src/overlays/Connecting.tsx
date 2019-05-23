// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api';
import settings from '@polkadot/ui-settings';

import { Connecting as Wrapper } from '../styles';

import translate from '../translate';

type Props = I18nProps & ApiProps;
// @ts-ignore
const isFirefox = typeof InstallTrigger !== 'undefined';

class Connecting extends React.PureComponent<Props> {
  render () {
    return this.renderExtension() || this.renderConnecting();
  }

  private renderExtension () {
    const { isWaitingInjected, t } = this.props;

    if (!isWaitingInjected) {
      return null;
    }

    return (
      <Wrapper>
        <div>{t('Waiting for authorization from the extension. Please open the installed extension and approve or reject access.')}</div>
      </Wrapper>
    );
  }

  private renderConnecting () {
    const { isApiConnected, t } = this.props;

    if (isApiConnected) {
      return null;
    }

    const wsUrl = settings.apiUrl;
    const isWs = wsUrl.indexOf('ws://') === 0;
    const isWsRemote = wsUrl.indexOf('127.0.0.1') === -1;
    const isHttps = window.location.protocol.indexOf('https:') === 0;

    return (
      <Wrapper>
        <div>{t('You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.')}</div>
        {
          isFirefox && isWs
            ? <div>{t('With the Firefox browser connecting to insecure WebSockets ({{wsUrl}}) will fail due to the browser not allowing localhost access from a secure site.', { replace: { wsUrl } })}</div>
            : undefined
        }
        {
          isWs && isWsRemote && isHttps
            ? <div>{t(`You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure 'wss' endpoint.`, { replace: { wsUrl } })}</div>
            : undefined
        }
      </Wrapper>
    );
  }
}

export default withMulti(
  Connecting,
  translate,
  withApi
);
