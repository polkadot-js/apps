// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { INumber } from '@polkadot/types/types';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import getCommitteeManagement from '@polkadot/react-api/getCommitteeManagement';
import { Button, CardSummary, InputAddressSimple, Spinner, SummaryBox, Table } from '@polkadot/react-components';
import { useApi, useCall, useNextTick } from '@polkadot/react-hooks';
import { u32 } from '@polkadot/types-codec';

import Address from '../Performance/Address/index.js';
import { calculatePercentReward } from '../Performance/CurrentList.js';
import useSessionCommitteePerformance from '../Performance/useCommitteePerformance.js';
import useCurrentSessionInfo from '../Performance/useCurrentSessionInfo.js';
import { useTranslation } from '../translate.js';
import Validator from './Validator.js';

interface Props {
  className?: string;
}

function doQuery (validatorId?: string | null): void {
  if (validatorId) {
    window.location.hash = `/staking/query/${validatorId}`;
  }
}

function Query ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { value } = useParams<{ value: string }>();
  const [validatorId, setValidatorId] = useState<string | null>(value || null);
  const underperformedValidatorSessionCount = useCall<u32>(
    getCommitteeManagement(api).query.underperformedValidatorSessionCount,
    [value]
  );

  const [currentSession, currentEra, historyDepth, minimumSessionNumber] = useCurrentSessionInfo();
  const isNextTick = useNextTick();

  function range (size: number, startAt = 0) {
    return [...Array(size).keys()].map((i) => i + startAt);
  }

  const isAlephChain = useMemo(() => {
    return api.runtimeChain.toString().includes('Aleph Zero');
  }, [api]
  );

  const pastSessions = useMemo(() => {
    if (currentSession && currentEra && historyDepth && minimumSessionNumber) {
      const maxSessionQueryDepth = 4 * historyDepth;

      const minSessionNumber = Math.max(minimumSessionNumber, currentSession - maxSessionQueryDepth);
      const queryDepth = currentSession - minSessionNumber;

      return range(queryDepth, currentSession - queryDepth).reverse();
    }

    return [];
  }, [currentSession, currentEra, historyDepth, minimumSessionNumber]
  );

  const sessionCommitteePerformance = useSessionCommitteePerformance(pastSessions);

  const filteredSessionPerformances = useMemo(() => {
    return sessionCommitteePerformance.map(({ expectedBlockCount, performance, sessionId }) => {
      return performance.filter((performance) => performance.accountId === value).map((performance) => {
        return [performance.blockCount, sessionId, expectedBlockCount];
      });
    }).flat();
  },
  [sessionCommitteePerformance, value]);

  const numberOfNonZeroPerformances = useMemo(() => {
    return sessionCommitteePerformance.filter(({ performance }) =>
      performance.length).length;
  },
  [sessionCommitteePerformance]);

  const list = useMemo(
    () => isNextTick
      ? filteredSessionPerformances
      : [],
    [isNextTick, filteredSessionPerformances]
  );

  const eras = useCall<INumber[]>(api.derive.staking.erasHistoric);

  const labels = useMemo(
    () => eras && eras.map((e) => e.toHuman() as string),
    [eras]
  );

  const _onQuery = useCallback(
    () => doQuery(validatorId),
    [validatorId]
  );

  const headerRef = useRef<[string, string, number?][]>(
    [
      [t<string>('session performance in last 4 eras'), 'start', 1],
      [t<string>('session'), 'expand'],
      [t<string>('blocks created'), 'expand'],
      [t<string>('max % reward'), 'expand']
    ]
  );

  if (!labels) {
    return <Spinner />;
  }

  return (
    <div className={className}>
      <InputAddressSimple
        className='staking--queryInput'
        defaultValue={value}
        label={t<string>('validator to query')}
        onChange={setValidatorId}
        onEnter={_onQuery}
      >
        <Button
          icon='play'
          isDisabled={!validatorId}
          onClick={_onQuery}
        />
      </InputAddressSimple>
      {value && !!isAlephChain &&
      <SummaryBox className={className}>

        <CardSummary label={t<string>('Underperformed Session Count')}>
          {underperformedValidatorSessionCount?.toString()}
        </CardSummary>
      </SummaryBox>
      }
      {value && !!isAlephChain &&
      <Table
        className={className}
        empty={numberOfNonZeroPerformances === pastSessions.length && <div>{t<string>('No entries found')}</div>}
        emptySpinner={
          <>
            {(numberOfNonZeroPerformances !== pastSessions.length) && <div>{t<string>('Querying past performances')}</div>}
          </>
        }
        header={headerRef.current}
      >
        {list && list.map((performance): React.ReactNode => (
          <Address
            address={value}
            blocksCreated={performance[0]}
            filterName={''}
            key={performance[1]}
            rewardPercentage={calculatePercentReward(performance[0], performance[2], true)}
            session={performance[1]}
          />
        ))}
      </Table>}
      {value && (
        <Validator
          labels={labels}
          validatorId={value}
        />
      )}
    </div>
  );
}

export default React.memo(Query);
