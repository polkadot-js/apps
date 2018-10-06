// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { Proposal } from '@polkadot/types';
// import Extrinsic from '@polkadot/ui-app/Extrinsic';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

// TODO This would be nice as a shared component, move to ui-app as soon as
// we have actual "more-than-one-use" apps
import translate from './translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  proposal: Proposal,
  proposalExtra?: React.ReactNode,
  idNumber: BN
};

class Item extends React.PureComponent<Props> {
  render () {
    const { children, idNumber } = this.props;

    return (
      <article className='democracy--Item'>
        <div className='democracy--Item-header'>
          <div className='democracy--Item-header-info'>
            <div className='democracy--Item-header-name'>
              proposal.extrinsic.section.proposal.extrinsic.name
            </div>
            <div className='democracy--Item-header-description'>
              proposal.extrinsic.description
            </div>
          </div>
          <div className='democracy--Item-header-id'>
            #{numberFormat(idNumber)}
          </div>
        </div>
        <div className='democracy--Item-body'>
          {/* FIXME <Extrinsic
            className='democracy--Item-extrinsic'
            value={proposal}
          >
            {proposalExtra}
          </Extrinsic> */}
          <div className='democracy--Item-children'>
            {children}
          </div>
        </div>
      </article>
    );
  }
}

export default translate(Item);
