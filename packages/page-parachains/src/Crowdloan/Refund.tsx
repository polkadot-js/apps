// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ParaId } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';

import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  allAccounts: string[];
  className?: string;
  myAccounts: string[];
  paraId: ParaId;
}

function createExtrinsics (api: ApiPromise, addresses: string[], paraId: ParaId, maxPayouts: number): SubmittableExtrinsic<'promise'>[] {
  return addresses
    .reduce((batches: SubmittableExtrinsic<'promise'>[][], address): SubmittableExtrinsic<'promise'>[][] => {
      const tx = api.tx.crowdloan.withdraw(address, paraId);
      const batch = batches[batches.length - 1];

      if (batch.length >= maxPayouts) {
        batches.push([tx]);
      } else {
        batch.push(tx);
      }

      return batches;
    }, [[]])
    .reduce((extrinsics: SubmittableExtrinsic<'promise'>[], batch): SubmittableExtrinsic<'promise'>[] => {
      if (batch.length === 1) {
        extrinsics.push(batch[0]);
      } else if (isFunction(api.tx.utility?.batch)) {
        extrinsics.push(api.tx.utility.batch(batch));
      } else {
        extrinsics.push(...batch);
      }

      return extrinsics;
    }, []);
}

function Refund ({ allAccounts, className, myAccounts, paraId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [extrinsics, setExtrinsics] = useState<SubmittableExtrinsic<'promise'>[] | null>(null);
  const [batchSize, setBatchSize] = useState(0);
  const [withdrawType, setWithdrawType] = useState(0);

  const typeOptions = useMemo(
    () => [
      {
        text: t<string>('Withdraw for all contributed accounts'),
        value: 0
      },
      myAccounts.length && {
        text: t<string>('Withdraw only for my accounts'),
        value: 1
      }
    ].filter((o) => !!o),
    [myAccounts, t]
  );

  useEffect((): void => {
    api.tx.crowdloan
      .withdraw(allAccounts[0], paraId)
      .paymentInfo(allAccounts[0])
      .then((info) => setBatchSize(
        info.weight.isZero()
          ? 128
          : Math.floor(
            api.consts.system.blockWeights.maxBlock
              .muln(64) // 65% of the block weight on a single extrinsic (64 for safety)
              .div(info.weight)
              .toNumber() / 100
          )
      ))
      .catch(console.error);
  }, [api, allAccounts, paraId]);

  useEffect((): void => {
    const addresses = withdrawType === 0
      ? allAccounts
      : myAccounts;

    console.log('batchSize=', batchSize);

    setExtrinsics(() =>
      batchSize && addresses.length
        ? createExtrinsics(api, allAccounts, paraId, batchSize)
        : null
    );
  }, [api, allAccounts, batchSize, myAccounts, paraId, withdrawType]);

  return (
    <>
      <Button
        icon='minus'
        isDisabled={!hasAccounts}
        label={t<string>('Refund')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Withdraw from fund')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('This account will be used to send the transaction.')}>
              <InputAddress
                label={t<string>('requesting from')}
                onChange={setAccountId}
                type='account'
                value={accountId}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The type of withdrawal, all accounts or only own accounts (if available)')}>
              <Dropdown
                label={t<string>('withdrawal type')}
                onChange={setWithdrawType}
                options={typeOptions}
                value={withdrawType}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              extrinsic={extrinsics}
              icon='credit-card'
              isDisabled={!extrinsics || !extrinsics.length || !accountId}
              label={t<string>('Refund')}
              onStart={toggleOpen}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Refund);
