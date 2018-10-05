// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import AddressMini from '@polkadot/ui-app/AddressMini';
import ExtrinsicDisplay from '@polkadot/ui-app/Extrinsic';
import { Extrinsic, SignedBlock } from '@polkadot/types';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import isHex from '@polkadot/util/is/hex';
import u8aToHex from '@polkadot/util/u8a/toHex';

import BlockHeader from '../BlockHeader';
import translate from '../translate';

type Props = ApiProps & I18nProps & {
  getBlock: SignedBlock,
  value: string
};

class BlockByHash extends React.PureComponent<Props> {
  render () {
    const { getBlock } = this.props;

    if (!getBlock) {
      return null;
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

  private renderExtrinsic = (extrinsic: Extrinsic, index?: number) => {
    const { t, value } = this.props;

    return (
      <div
        className='explorer--BlockByHash-extrinsic'
        key={`${value}:extrinsic:${index}`}
      >
        <article>
          <div className='explorer--BlockByHash-extrinsic-header'>
            <div className='explorer--BlockByHash-extrinsic-header-name'>
              extrinsic.extrinsic.section.extrinsic.extrinsic.name
            </div>
            <div className='explorer--BlockByHash-extrinsic-header-description'>
              extrinsic.extrinsic.description
            </div>
            <div className='explorer--BlockByHash-header-right'>
              <div>{isHex((extrinsic as any).address)
                ? (extrinsic as any).address
                : <AddressMini value={(extrinsic as any).address} />
              }</div>
              <div className='explorer--BlockByHash-accountIndex'>{t('block.accountIndex', {
                defaultValue: 'index'
              })} {numberFormat((extrinsic as any).accountIndex)}</div>
            </div>
          </div>
          <ExtrinsicDisplay value={extrinsic} />
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
}

export default withMulti(
  BlockByHash,
  translate,
  withObservable('getBlock', { paramProp: 'value' })
);
