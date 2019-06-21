// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import { TreasuryProposal } from '@polkadot/types';
import { Card } from '@polkadot/ui-app';
import { styles as rowStyles } from '@polkadot/ui-app/Row';

import translate from '../translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  isApproved?: boolean,
  proposal: TreasuryProposal,
  proposalExtra?: React.ReactNode,
  proposalId: string
};

class Item extends React.PureComponent<Props> {
  render () {
    const { children, className, proposalExtra, proposalId } = this.props;

    return (
      <Card className={className}>
        <div className='ui--Row'>
          <div className='ui--Row-base'>
            <div className='ui--Row-details treasury--Item-header'>
              <h3 className='treasury--Item-header-id'>
                #{proposalId}
              </h3>
            </div>
            {children}
          </div>
          {proposalExtra}
        </div>
      </Card>
    );
  }
}

export default translate(styled(Item as React.ComponentClass<Props>)`
  ${rowStyles}

  .treasury--Item-header {
    margin: -0.5rem -0.5rem 0 0;
  }

  .treasury--Approve-approved {
    color: green;
    margin: 0;
  }

  .treasury--Item-header-id {
    font-size: 2rem;
    line-height: 2rem;
  }
`);
