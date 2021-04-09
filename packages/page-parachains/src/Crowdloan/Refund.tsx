// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ParaId } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';

import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle, useTxBatch } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  allAccounts: string[];
  className?: string;
  myAccounts: string[];
  paraId: ParaId;
}

const optTxs = { batchSize: 128 };

function Refund ({ allAccounts, className, myAccounts, paraId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [txs, setTxs] = useState<SubmittableExtrinsic<'promise'>[] | null>(null);
  const [withdrawType, setWithdrawType] = useState(0);
  const extrinsics = useTxBatch(txs, optTxs);

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
    const addresses = withdrawType === 0
      ? allAccounts
      : myAccounts;

    setTxs(() =>
      addresses.length
        ? addresses.map((a) => api.tx.crowdloan.withdraw(a, paraId))
        : null
    );
  }, [api, allAccounts, myAccounts, paraId, withdrawType]);

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
            {!api.tx.crowdloan.refund && (
              <Modal.Columns hint={t<string>('The type of withdrawal, all accounts or only own accounts (if available)')}>
                <Dropdown
                  label={t<string>('withdrawal type')}
                  onChange={setWithdrawType}
                  options={typeOptions}
                  value={withdrawType}
                />
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            {api.tx.crowdloan.refund
              ? (
                <TxButton
                  accountId={accountId}
                  icon='credit-card'
                  label={t<string>('Refund')}
                  onStart={toggleOpen}
                  tx={api.tx.crowdloan.refund}
                />
              )
              : (
                <TxButton
                  accountId={accountId}
                  extrinsic={extrinsics}
                  icon='credit-card'
                  isDisabled={!extrinsics || !extrinsics.length || !accountId}
                  label={t<string>('Refund')}
                  onStart={toggleOpen}
                />
              )}
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Refund);
