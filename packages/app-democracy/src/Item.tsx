// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { Method, Proposal } from '@polkadot/types';
import { Call } from '@polkadot/ui-app/index';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

import translate from './translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  proposal: Proposal,
  proposalExtra?: React.ReactNode,
  idNumber: BN
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
            <div className='democracy--Item-header-description'>
            {
                meta && meta.documentation && meta.documentation.length
                  ? meta.documentation.get(0).toString
                  : ''
              }
            </div>
          </div>
          <div className='democracy--Item-header-id'>
            #{numberFormat(idNumber)}
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
