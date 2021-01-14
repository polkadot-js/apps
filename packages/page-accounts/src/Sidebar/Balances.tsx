// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';

import { AddressInfo, Icon } from '@polkadot/react-components';

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
        <div>
          <Icon icon='sort-amount-down' />
          &nbsp;
          {t<string>('balance')}
        </div>
      </div>
      <AddressInfo
        address={address}
        className='balanceExpander'
        withBalance={WITH_BALANCE}
        withBalanceToggle
        withExtended={false}
      />
    </section>
  );
}

export default React.memo(styled(Balances)(({ theme }: ThemeProps) => `
  .balanceExpander {
    .column.column--expander {
      width: auto;

      label {
        color: inherit;
        font-size: 0.93rem;
        font-weight: ${theme.fontWeightNormal};
      }

      .ui--Expander-content .ui--FormatBalance-value {
        font-size: 0.93rem;
      }
    }
  }
`));
