// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { useParams } from 'react-router-dom';

import { Button, InputAddressSimple } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Validator from './Validator';
import useCurrentSessionInfo from "@polkadot/app-staking/Performance/useCurrentSessionInfo";
import useValidatorPerformance, { ValidatorPerformance } from "@polkadot/app-staking/Performance/useValidatorPerformance";
import useEra from "@polkadot/app-staking/Performance/useEra";


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
        const sessionQueryDepth = 10;
        return range(sessionQueryDepth, currentSession - sessionQueryDepth - 1);
      }
      return [];
    }, [currentSession, currentEra]
  );
  
  const _onQuery = useCallback(
    (): void => {
      if (validatorId) {
        window.location.hash = `/staking/query/${validatorId}`;
      }
    },
    [validatorId]
  );

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
      {value && (
        <Validator validatorId={value} />
      )}
    </div>
  );
}

export default React.memo(Query);
