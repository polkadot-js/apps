// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { Method, Proposal } from '@polkadot/types';
import { Call } from '@polkadot/ui-app/index';
import { formatNumber } from '@polkadot/ui-util';

import translate from './translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  proposal: Proposal,
  proposalExtra?: React.ReactNode,
  idNumber: BN | number
};

class Item extends React.PureComponent<Props> {
  render () {
    const { children, idNumber, proposal, proposalExtra } = this.props;
    const { meta, method, section } = Method.findFunction(proposal.callIndex);

    // FIXME This is _very_ similar to what we have in explorer/BlockByHash
    return (
      <article className='democracy--Item'>
        <div className='democracy--Item-header'>
          <div className='democracy--Item-header-info'>
            <h3>
              {section}.{method}
            </h3>
            <div className='democracy--Item-header-description'>{
              meta && meta.documentation
                ? meta.documentation.join(' ')
                : ''
            }</div>
          </div>
          <div className='democracy--Item-header-id'>
            #{formatNumber(idNumber)}
          </div>
        </div>
        <div className='democracy--Item-body'>
          <Call
            className='democracy--Item-extrinsic'
            value={proposal}
          >
            {proposalExtra}
          </Call>
          <div className='democracy--Item-children'>
            {children}
          </div>
        </div>
      </article>
    );
  }
}

export default translate(Item);
