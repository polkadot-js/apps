// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import AddressMini from '@polkadot/ui-app/AddressMini';
import Extrinsic from '@polkadot/ui-app/Extrinsic';
import { SignedBlock } from '@polkadot/types';
import prettyJson from '@polkadot/ui-app/util/prettyJson';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import isHex from '@polkadot/util/is/hex';

import BlockHeader from '../BlockHeader';
import translate from '../translate';

type Props = ApiProps & I18nProps & {
  getBlock: SignedBlock,
  value: string
};

// FIXME Duplicated layout here and in democracy, clean up with extrinsics
class BlockByHash extends React.PureComponent<Props> {
  render () {
    const { getBlock } = this.props;

    if (!getBlock) {
      return null;
    }

    const { block: { header } } = getBlock;

    // TODO Remove, debug info for reverse-engineering
    console.log(prettyJson(getBlock));

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
    const { getBlock, t, value } = this.props;
    const { block: { extrinsics } } = getBlock;

    return (
      <section key='extrinsics'>
        <h1>{t('block.extrinsics', {
          defaultValue: 'extrinsics'
        })}</h1>
        <div className='explorer--BlockByHash-flexable'>
          {extrinsics.map((extrinsic, index) => (
            <div
              className='explorer--BlockByHash-extrinsic'
              key={`${value}:extrinsic:${index}`}
            >
              <article>
                <div className='explorer--BlockByHash-extrinsic-header'>
                  <div className='explorer--BlockByHash-extrinsic-header-name'>
                    {extrinsic.extrinsic.section}.{extrinsic.extrinsic.name}
                  </div>
                  <div className='explorer--BlockByHash-extrinsic-header-description'>
                    {extrinsic.extrinsic.description}
                  </div>
                  <div className='explorer--BlockByHash-header-right'>
                    <div>{isHex(extrinsic.address)
                      ? extrinsic.address
                      : <AddressMini value={extrinsic.address} />
                    }</div>
                    <div className='explorer--BlockByHash-accountIndex'>{t('block.accountIndex', {
                      defaultValue: 'index'
                    })} {numberFormat(extrinsic.accountIndex)}</div>
                  </div>
                </div>
                <Extrinsic value={extrinsic} />
              </article>
            </div>
          ))}
        </div>
      </section>
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
              <AddressMini value={authorityId.toString()}>
                <span>
                  {signature.toHex()}
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
