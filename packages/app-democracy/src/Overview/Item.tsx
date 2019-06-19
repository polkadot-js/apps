// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Method, Proposal } from '@polkadot/types';
import { Call } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';

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
      <article className={className}>
        <div className='democracy--Item-header'>
          <h3>{section}.{method}</h3>
          {meta && meta.documentation && (
            <details>
              <summary>{meta.documentation.join(' ')}</summary>
            </details>
          )}
          <div className='democracy--Item-header-id'>
            #{formatNumber(idNumber)}
          </div>
        </div>
        <div className='democracy--Item-children'>
          {children}
        </div>
        <Call
          className='democracy--Item-extrinsic'
          value={proposal}
        >
          {proposalExtra}
        </Call>
      </article>
    );
  }
}

export default translate(styled(Item as React.ComponentClass<Props>)`
  .democracy--Item-children {
    padding-bottom: 1rem;
  }

  .democracy--Item-extrinsic {
    .ui--Params-Content {
      padding-left: 0;
    }
  }

  .democracy--Item-header {
    margin-bottom: 1rem;
    position: relative;

    .democracy--Item-header-id {
      font-size: 1.5rem;
      line-height: 1.5rem;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
`);
