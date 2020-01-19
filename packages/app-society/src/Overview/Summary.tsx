// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSociety } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { AccountName, IdentityIcon, SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

interface NameProps {
  label: string;
  value?: AccountId;
}

function Name ({ label, value }: NameProps): React.ReactElement<NameProps> | null {
  if (!value) {
    return null;
  }

  return (
    <CardSummary label={label}>
      <div className='society--header--account'>
        <IdentityIcon
          size={24}
          value={value}
        />
        <AccountName value={value} />
      </div>
    </CardSummary>
  );
}

function Summary ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const info = useCall<DeriveSociety>(api.derive.society.info, []);
  const members = useCall<any[]>(api.derive.society.members, []);

  const pot = info?.pot.gtn(0)
    ? info.pot.toString()
    : null;

  return (
    <SummaryBox className={className}>
      <section>
        <Name
          label={t('head')}
          value={info?.head}
        />
      </section>
      <section>
        {info && members && (
          <CardSummary label={t('members')}>
            {members.length}/{info.maxMembers.toString()}
          </CardSummary>
        )}
      </section>
      <section>
        {pot && (
          <CardSummary label={t('available')}>
            {formatBalance(pot, false)}{formatBalance.calcSi(pot).value}
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default styled(Summary)`
  .society--header--account {
    white-space: nowrap;

    .ui--AccountName,
    .ui--IdentityIcon {
      display: inline-block;
    }

    .ui--IdentityIcon {
      margin-right: 0.5rem;
    }
  }
`;
