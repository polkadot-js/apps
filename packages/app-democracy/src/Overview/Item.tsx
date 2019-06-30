// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { Method, Proposal } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Call, Card } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';
import { styles as rowStyles } from '@polkadot/ui-app/Row';

import translate from '../translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  proposal: Proposal,
  proposalExtra?: React.ReactNode,
  idNumber: BN | number
};

class Item extends React.PureComponent<Props> {
  render () {
    const { children, className, idNumber, proposal, proposalExtra } = this.props;
    const { meta, method, section } = Method.findFunction(proposal.callIndex);

    return (
      <Card className={className}>
        <div className='ui--Row'>
          <div className='ui--Row-base'>
            <div className='ui--Row-details democracy--Item-header'>
              <h3>#{formatNumber(idNumber)}: {section}.{method}</h3>
              {meta && meta.documentation && (
                <details>
                  <summary>{meta.documentation.join(' ')}</summary>
                </details>
              )}
            </div>
            {children}
          </div>
          <Call
            className='democracy--Item-extrinsic'
            value={proposal}
          >
            {proposalExtra}
          </Call>
        </div>
      </Card>
    );
  }
}

export default translate(styled(Item as React.ComponentClass<Props>)`
  ${rowStyles}

  .democracy--Item-extrinsic {
    margin-top: 1rem;

    .ui--Params-Content {
      padding-left: 0;
    }
  }

  .democracy--Item-header {
    margin-bottom: 1rem;
  }

  .ui--Row-details.democracy--Item-header{
    min-width: 0;
  }
`);
