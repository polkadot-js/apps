// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { TreasuryProposal } from '@polkadot/types';
import { Icon } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  isApproved?: boolean,
  proposal: TreasuryProposal,
  proposalExtra?: React.ReactNode,
  proposalIndex: string
};

class Item extends React.PureComponent<Props> {
  render () {
    const { children, isApproved, proposalExtra, proposalIndex, t } = this.props;

    // FIXME This is _very_ similar to what we have in explorer/BlockByHash
    return (
      <article className='treasury--Item'>
        <div className='treasury--Item-header'>
          <div className='treasury--Item-header-approved'>
            {isApproved && (
              <>
                <Icon name='check' />
                {'  '}
                {t('Approved')}
              </>
            )}
          </div>
          <div className='treasury--Item-header-id'>
            #{proposalIndex}
          </div>
        </div>
        <div className='treasury--Item-body'>
          {proposalExtra}
          <div className='treasury--Item-children'>
            {children}
          </div>
        </div>
      </article>
    );
  }
}

export default translate(Item);
