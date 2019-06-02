// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressMini, Call, Column, LinkPolkascan } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';
import { Extrinsic, Method } from '@polkadot/types';

import translate from '../translate';

type Props = I18nProps & {
  label?: React.ReactNode,
  value?: Array<Extrinsic> | null
};

class Extrinsics extends React.PureComponent<Props> {
  render () {
    const { label, t } = this.props;

    return (
      <Column header={label || t('extrinsics')}>
        {this.renderContent()}
      </Column>
    );
  }

  private renderContent () {
    const { t, value } = this.props;

    if (!value || !value.length) {
      return (
        <article>
          {t('no pending extrinsics are in the queue')}
        </article>
      );
    }

    return value.map(this.renderExtrinsic);
  }

  // FIXME This is _very_ similar to what we have in democracy/Item
  private renderExtrinsic = (extrinsic: Extrinsic, index: number) => {
    const { meta, method, section } = Method.findFunction(extrinsic.callIndex);

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
              : 'Details'
          }</summary>
          <Call
            className='details'
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
      <div className='explorer--BlockByHash-header-right'>
        <div>
          <AddressMini value={extrinsic.signature.signer} />
        </div>
        <div className='explorer--BlockByHash-accountIndex'>
          {t('index')} {formatNumber(extrinsic.signature.nonce)}
        </div>
      </div>
    );
  }
}

export default translate(Extrinsics);
