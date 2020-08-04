// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { TxButtonProps as Props } from './types';

import React, { useCallback, useContext } from 'react';
import { SubmittableResult } from '@polkadot/api';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { assert, isFunction } from '@polkadot/util';

import Button from './Button';
import { StatusContext } from './Status';
import { useTranslation } from './translate';

function TxButton ({ accountId, className = '', extrinsic: propsExtrinsic, icon, isBasic, isBusy, isDisabled, isIcon, isUnsigned, label, onClick, onFailed, onSendRef, onStart, onSuccess, onUpdate, params, tooltip, tx, withSpinner }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);
  const [isSending, , setIsSending] = useToggle(false);
  const needsAccount = !isUnsigned && !accountId;

  const _onFailed = useCallback(
    (result: SubmittableResult | null): void => {
      setIsSending(false);

      onFailed && onFailed(result);
    },
    [onFailed, setIsSending]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      setIsSending(false);

      onSuccess && onSuccess(result);
    },
    [onSuccess, setIsSending]
  );

  const _onSend = useCallback(
    (): void => {
      let extrinsic: SubmittableExtrinsic<'promise'>;

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
    },
    [_onFailed, _onSuccess, accountId, api.tx, isUnsigned, onClick, onFailed, onStart, onSuccess, onUpdate, params, propsExtrinsic, queueExtrinsic, setIsSending, tx, withSpinner]
  );

  if (onSendRef) {
    onSendRef.current = _onSend;
  }

  return (
    <Button
      className={className}
      icon={icon || 'check'}
      isBasic={isBasic}
      isBusy={isBusy}
      isDisabled={isSending || isDisabled || needsAccount}
      isIcon={isIcon}
      label={label || (isIcon ? '' : t<string>('Submit'))}
      onClick={_onSend}
      tooltip={tooltip}
    />
  );
}

export default React.memo(TxButton);
