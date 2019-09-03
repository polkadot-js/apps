// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// import { I18nProps } from '@polkadot/react-components/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore This line needed for the styled export... don't ask why
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';

import AddressRow, { Props as AddressProps } from './AddressRow';
import Card from './Card';
import LinkPolkascan from './LinkPolkascan';

import translate from './translate';

interface Props extends AddressProps {
  withExplorer?: boolean;
}

function AddressCard (props: Props): React.ReactElement<Props> {
  const { className, value, withExplorer } = props;
  return (
    <Card className={className}>
      <AddressRow
        {...props}
        className='ui--AddressCard-AddressRow'
      />
      {withExplorer && value && (
        <div className='ui--AddressCard-explorer'>
          <LinkPolkascan
            className='ui--AddressCard-exporer-link'
            data={value.toString()}
            type='address'
          />
        </div>
      )}
    </Card>
  );
}

export default translate(styled(AddressCard)`
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
