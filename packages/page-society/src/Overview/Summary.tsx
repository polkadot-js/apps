// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveSociety } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  info?: DeriveSociety;
}

function Summary ({ className = '', info }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const members = useCall<unknown[]>(api.derive.society.members);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);

  const pot = useMemo((): string | null => {
    return info && info.pot.gtn(0)
      ? info.pot.toString()
      : null;
  }, [info]);

  return (
    <SummaryBox className={className}>
      <section className='media--1100'>
        {info && members && (
          <CardSummary label={t<string>('members')}>
            {members.length}&nbsp;/&nbsp;{info.maxMembers.toString()}
          </CardSummary>
        )}
      </section>
      {bestNumber && (
        <>
          <section>
            <CardSummary
              label={t<string>('rotation')}
              progress={{
                total: api.consts.society.rotationPeriod as BlockNumber,
                value: bestNumber.mod(api.consts.society.rotationPeriod as BlockNumber),
                withTime: true
              }}
            />
          </section>
          <section className='media--1200'>
            <CardSummary
              label={t<string>('challenge')}
              progress={{
                total: api.consts.society.challengePeriod as BlockNumber,
                value: bestNumber.mod(api.consts.society.challengePeriod as BlockNumber),
                withTime: true
              }}
            />
          </section>
        </>
      )}
      <section>
        {pot && (
          <CardSummary label={t<string>('pot')}>
            <FormatBalance
              value={pot}
              withSi
            />
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(styled(Summary)`
  .society--header--account {
    white-space: nowrap;

    .ui--AccountName {
      display: inline-block;
    }

    .ui--IdentityIcon {
      margin-right: 0.5rem;
    }
  }
`);
