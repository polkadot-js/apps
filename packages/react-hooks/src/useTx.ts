// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ConstructTxFn, StringOrNull } from '@polkadot/react-components/types';
import { IExtrinsic } from '@polkadot/types/types';
import { TxState } from './types';

import { useContext, useMemo, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { StatusContext } from '@polkadot/react-components';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { assert, isFunction } from '@polkadot/util';
import useApi from './useApi';

interface TxProps {
  accountId?: StringOrNull,
  onChangeAccountId?: (_: StringOrNull) => void;
  onSuccess?: () => void;
  onFailed?: () => void;
  onStart?: () => void;
  onUpdate?: () => void;
}

function getExtrinsic (api: ApiPromise, tx: SubmittableExtrinsic | IExtrinsic | [string, any[] | ConstructTxFn] | null, { accountId: anAccountId, onChangeAccountId, onStart, onSuccess, onFailed, onUpdate }: TxProps = {}) {
  if (!tx) {
    return null;
  }
  if (Array.isArray(tx)) {
    const [section, method] = tx[0].split('.');

    assert(api.tx[section] && api.tx[section][method], `Unable to find api.tx.${section}.${method}`);
    try {
      return api.tx[section][method](...(
        isFunction(tx[1])
          ? tx[1]()
          : tx[1]
      )) as any as SubmittableExtrinsic;
    } catch (e) {
      return null;
    }
  } else {
    return tx as any as SubmittableExtrinsic;
  }
}

export default function useTx (tx: SubmittableExtrinsic | IExtrinsic | [string, any[] | ConstructTxFn] | null, { accountId: anAccountId, onChangeAccountId, onStart, onSuccess, onFailed, onUpdate }: TxProps = {}): TxState {
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);

  const [accountId, setAccountId] = useState<StringOrNull>(anAccountId || null);
  const [isSending, setIsSending] = useState(false);
  const extrinsic = useMemo(
    (): SubmittableExtrinsic | null => getExtrinsic(api, tx),
    [api, tx]
  );

  const _onStart = (): void => {
    setIsSending(true);

    onStart && onStart();
  }

  const _onSuccess = (): void => {
    setIsSending(false);

    onSuccess && onSuccess();
  }

  const _onFailed = (): void => {
    setIsSending(false);

    onFailed && onFailed();
  }

  function sendTxFactory (accountId: StringOrNull, extrinsic: SubmittableExtrinsic | null): (_?: boolean) => void {
    return function (isUnsigned?: boolean): void {
      !!extrinsic && queueExtrinsic({
        accountId,
        extrinsic,
        isUnsigned,
        txFailedCb: _onFailed,
        txStartCb: _onStart,
        txSuccessCb: _onSuccess,
        txUpdateCb: onUpdate
      });
    }
  }

  const _sendTx = useMemo<(_?: boolean) => void>(
    () => sendTxFactory(accountId, extrinsic),
    [extrinsic, accountId]
  )

  return {
    extrinsic,
    accountId,
    isSending,
    onChangeAccountId: (accountId: StringOrNull): void => {
      setAccountId(accountId);
      console.log('onChangeAccountId');
  
      onChangeAccountId && onChangeAccountId(accountId);
    },
    sendTx: (): void => {
      _sendTx();
    },
    sendUnsigned: (): void => {
      _sendTx(true);
    }
  };
}
