// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';

import {Button, InputAddressSimple, Table, Toggle} from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Validator from './Validator';
import useCurrentSessionInfo from "@polkadot/app-staking/Performance/useCurrentSessionInfo";
import useValidatorPerformance, { ValidatorPerformance } from "@polkadot/app-staking/Performance/useCommitteePerformance";
import useEra from "@polkadot/app-staking/Performance/useEra";
import useSessionCommitteePerformance from "@polkadot/app-staking/Performance/useCommitteePerformance";
import Address from "@polkadot/app-staking/Performance/Address";
import {calculatePercentReward} from "@polkadot/app-staking/Performance/CurrentList";
import Filtering from "@polkadot/app-staking/Filtering";


interface Props {
  className?: string;
}

function Query ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { value } = useParams<{ value: string }>();
  const [validatorId, setValidatorId] = useState<string | null>(value || null);

  const [currentSession, currentEra, historyDepth, minimumSessionNumber] = useCurrentSessionInfo();
  const [ sessionsValidatorPerformance, setSessionsValidatorPerformance ] = useState<ValidatorPerformance[]>([]);

  function range(size : number, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  }

  const pastSessions = useMemo(() => {
      if (currentSession && currentEra) {
        const sessionQueryDepth = 400;
        return range(sessionQueryDepth, currentSession - sessionQueryDepth - 1);
      }
      return [];
    }, [currentSession, currentEra]
  );

  const sessionCommitteePerformance = useSessionCommitteePerformance(pastSessions);

  const list = useMemo(() => {
    return sessionCommitteePerformance.map(({performance, sessionId}) =>
      performance.filter((performance) => performance.accountId === value).map((performance) => {
        return [performance, sessionId];
      })).flat();
  },
   [sessionCommitteePerformance]);


  const _onQuery = useCallback(
    (): void => {
      if (validatorId) {
        window.location.hash = `/staking/query/${validatorId}`;
      }
    },
    [validatorId]
  );

  const headerRef = useRef(
    [
      [t('performance'), 'start', 2],
      [t('session'), 'expand'],
      [t('blocks created'), 'expand'],
      [t('blocks expected'), 'expand'],
      [t('max % reward'), 'expand'],
      [],
      [undefined, 'media--1200']
    ]
  );

  console.log("list", list);
  return (
    <div className={className}>
      <InputAddressSimple
        className='staking--queryInput'
        defaultValue={value}
        help={t<string>('Display overview information for the selected validator, including blocks produced.')}
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
      {value && <Table
        className={className}
        empty={
          sessionCommitteePerformance && t<string>('No active validators found')
        }
        emptySpinner={
          <>
            {!sessionCommitteePerformance && <div>{t<string>('Preparing validator list')}</div>}
          </>
        }
        header={headerRef.current}
      >
    {list && list.map((performance): React.ReactNode => (
        <Address
          address={(performance[0] as ValidatorPerformance).accountId}
          blocksCreated={(performance[0] as ValidatorPerformance).blockCount}
          blocksTarget={(performance[0] as ValidatorPerformance).expectedBlockCount}
          filterName={''}
          key={(performance[0] as ValidatorPerformance).accountId}
          session={performance[1] as number}
          rewardPercentage={calculatePercentReward((performance as unknown as ValidatorPerformance).blockCount, (performance as unknown as ValidatorPerformance).expectedBlockCount).toFixed(1)}
        />
      ))}
      </Table>}

      {value && (
        <Validator validatorId={value} />
      )}
    </div>
  );
}

export default React.memo(Query);
