// Copyright 2017-2023 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { Expander, MarkWarning } from '@polkadot/react-components';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { formatBalance, nextTick } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface Props {
  accountId?: string | null;
  className?: string;
  extrinsic?: SubmittableExtrinsic | null;
  isHeader?: boolean;
  onChange?: (hasAvailable: boolean) => void;
  tip?: BN;
}

function PaymentInfo ({ accountId, className = '', extrinsic, isHeader }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [dispatchInfo, setDispatchInfo] = useState<RuntimeDispatchInfo | null>(null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId]);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    accountId && extrinsic && extrinsic.hasPaymentInfo &&
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

  const isFeeError = api.consts.balances && !api.tx.balances?.transfer.is(extrinsic) && balances?.accountId.eq(accountId) && (
    balances.availableBalance.lte(dispatchInfo.partialFee) ||
    balances.freeBalance.sub(dispatchInfo.partialFee).lte(api.consts.balances.existentialDeposit)
  );

  return (
    <>
      <Expander
        className={className}
        isHeader={isHeader}
        summary={
          <Trans i18nKey='feesForSubmission'>
            Fees of <span className='highlight'>{formatBalance(dispatchInfo.partialFee, { withSiFull: true })}</span> will be applied to the submission
          </Trans>
        }
      />
      {isFeeError && (
        <MarkWarning content={t<string>('The account does not have enough free funds (excluding locked/bonded/reserved) available to cover the transaction fees without dropping the balance below the account existential amount.')} />
      )}
    </>
  );
}

export default React.memo(PaymentInfo);
