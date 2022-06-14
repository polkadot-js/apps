// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { AddressInfo } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  address: string;
  className?: string;
}

const WITH_BALANCE = { available: true, bonded: true, free: true, locked: true, reserved: true, total: true };

function Balances ({ address, className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <section className={className}>
      <div className='ui--AddressMenu-sectionHeader'>
        {t<string>('balance')}
      </div>
      <AddressInfo
        address={address}
        className='balanceExpander'
        withBalance={WITH_BALANCE}
        withExtended={false}
        withLabel
      />
    </section>
  );
}

export default React.memo(styled(Balances)`
  .balanceExpander {
    justify-content: flex-start;

    .column {
      width: auto;
      max-width: 18.57rem;

      label {
        text-align: left;
        color: inherit;
        font-size: 0.93rem;
        font-weight: var(--font-weight-normal);
      }

      .ui--Expander-content .ui--FormatBalance-value {
        font-size: 0.93rem;
      }
    }
  }
`);
