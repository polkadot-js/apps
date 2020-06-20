// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { AddressInfo, Icon } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  address: string;
}

const WITH_BALANCE = { available: true, bonded: true, free: true, locked: true, reserved: true, total: true };

function Balances ({ address }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <section>
      <div className='ui--AddressMenu-sectionHeader'>
        <div>
          <Icon name='sort amount down' />
          &nbsp;
          {t<string>('balance')}
        </div>
      </div>
      <AddressInfo
        address={address}
        withBalance={WITH_BALANCE}
        withBalanceToggle
        withExtended={false}
      />
    </section>
  );
}

export default React.memo(Balances);
