// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SessionRewards } from '../types';

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, InputAddressSimple } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Validator from './Validator';

interface Props {
  className?: string;
  sessionRewards: SessionRewards[];
}

export default function Query ({ className, sessionRewards }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { value } = useParams();
  const [validatorId, setValidatorId] = useState<string | null>(value || null);

  const _onQuery = (): void => {
    if (validatorId) {
      window.location.hash = `/staking/query/${validatorId}`;
    }
  };

  return (
    <div className={className}>
      <InputAddressSimple
        className='staking--queryInput'
        defaultValue={value}
        help={t('Display overview information for the selected validator, including blocks produced.')}
        label={t('validator to query')}
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
        <Validator
          sessionRewards={sessionRewards}
          validatorId={value}
        />
      )}
    </div>
  );
}
