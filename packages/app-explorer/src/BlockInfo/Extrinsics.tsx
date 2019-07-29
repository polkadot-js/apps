// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import { GenericCall } from '@polkadot/types';
import { AddressMini, Call, Column, LinkPolkascan } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  blockNumber?: BlockNumber;
  label?: React.ReactNode;
  value?: Extrinsic[] | null;
}

class Extrinsics extends React.PureComponent<Props> {
  public render (): React.ReactNode {
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

  private renderContent (): React.ReactNode {
    const { value = [] } = this.props;

    return (value || []).map(this.renderExtrinsic);
  }

  // FIXME This is _very_ similar to what we have in democracy/Item
  private renderExtrinsic = (extrinsic: Extrinsic, index: number): React.ReactNode => {
    const { blockNumber, t } = this.props;
    const { meta, method, section } = GenericCall.findFunction(extrinsic.callIndex);
    const isMortal = extrinsic.era.isMortalEra;
    let eraEnd;
    let eraStart;

    if (blockNumber && isMortal) {
      const mortalEra = extrinsic.era.asMortalEra;

      eraEnd = mortalEra.death(blockNumber.toNumber());
      eraStart = mortalEra.birth(blockNumber.toNumber());
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
              isMortal
                ? blockNumber
                  ? t('mortal, valid from #{{startAt}} to #{{endsAt}}', {
                    replace: {
                      endsAt: formatNumber(eraEnd),
                      startAt: formatNumber(eraStart)
                    }
                  })
                  : t('mortal')
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

  private renderSigner (extrinsic: Extrinsic): React.ReactNode {
    const { t } = this.props;

    if (!extrinsic.isSigned) {
      return null;
    }

    return (
      <div className='explorer--BlockByHash-header'>
        <div>
          <AddressMini value={extrinsic.signer} />
        </div>
        <div className='explorer--BlockByHash-nonce'>
          {t('index')} {formatNumber(extrinsic.nonce)}
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
