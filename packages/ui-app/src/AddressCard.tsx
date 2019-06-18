// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// import { I18nProps } from '@polkadot/ui-app/types';

// @ts-ignore This line needed for the styled export... don't ask why
import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';

import AddressRow, { Props as AddressProps } from './AddressRow';
import Card from './Card';
import LinkPolkascan from './LinkPolkascan';

import translate from './translate';

type Props = AddressProps & {
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
            />
          </div>
        )}
      </Card>
    );
  }
}

export default translate(styled(AddressCard as React.ComponentClass<Props>)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .ui--Row-buttons .ui--Button-Group .ui.button {
    visibility: visible;
    margin-right: .25rem;
  }

  .ui--AddressCard-explorer {
    margin: 0 -0.25rem -0.5rem 0;
    text-align: right;

    .ui--AddressCard-exporer-link {
      display: inline-block;
      margin-top: 0.5rem;
    }
  }
`);
