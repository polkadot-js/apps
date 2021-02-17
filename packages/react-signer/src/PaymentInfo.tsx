// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { Expander, MarkWarning } from '@polkadot/react-components';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { formatBalance, isFunction } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  accountId?: string | null;
  className?: string;
  extrinsic?: SubmittableExtrinsic | null;
  isSendable: boolean;
  onChange?: (hasAvailable: boolean) => void;
  tip?: BN;
}

function PaymentInfo ({ accountId, className = '', extrinsic }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [dispatchInfo, setDispatchInfo] = useState<RuntimeDispatchInfo | null>(null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [accountId]);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    accountId && extrinsic && isFunction(extrinsic.paymentInfo) && isFunction(api.rpc.payment?.queryInfo) &&
      setTimeout((): void => {
        try {
          extrinsic
            .paymentInfo(accountId)
            .then((info) => mountedRef.current && setDispatchInfo(info))
            .catch(console.error);
        } catch (error) {
          console.error(error);
        }
      }, 0);
  }, [api, accountId, extrinsic, mountedRef]);

  if (!dispatchInfo || !extrinsic) {
    return null;
  }

  return (
    <>
      <Expander
        className={className}
        summary={
          <Trans i18nKey='feesForSubmission'>
            Fees of <span className='highlight'>{formatBalance(dispatchInfo.partialFee, { withSiFull: true })}</span> will be applied to the submission
          </Trans>
        }
      />
      {api.consts.balances && !api.tx.balances?.transfer.is(extrinsic) && balances?.accountId.eq(accountId) && balances.availableBalance.sub(dispatchInfo.partialFee).lte(api.consts.balances.existentialDeposit) && (
        <MarkWarning content={t<string>('The account does not have enough funds to cover the transaction fees without dropping the balance below the account existential amount.')} />
      )}
    </>
  );
}

export default React.memo(PaymentInfo);
