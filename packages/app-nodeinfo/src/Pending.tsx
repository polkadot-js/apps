// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressMini, Call } from '@polkadot/ui-app/index';
import { Extrinsic, Method } from '@polkadot/types';
import { numberFormat } from '@polkadot/ui-reactive/util/index';

import translate from './translate';

type Props = I18nProps & {
  extrinsics?: Array<Extrinsic> | null
};

// FIXME - this is basically a copy-and paste of what happens in app-explorer BlockByHash
// make rendering extrinsics a proper component
class Pending extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <section>
        <h1>{t('pending extrinsics')}</h1>
        {this.renderExtrinsics()}
      </section>
    );
  }

  private renderExtrinsics () {
    const { extrinsics, t } = this.props;

    if (!extrinsics || !extrinsics.length) {
      return (
        <div className='ui disabled'>
          {t('no pending extrinsics are in the queue')}
        </div>
      );
    }

    return (
      <div className='explorer--BlockByHash-flexable'>
        {extrinsics.map(this.renderExtrinsic)}
      </div>
    );
  }

  // FIXME This is _very_ similar to what we have in exporer
  private renderExtrinsic = (extrinsic: Extrinsic, index: number) => {
    const { meta, method, section } = Method.findFunction(extrinsic.callIndex);

    return (
      <div
        className='explorer--BlockByHash-block'
        key={`extrinsic:${index}`}
      >
        <article className='explorer--Container'>
          <div className='header'>
            <h3>
              #{numberFormat(index)}:&nbsp;{section}.{method}
            </h3>
            <div className='description'>{
              meta && meta.documentation && meta.documentation.length
                ? meta.documentation.map((doc) => doc.toString()).join(' ')
                : ''
            }</div>
            {this.renderSigner(extrinsic)}
          </div>
          <Call value={extrinsic} />
        </article>
      </div>
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
          {t('index')} {numberFormat(extrinsic.signature.nonce)}
        </div>
      </div>
    );
  }
}

export default translate(Pending);
