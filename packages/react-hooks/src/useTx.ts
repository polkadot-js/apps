// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { Call } from '@polkadot/types/interfaces';
import { ExtrinsicAndSenders, TxSources, TxProps, TxState } from './types';

import { useContext, useMemo, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { StatusContext } from '@polkadot/react-components';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { assert, isFunction } from '@polkadot/util';
import useApi from './useApi';

function getExtrinsic<T extends TxSources> (api: ApiPromise, tx: T): SubmittableExtrinsic | null {
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
    if ((tx as Call).callIndex) {
      const fn = api.findCall(tx.callIndex);

      return api.tx[fn.section][fn.method](...tx.args);
    }

    return tx as any as SubmittableExtrinsic;
  }
}

export default function useTx<T extends TxSources> (source: T, { accountId: anAccountId, onChangeAccountId, onStart, onSuccess, onFailed, onUpdate }: TxProps = {}): TxState {
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);

  const [accountId, setAccountId] = useState<StringOrNull>(anAccountId || null);
  const [isSending, setIsSending] = useState(false);

  const _onStart = useMemo(
    (): () => void => (): void => {
      setIsSending(true);

      onStart && onStart();
    },
    [onStart]
  );

  const _onSuccess = useMemo(
    (): () => void => (): void => {
      setIsSending(false);

      onSuccess && onSuccess();
    },
    [onSuccess]
  );

  const _onFailed = useMemo(
    (): () => void => (): void => {
      setIsSending(false);

      onFailed && onFailed();
    },
    [onFailed]
  );

  const _onUpdate = useMemo(
    (): () => void => (): void => {
      setIsSending(false);

      onUpdate && onUpdate();
    },
    [onUpdate]
  );

  function getExtrinsicAndSenders (api: ApiPromise, accountId: StringOrNull, tx: T): ExtrinsicAndSenders {
    const extrinsic = getExtrinsic<T>(api, tx);

    function _sendTx (isUnsigned?: boolean): void {
      !!extrinsic && queueExtrinsic({
        accountId,
        extrinsic,
        isUnsigned,
        txFailedCb: _onFailed,
        txStartCb: _onStart,
        txSuccessCb: _onSuccess,
        txUpdateCb: _onUpdate
      });
    }

    return {
      extrinsic,
      sendTx: (): void => _sendTx(),
      sendUnsigned: (): void => _sendTx(true)
    };
  }

  const txAndSenders = useMemo<ExtrinsicAndSenders>(
    (): ExtrinsicAndSenders => getExtrinsicAndSenders(api, accountId, source),
    [accountId, source]
  );

  return {
    ...txAndSenders,
    isSending,
    accountId,
    onChangeAccountId: (accountId: StringOrNull): void => {
      setAccountId(accountId);

      onChangeAccountId && onChangeAccountId(accountId);
    }
  };
}
