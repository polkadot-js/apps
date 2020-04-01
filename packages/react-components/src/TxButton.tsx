// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TxButtonProps as Props } from './types';

import React, { useContext } from 'react';
import { SubmittableResult } from '@polkadot/api';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { assert, isFunction, isUndefined } from '@polkadot/util';

import Button from './Button';
import { StatusContext } from './Status';
import { useTranslation } from './translate';

function TxButton ({ accountId, className, extrinsic: propsExtrinsic, icon, isBasic, isDisabled, isIcon, isNegative, isPrimary, isUnsigned, label, onClick, onFailed, onSendRef, onStart, onSuccess, onUpdate, params, size, tooltip, tx, withSpinner }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);
  const [isSending, , setIsSending] = useToggle(false);
  const needsAccount = !isUnsigned && !accountId;

  const _onFailed = (result: SubmittableResult | null): void => {
    setIsSending(false);

    onFailed && onFailed(result);
  };

  const _onSuccess = (result: SubmittableResult): void => {
    setIsSending(false);

    onSuccess && onSuccess(result);
  };

  const _onSend = (): void => {
    let extrinsic: any;

    if (propsExtrinsic) {
      extrinsic = propsExtrinsic;
    } else {
      const [section, method] = (tx || '').split('.');

      assert(api.tx[section] && api.tx[section][method], `Unable to find api.tx.${section}.${method}`);

      extrinsic = api.tx[section][method](...(
        isFunction(params)
          ? params()
          : (params || [])
      ));
    }

    assert(extrinsic, 'Expected generated extrinsic passed to TxButton');

    if (withSpinner) {
      setIsSending(true);
    }

    queueExtrinsic({
      accountId: accountId && accountId.toString(),
      extrinsic,
      isUnsigned,
      txFailedCb: withSpinner ? _onFailed : onFailed,
      txStartCb: onStart,
      txSuccessCb: withSpinner ? _onSuccess : onSuccess,
      txUpdateCb: onUpdate
    });

    onClick && onClick();
  };

  if (onSendRef) {
    onSendRef.current = _onSend;
  }

  return (
    <Button
      className={className}
      icon={icon || 'check'}
      isBasic={isBasic}
      isDisabled={isSending || isDisabled || needsAccount}
      isIcon={isIcon}
      isLoading={isSending}
      isNegative={isNegative}
      isPrimary={
        isUndefined(isPrimary) && isUndefined(isIcon)
          ? (!isNegative && !isBasic)
          : isPrimary
      }
      label={label || (isIcon ? '' : t('Submit'))}
      onClick={_onSend}
      size={size}
      tooltip={tooltip}
    />
  );
}

export default React.memo(TxButton);
