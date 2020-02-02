// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSociety } from '@polkadot/api-derive/types';
import { AccountId, BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { AccountIndex, IdentityIcon, SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  info?: DeriveSociety;
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
        <AccountIndex value={value} />
      </div>
    </CardSummary>
  );
}

function Summary ({ className, info }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const members = useCall<any[]>(api.derive.society.members, []);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);

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
      <section className='ui--media-medium'>
        {info && members && (
          <CardSummary label={t('members')}>
            {members.length}/{info.maxMembers.toString()}
          </CardSummary>
        )}
      </section>
      {bestNumber && (
        <>
          <section>
            <CardSummary
              label={t('rotation')}
              progress={{
                total: api.consts.society.rotationPeriod as BlockNumber,
                value: bestNumber.mod(api.consts.society.rotationPeriod as BlockNumber)
              }}
            />
          </section>
          <section className='ui--media-large'>
            <CardSummary
              label={t('challenge')}
              progress={{
                total: api.consts.society.challengePeriod as BlockNumber,
                value: bestNumber.mod(api.consts.society.challengePeriod as BlockNumber)
              }}
            />
          </section>
        </>
      )}
      <section>
        <CardSummary label={t('pot')}>
          <FormatBalance
            value={pot}
            withSi
          />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default styled(Summary)`
  .society--header--account {
    white-space: nowrap;

    .ui--AccountIndex,
    .ui--IdentityIcon {
      display: inline-block;
    }

    .ui--IdentityIcon {
      margin-right: 0.5rem;
    }
  }
`;
