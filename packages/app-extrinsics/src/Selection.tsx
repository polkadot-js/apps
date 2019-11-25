// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { I18nProps, StringOrNull, WithSubmittableButtonProps } from '@polkadot/react-components/types';
import { QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import React, { useEffect, useState } from 'react';
import { Button, Extrinsic, InputAddress, TxButton, withSubmittableButton } from '@polkadot/react-components';
import { withApi, withMulti } from '@polkadot/react-api';
import { BalanceFree } from '@polkadot/react-query';

import translate from './translate';

interface Props extends ApiProps, I18nProps, WithSubmittableButtonProps {
  queueExtrinsic: QueueTxExtrinsicAdd;
}

function getExtrinsic ({ api }: Props, method: Call | null): SubmittableExtrinsic | null {
  if (!method) {
    return null;
  }

  const fn = api.findCall(method.callIndex);

  return api.tx[fn.section][fn.method](...method.args);
}

function Selection (props: Props): React.ReactElement<Props> {
  const { apiDefaultTxSudo, onTextEnterKey, submitButtonRef, t } = props;

  const [accountId, setAccountId] = useState<StringOrNull>(null);
  const [method, setMethod] = useState<Call | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic | null>(getExtrinsic(props, method));
  const [isValid, setIsValid] = useState(false);

  const _onChangeAccountId = (accountId: StringOrNull): void => {
    setAccountId(accountId);
  };

  const _onChangeMethod = (method?: Call): void => {
    setMethod(method || null);
  };

  useEffect((): void => {
    setIsValid(
      !(!accountId || !method || (accountId && accountId.length === 0))
    );
  }, [accountId, method]);

  useEffect((): void => {
    setExtrinsic(getExtrinsic(props, method));
  }, [method]);

  return (
    <div className='extrinsics--Selection'>
      <InputAddress
        label={t('using the selected account')}
        labelExtra={
          <BalanceFree
            label={
              <label>
                {t('free balance')}
              </label>
            }
            params={accountId}
          />
        }
        onChange={_onChangeAccountId}
        type='account'
      />
      <Extrinsic
        defaultValue={apiDefaultTxSudo}
        label={t('submit the following extrinsic')}
        onChange={_onChangeMethod}
        onEnter={onTextEnterKey}
      />
      <Button.Group>
        <TxButton
          isBasic
          isDisabled={!method}
          isUnsigned
          label={t('Submit Unsigned')}
          icon='sign-in'
          extrinsic={extrinsic}
        />
        <Button.Or />
        <TxButton
          accountId={accountId}
          isDisabled={!isValid}
          isPrimary
          label={t('Submit Transaction')}
          icon='sign-in'
          extrinsic={extrinsic}
          innerRef={submitButtonRef}
        />
      </Button.Group>
    </div>
  );
}

export default withMulti(
  Selection,
  translate,
  withSubmittableButton,
  withApi
);
