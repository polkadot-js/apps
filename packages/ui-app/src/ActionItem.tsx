// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Method, Proposal } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatNumber } from '@polkadot/util';

import Call from './Call';
import Card from './Card';
import { styles as rowStyles } from './Row';

type Props = {
  className?: string,
  children?: React.ReactNode,
  accessory?: React.ReactNode,
  proposal?: Proposal,
  idNumber: BN | number | string
};

export const styles = `
  ${rowStyles}

  .ui--ActionItem-extrinsic {
    margin-top: 1rem;

    .ui--Params-Content {
      padding-left: 0;
    }
  }

  .ui--ActionItem-header {
    margin-bottom: 1rem;
  }

  .ui--ActionItem-buttons {

  }
`;

class ActionItem extends React.PureComponent<Props> {
  render () {
    const { className, children, accessory, proposal } = this.props;

    const idNumber = typeof this.props.idNumber === 'string'
      ? this.props.idNumber
      : formatNumber(this.props.idNumber);

    return (
      <Card className={className}>
        <div className='ui--Row'>
          <div className='ui--Row-base'>
            <div className='ui--Row-details'>
              {
                proposal ?
                  (() => {
                    const { meta, method, section } = Method.findFunction(proposal.callIndex);

                    return (
                      <>
                        <h3>#{idNumber}: {section}.{method}</h3>
                        {meta && meta.documentation && (
                          <details>
                            <summary>{meta.documentation.join(' ')}</summary>
                          </details>
                        )}
                        <Call
                          className='ui--ActionItem-extrinsic'
                          value={proposal}
                        />
                      </>
                    );
                  })() :
                  (
                    <h3>#{idNumber}</h3>
                  )
              }
            </div>
            {accessory}
          </div>
          {children}
        </div>
      </Card>
    );
  }
}

export default styled(ActionItem as React.ComponentClass<Props>)`${styles}`;
