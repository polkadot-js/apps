// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button, InputAddressSimple } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Validator from './Validator';

interface Props {
  className?: string;
}

function Query ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { value } = useParams<{ value: string }>();
  const [validatorId, setValidatorId] = useState<string | null>(value || null);

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
