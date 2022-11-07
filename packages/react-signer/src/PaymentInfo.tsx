// Copyright 2017-2022 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { Expander, MarkWarning } from '@polkadot/react-components';
import { useApi, useCall, useFeeAssetBalance, useIsMountedRef } from '@polkadot/react-hooks';
import { formatBalance, nextTick } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  accountId: string | null;
  className?: string;
  extrinsic?: SubmittableExtrinsic | null;
  isSendable: boolean;
  onChange?: (hasAvailable: boolean) => void;
  tip?: BN;
}

function PaymentInfo ({ accountId, className = '', extrinsic }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [feeAsset, feeAssetBalance] = useFeeAssetBalance(accountId);
  const [dispatchInfo, setDispatchInfo] = useState<RuntimeDispatchInfo | null>(null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId]);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    accountId && extrinsic && api.call.transactionPaymentApi &&
      nextTick(async (): Promise<void> => {
        try {
          const info = await extrinsic.paymentInfo(accountId);

          mountedRef.current && setDispatchInfo(info);
        } catch (error) {
          console.error(error);
        }
      });
  }, [api, accountId, extrinsic, mountedRef]);

  if (!dispatchInfo || !extrinsic) {
    return null;
  }

  const isFeeError = !feeAsset && api.consts.balances && !api.tx.balances?.transfer.is(extrinsic) && balances?.accountId.eq(accountId) && (
    balances.availableBalance.lte(dispatchInfo.partialFee) ||
    balances.freeBalance.sub(dispatchInfo.partialFee).lte(api.consts.balances.existentialDeposit)
  );

  const isFeeAssetError = feeAsset && feeAssetBalance?.lte(dispatchInfo.partialFee);

  return (
    <>
      <Expander
        className={className}
        summary={
          <Trans i18nKey='feesForSubmission'>
            Fees of <span className='highlight'>{formatBalance(dispatchInfo.partialFee, { decimals: feeAsset?.decimals, withSiFull: true, withUnit: feeAsset?.symbol })}</span> will be applied to the submission
          </Trans>
        }
      />
      {(isFeeError || isFeeAssetError) && (
        <MarkWarning content={t<string>('The account does not have enough free funds (excluding locked/bonded/reserved) available to cover the transaction fees without dropping the balance below the account existential amount.')} />
      )}
    </>
  );
}

export default React.memo(PaymentInfo);
