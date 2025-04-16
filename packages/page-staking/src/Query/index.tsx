// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { INumber } from '@polkadot/types/types';

import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button, InputAddressSimple, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Validator from './Validator.js';

interface Props {
  basePath: string,
  className?: string;
}

function doQuery (basePath: string, validatorId?: string | null): void {
  if (validatorId) {
    window.location.hash = `${basePath}/query/${validatorId}`;
  }
}

function Query ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { value } = useParams<{ value: string }>();
  const [validatorId, setValidatorId] = useState<string | null>(value || null);
  const eras = useCall<INumber[]>(api.derive.staking.erasHistoric);

  const labels = useMemo(
    () => eras?.map((e) => e.toHuman() as string),
    [eras]
  );

  const _onQuery = useCallback(
    () => doQuery(basePath, validatorId),
    [basePath, validatorId]
  );

  if (!labels) {
    return <Spinner />;
  }

  return (
    <div className={className}>
      <InputAddressSimple
        className='staking--queryInput'
        defaultValue={value}
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
          labels={labels}
          validatorId={value}
        />
      )}
    </div>
  );
}

export default React.memo(Query);
