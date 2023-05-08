// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressInfo, styled } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  address: string;
  className?: string;
}

const WITH_BALANCE = { available: true, bonded: true, free: true, locked: true, reserved: true, total: true };

function Balances ({ address, className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <StyledSection className={className}>
      <div className='ui--AddressMenu-sectionHeader'>
        {t<string>('balance')}
      </div>
      <AddressInfo
        address={address}
        className='balanceExpander'
        key={address}
        withBalance={WITH_BALANCE}
        withLabel
      />
    </StyledSection>
  );
}

const StyledSection = styled.section`
  .balanceExpander {
    justify-content: flex-start;

    .column {
      width: auto;
      max-width: 18.57rem;

      label {
        text-align: left;
        color: inherit;
      }

      .ui--Expander-content .ui--FormatBalance-value {
        font-size: var(--font-size-small);
      }
    }
  }
`;

export default React.memo(Balances);
