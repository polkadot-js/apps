// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { PeerInfo } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import translate from './translate';

type Props = I18nProps & {
  peers?: Array<PeerInfo> | null
};

class Peers extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <section className='status--Peers'>
        <h1>{t('connected peers')}</h1>
        {this.renderPeers()}
      </section>
    );
  }

  private renderPeers () {
    const { peers, t } = this.props;

    if (!peers || !peers.length) {
      return (
        <div className='ui disabled'>
          {t('no peers connected')}
        </div>
      );
    }

    return (
      <article>
        <table>
          <thead>
            <tr>
              <th className='roles'>{t('role')}</th>
              <th className='peerid ui--media-medium'>{t('peer id')}</th>
              <th className='number'>{t('best #')}</th>
              <th className='hash'>{t('best hash')}</th>
            </tr>
          </thead>
          <tbody>
            {peers
              .sort((a, b) =>
                b.bestNumber.cmp(a.bestNumber)
              )
              .map(this.renderPeer)
            }
          </tbody>
        </table>
      </article>
    );
  }

  private renderPeer = (peer: PeerInfo) => {
    const peerId = peer.peerId.toString();

    return (
      <tr key={peerId}>
        <td className='roles'>{peer.roles.toString().toLowerCase()}</td>
        <td className='peerid ui--media-medium'>{peerId}</td>
        <td className='number'>{formatNumber(peer.bestNumber)}</td>
        <td className='hash'>{peer.bestHash.toHex()}</td>
      </tr>
    );
  }
}

export default translate(Peers);
