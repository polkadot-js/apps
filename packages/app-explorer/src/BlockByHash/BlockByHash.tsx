// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
import { AddressMini, Call } from '@polkadot/ui-app/index';
import { Extrinsic, Method, SignedBlock } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-react-rx/with/index';
import { numberFormat } from '@polkadot/ui-react-rx/util/index';

import BlockHeader from '../BlockHeader';
import translate from '../translate';
import Logs from './Logs';

type Props = ApiProps & I18nProps & {
  rpc_chain_getBlock?: SignedBlock,
  value: string
};

class BlockByHash extends React.PureComponent<Props> {
  render () {
    const { rpc_chain_getBlock } = this.props;

    if (!rpc_chain_getBlock || !rpc_chain_getBlock.block) {
      return null;
    }

    const { block: { header } } = rpc_chain_getBlock;

    return [
      <header key='header'>
        <BlockHeader
          value={header}
          withExtrinsics
        />
      </header>,
      this.renderExtrinsics(),
      // this.renderJustification(),
      <Logs
        key='logs'
        value={header.digest.logs}
      />
    ];
  }

  private renderExtrinsics () {
    const { rpc_chain_getBlock, t } = this.props;

    if (!rpc_chain_getBlock) {
      return null;
    }

    const { block: { extrinsics } } = rpc_chain_getBlock;

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

  // FIXME This is _very_ similar to what we have in democracy/Item
  private renderExtrinsic = (extrinsic: Extrinsic, index?: number) => {
    const { value } = this.props;
    const { meta, method, section } = Method.findFunction(extrinsic.callIndex);

    return (
      <div
        className='explorer--BlockByHash-block'
        key={`${value}:extrinsic:${index}`}
      >
        <article className='explorer--Container'>
          <div className='header'>
            <h3>
              {section}.{method}
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

  // Bft/Rhohenderon only
  // private renderJustification () {
  //   const { getBlock, t, value } = this.props;
  //   const { justification: { signatures } } = getBlock;

  //   if (!signatures || !signatures.length) {
  //     return null;
  //   }

  //   return (
  //     <section key='justification'>
  //       <h1>{t('block.justifications', {
  //         defaultValue: 'justifications'
  //       })}</h1>
  //       <div className='explorer--BlockByHash-flexable'>
  //         {signatures.map(({ authorityId, signature }) => (
  //           <div
  //             className='explorer--BlockByHash-justification-signature'
  //             key={`${value}:justification:${authorityId}`}
  //           >
  //             <AddressMini value={authorityId}>
  //               <span>
  //                 {u8aToHex(signature.toU8a(), 64)}
  //               </span>
  //             </AddressMini>
  //           </div>
  //         ))}
  //       </div>
  //     </section>
  //   );
  // }

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
  BlockByHash,
  translate,
  withCall('rpc.chain.getBlock', { paramProp: 'value' })
);
