// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import AddressRow, { RowProps } from './AddressRow';
import Card from './Card';
import LinkPolkascan from './LinkPolkascan';

type Props = RowProps & {
  withExplorer?: boolean
};

class AddressCard extends React.PureComponent<Props> {
  render () {
    const { className, value, withExplorer } = this.props;

    return (
      <Card className={className}>
        <AddressRow
          {...this.props}
          className='ui--AddressCard-AddressRow'
        />
        {withExplorer && (
          <div className='ui--AddressCard-explorer'>
            <LinkPolkascan
              className='ui--AddressCard-exporer-link'
              data={value}
              type='address'
            />
          </div>
        )}
      </Card>
    );
  }
}

export default styled(AddressCard)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .ui--AddressCard-explorer {
    margin: 0 -0.25rem -0.5rem 0;
    text-align: right;

    .ui--AddressCard-exporer-link {
      display: inline-block;
    }
  }
`;
