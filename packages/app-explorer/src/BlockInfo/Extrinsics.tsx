// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import { AddressMini, Call, Column, LinkPolkascan } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';
import { BlockNumber, Extrinsic, Method } from '@polkadot/types';

import translate from '../translate';

type Props = I18nProps & {
  blockNumber?: BlockNumber,
  label?: React.ReactNode,
  value?: Array<Extrinsic> | null
};

class Extrinsics extends React.PureComponent<Props> {
  render () {
    const { className, label, t } = this.props;

    return (
      <Column
        className={className}
        emptyText={t('No pending extrinsics are in the queue')}
        headerText={label || t('extrinsics')}
      >
        {this.renderContent()}
      </Column>
    );
  }

  private renderContent () {
    const { value = [] } = this.props;

    return (value || []).map(this.renderExtrinsic);
  }

  // FIXME This is _very_ similar to what we have in democracy/Item
  private renderExtrinsic = (extrinsic: Extrinsic, index: number) => {
    const { blockNumber, t } = this.props;
    const { meta, method, section } = Method.findFunction(extrinsic.callIndex);

    let eraEnd;
    if (extrinsic.signature.era.isMortalEra) {
      eraEnd = extrinsic.signature.era.asMortalEra.death((blockNumber || new BlockNumber(0)).toNumber());
    }

    return (
      <article key={`extrinsic:${index}`}>
        <div className='header'>
          <h3>
            {section}.{method}&nbsp;(#{formatNumber(index)})
          </h3>
          {this.renderSigner(extrinsic)}
        </div>
        <details>
          <summary>{
            meta && meta.documentation
              ? meta.documentation.join(' ')
              : t('Details')
          }</summary>
          <Call
            className='details'
            mortality={
              eraEnd
                ? t(
                  `mortal${blockNumber ? ' - ends at #{{blockNumber}}' : ''}`,
                  {
                    replace: {
                      blockNumber: (eraEnd && blockNumber) ? formatNumber(eraEnd) : ''
                    }
                  }
                )
                : t('immortal')
            }
            value={extrinsic}
            withHash
          />
        </details>
        {
          extrinsic.isSigned
            ? <LinkPolkascan data={extrinsic.hash.toHex()} type='extrinsic' />
            : null
        }
      </article>
    );
  }

  private renderSigner (extrinsic: Extrinsic) {
    const { t } = this.props;

    if (!extrinsic.signature.isSigned) {
      return null;
    }

    return (
      <div className='explorer--BlockByHash-header'>
        <div>
          <AddressMini value={extrinsic.signature.signer} />
        </div>
        <div className='explorer--BlockByHash-nonce'>
          {t('index')} {formatNumber(extrinsic.signature.nonce)}
        </div>
      </div>
    );
  }
}

export default translate(styled(Extrinsics)`
  .explorer--BlockByHash-header {
    position: absolute;
    top: 0.25rem;
    right: 0.75rem;
  }

  .explorer--BlockByHash-nonce {
    font-size: .75rem;
    margin-right: 2.25rem;
    margin-top: -1rem;
    opacity: 0.45;
    text-align: right;
  }
`);
