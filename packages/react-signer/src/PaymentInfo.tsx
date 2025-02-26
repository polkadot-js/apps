// Copyright 2017-2025 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import type { ExtendedSignerOptions } from './types.js';

import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { Expander, MarkWarning } from '@polkadot/react-components';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { BN, formatBalance, nextTick } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface Props {
  accountId?: string | null;
  className?: string;
  extrinsic?: SubmittableExtrinsic | null;
  isHeader?: boolean;
  onChange?: (hasAvailable: boolean) => void;
  tip?: BN;
  signerOptions: ExtendedSignerOptions;
}

function PaymentInfo ({ accountId, className = '', extrinsic, isHeader, signerOptions }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [dispatchInfo, setDispatchInfo] = useState<RuntimeDispatchInfo | null>(null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId]);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    accountId && extrinsic && extrinsic.hasPaymentInfo &&
      nextTick(async (): Promise<void> => {
        setDispatchInfo(null);

        try {
          const info = await extrinsic.paymentInfo(accountId, signerOptions);

          if (signerOptions?.assetId) {
            const convertedFee = new BN((await api.call.assetConversionApi.quotePriceTokensForExactTokens(
              signerOptions?.assetId as string,
              {
                interior: 'Here',
                parents: 1
              } as unknown as string,
              info.partialFee,
              true
            )).toString());

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mountedRef.current && setDispatchInfo({ ...info, partialFee: convertedFee });
          } else {
            mountedRef.current && setDispatchInfo(info);
          }
        } catch (error) {
          console.error(error);
        }
      });
  }, [api, accountId, extrinsic, mountedRef, signerOptions]);

  if (!dispatchInfo || !extrinsic) {
    return null;
  }

  const isFeeError = api.consts.balances && !(api.tx.balances?.transferAllowDeath?.is(extrinsic) || api.tx.balances?.transfer?.is(extrinsic)) && balances?.accountId.eq(accountId) && (
    (balances.transferable || balances.availableBalance).lte(dispatchInfo.partialFee) ||
    balances.freeBalance.sub(dispatchInfo.partialFee).lte(api.consts.balances.existentialDeposit)
  );

  return (
    <>
      <Expander
        className={className}
        isHeader={isHeader}
        summary={
          <Trans i18nKey='feesForSubmission'>
            Fees of <span className='highlight'>
              {formatBalance(dispatchInfo.partialFee, { decimals: signerOptions?.feeAsset?.metadata.decimals.toNumber() ?? api.registry.chainDecimals.at(0), withSiFull: true }).split(' ').slice(0, -1).join(' ')}{' '}
              {signerOptions?.feeAsset?.metadata.symbol.toHuman()?.toString() ?? api.registry.chainTokens.at(0) }
            </span> will be applied to the submission
          </Trans>
        }
      />
      {isFeeError && (
        <MarkWarning content={t('The account does not have enough free funds (excluding locked/bonded/reserved) available to cover the transaction fees without dropping the balance below the account existential amount.')} />
      )}
    </>
  );
}

export default React.memo(PaymentInfo);
