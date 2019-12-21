// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { Call } from '@polkadot/types/interfaces';
import { ExtrinsicAndSenders, TxDef, TxDefs, TxSource, TxProps, TxState } from './types';

import { useContext, useMemo, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { StatusContext } from '@polkadot/react-components';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { assert, isFunction } from '@polkadot/util';
import useApi from './useApi';

function getExtrinsic<T extends TxDefs> (api: ApiPromise, txDef: T): SubmittableExtrinsic | null {
  if (!txDef) {
    return null;
  }

  if (Array.isArray(txDef)) {
    const [section, method] = txDef[0].split('.');

    assert(api.tx[section] && api.tx[section][method], `Unable to find api.tx.${section}.${method}`);
    try {
      return api.tx[section][method](...(
        isFunction(txDef[1])
          ? txDef[1]()
          : txDef[1]
      )) as any as SubmittableExtrinsic;
    } catch (e) {
      return null;
    }
  } else {
    if ((txDef as Call).callIndex) {
      const fn = api.findCall(txDef.callIndex);

      return api.tx[fn.section][fn.method](...txDef.args);
    }

    return txDef as any as SubmittableExtrinsic;
  }
}

export default function useTx<T extends TxDef> (memoFn: (...args: any[]) => TxSource<T>, memoArr: any[], { accountId: anAccountId, onChangeAccountId, onStart, onSuccess, onFailed, onUpdate }: TxProps = {}): TxState {
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);

  const txSource = useMemo(memoFn, memoArr);

  const [accountId, setAccountId] = useState<StringOrNull>(anAccountId || null);
  const [isSending, setIsSending] = useState(false);

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

  function getExtrinsicAndSenders (api: ApiPromise, accountId: StringOrNull, [txDef, isSubmittable]: TxSource<T>): ExtrinsicAndSenders {
    const extrinsic = getExtrinsic<T>(api, txDef);

    function _sendTx (isUnsigned?: boolean): void {
      !!extrinsic && isSubmittable && queueExtrinsic({
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
      isSubmittable: !!accountId && !!extrinsic && isSubmittable,
      sendTx: (): void => _sendTx(),
      sendUnsigned: (): void => _sendTx(true)
    };
  }

  const txAndSenders = useMemo<ExtrinsicAndSenders>(
    (): ExtrinsicAndSenders => getExtrinsicAndSenders(api, accountId, txSource),
    [accountId, txSource]
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
