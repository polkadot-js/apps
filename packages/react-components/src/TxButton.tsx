// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableResult } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { TxButtonProps as Props } from './types.js';

import React, { useCallback, useEffect, useState } from 'react';

import { useIsMountedRef, useQueue } from '@polkadot/react-hooks';
import { assert, isFunction } from '@polkadot/util';

import Button from './Button/index.js';
import { useTranslation } from './translate.js';

function TxButton ({ accountId, className = '', extrinsic: propsExtrinsic, icon, isBasic, isBusy, isDisabled, isIcon, isToplevel, isUnsigned, label, onClick, onFailed, onSendRef, onStart, onSuccess, onUpdate, params, tooltip, tx, withSpinner, withoutLink }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const mountedRef = useIsMountedRef();
  const { queueExtrinsic } = useQueue();
  const [isSending, setIsSending] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect((): void => {
    (isStarted && onStart) && onStart();
  }, [isStarted, onStart]);

  const _onFailed = useCallback(
    (result: Error | SubmittableResult | null): void => {
      mountedRef.current && setIsSending(false);

      onFailed && onFailed(result);
    },
    [onFailed, setIsSending, mountedRef]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      mountedRef.current && setIsSending(false);

      onSuccess && onSuccess(result);
    },
    [onSuccess, setIsSending, mountedRef]
  );

  const _onStart = useCallback(
    (): void => {
      mountedRef.current && setIsStarted(true);
    },
    [setIsStarted, mountedRef]
  );

  const _onSend = useCallback(
    (): void => {
      let extrinsics: SubmittableExtrinsic<'promise'>[] | undefined;

      if (propsExtrinsic) {
        extrinsics = Array.isArray(propsExtrinsic)
          ? propsExtrinsic
          : [propsExtrinsic];
      } else if (tx) {
        extrinsics = [
          tx(...(
            isFunction(params)
              ? params()
              : (params || [])
          ))
        ];
      }

      assert(extrinsics?.length, 'Expected generated extrinsic passed to TxButton');

      mountedRef.current && withSpinner && setIsSending(true);

      extrinsics.forEach((extrinsic): void => {
        queueExtrinsic({
          accountId: accountId?.toString(),
          extrinsic,
          isUnsigned,
          txFailedCb: withSpinner ? _onFailed : onFailed,
          txStartCb: _onStart,
          txSuccessCb: withSpinner ? _onSuccess : onSuccess,
          txUpdateCb: onUpdate
        });
      });

      onClick && onClick();
    },
    [_onFailed, _onStart, _onSuccess, accountId, isUnsigned, mountedRef, onClick, onFailed, onSuccess, onUpdate, params, propsExtrinsic, queueExtrinsic, tx, withSpinner]
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
      isDisabled={isSending || isDisabled || (!isUnsigned && !accountId) || (
        tx
          ? false
          : Array.isArray(propsExtrinsic)
            ? propsExtrinsic.length === 0
            : !propsExtrinsic
      )}
      isIcon={isIcon}
      isToplevel={isToplevel}
      label={label || (isIcon ? '' : t('Submit'))}
      onClick={_onSend}
      tooltip={tooltip}
      withoutLink={withoutLink}
    />
  );
}

export default React.memo(TxButton);
