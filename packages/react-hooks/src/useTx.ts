// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { TxDef, TxIsSubmittable, TxSenders, TxSource, TxProps, TxState } from './types';

import { useContext, useMemo, useState } from 'react';
import { StatusContext } from '@polkadot/react-components/Status';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import useToggle from './useToggle';

export default function useTx (memoFn: (...args: any[]) => TxSource, memoArr: any[] = [], { accountId: anAccountId, onChangeAccountId, onQueue, onStart, onSuccess, onFailed, onUpdate }: TxProps = {}): TxState {
  const { queueExtrinsic } = useContext(StatusContext);

  const { tx, isSubmittable } = useMemo<TxSource>(memoFn, memoArr);

  const [accountId, setAccountId] = useState<StringOrNull>(anAccountId || null);
  const [isSending, , setIsSending] = useToggle(false);

  const _onQueue = (): void => {
    onQueue && onQueue();
  };

  const _onStart = (): void => {
    setIsSending(true);

    onStart && onStart();
  };

  const _onSuccess = (): void => {
    setIsSending(false);

    onSuccess && onSuccess();
  };

  const _onFailed = (): void => {
    setIsSending(false);

    onFailed && onFailed();
  };

  const _onUpdate = (): void => {
    setIsSending(false);

    onUpdate && onUpdate();
  };

  function getSenders (accountId: StringOrNull, extrinsic: TxDef, isSubmittable: TxIsSubmittable): TxSenders {
    function _sendTx (isUnsigned?: boolean): void {
      !!extrinsic && isSubmittable && queueExtrinsic({
        accountId,
        extrinsic: extrinsic as SubmittableExtrinsic,
        isUnsigned,
        txFailedCb: _onFailed,
        txStartCb: _onStart,
        txSuccessCb: _onSuccess,
        txUpdateCb: _onUpdate
      });
      _onQueue();
    }

    return {
      isSubmittable: !!accountId && !!extrinsic && isSubmittable,
      sendTx: (): void => {
        _sendTx();
      },
      sendUnsigned: (): void => {
        _sendTx(true);
      }
    };
  }

  const senders = useMemo<TxSenders>(
    (): TxSenders => getSenders(accountId, tx, isSubmittable),
    [accountId, tx, isSubmittable]
  );

  return {
    ...senders,
    isSending,
    accountId,
    onChangeAccountId: (accountId: StringOrNull): void => {
      setAccountId(accountId);

      onChangeAccountId && onChangeAccountId(accountId);
    }
  };
}
