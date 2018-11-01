// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
import { AddressMini, Call } from '@polkadot/ui-app/index';
import { Extrinsic, Method, SignedBlock } from '@polkadot/types';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';
import { numberFormat } from '@polkadot/ui-react-rx/util/index';
import { u8aToHex } from '@polkadot/util';

import BlockHeader from '../BlockHeader';
import translate from '../translate';

type Props = ApiProps & I18nProps & {
  getBlock: SignedBlock,
  value: string
};

class BlockByHash extends React.PureComponent<Props> {
  render () {
    const { getBlock, t, value } = this.props;

    if (!getBlock || !getBlock.block) {
      return (
        <div>{t('getBlock.notfound', {
          defaultValue: 'Unable to retrieve block for hash {{hash}}',
          replace: {
            hash: value
          }
        })}</div>
      );
    }

    const { block: { header } } = getBlock;

    return [
      <header key='header'>
        <BlockHeader
          value={header}
          withExtrinsics
        />
      </header>,
      this.renderExtrinsics(),
      this.renderJustification()
    ];
  }

  private renderExtrinsics () {
    const { getBlock, t } = this.props;
    const { block: { extrinsics } } = getBlock;

    return (
      <section key='extrinsics'>
        <h1>{t('block.extrinsics', {
          defaultValue: 'extrinsics'
        })}</h1>
        <div className='explorer--BlockByHash-flexable'>
          {extrinsics.map(this.renderExtrinsic)}
        </div>
      </section>
    );
  }

  // FIXME This is _very_ similar to what we have in democary/Item
  private renderExtrinsic = (extrinsic: Extrinsic, index?: number) => {
    const { value } = this.props;
    const { meta, method, section } = Method.findFunction(extrinsic.callIndex);

    return (
      <div
        className='explorer--BlockByHash-extrinsic'
        key={`${value}:extrinsic:${index}`}
      >
        <article>
          <div className='explorer--BlockByHash-extrinsic-header'>
            <div className='explorer--BlockByHash-extrinsic-header-name'>
              {section}.{method}
            </div>
            <div className='explorer--BlockByHash-extrinsic-header-description'>
              {
                meta && meta.documentation && meta.documentation.length
                  ? meta.documentation.get(0).toString
                  : ''
              }
            </div>
            {this.renderSigner(extrinsic)}
          </div>
          <Call value={extrinsic} />
        </article>
      </div>
    );
  }

  private renderJustification () {
    const { getBlock, t, value } = this.props;
    const { justification } = getBlock;

    return (
      <section key='justification'>
        <h1>{t('block.justifications', {
          defaultValue: 'justifications'
        })}</h1>
        <div className='explorer--BlockByHash-flexable'>
          {justification.signatures.map(({ authorityId, signature }) => (
            <div
              className='explorer--BlockByHash-justification-signature'
              key={`${value}:justification:${authorityId}`}
            >
              <AddressMini value={authorityId}>
                <span>
                  {u8aToHex(signature.toU8a(), 64)}
                </span>
              </AddressMini>
            </div>
          ))}
        </div>
      </section>
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
        <div className='explorer--BlockByHash-accountIndex'>{t('block.nonce', {
          defaultValue: 'index'
        })} {numberFormat(extrinsic.signature.nonce)}</div>
      </div>
    );
  }
}

export default withMulti(
  translate(BlockByHash),
  withObservable('getBlock', { paramProp: 'value' })
);
