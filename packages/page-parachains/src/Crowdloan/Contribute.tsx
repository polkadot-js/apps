// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Balance, BalanceOf, BlockNumber, ParaId } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';

import { Button, Input, InputAddress, InputBalance, MarkWarning, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { formatBalance, isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  cap: Balance;
  className?: string;
  needsSignature: boolean;
  paraId: ParaId;
  raised: Balance;
}

function Contribute ({ cap, className, needsSignature, paraId, raised }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();
  const [signature, setSignature] = useState<string | null>(null);

  const isSignatureError = useMemo(
    () => needsSignature
      ? !isHex(signature)
      : false,
    [needsSignature, signature]
  );

  const remaining = cap.sub(raised);
  const isAmountBelow = !amount || amount.lt(api.consts.crowdloan.minContribution as BalanceOf);
  const isAmountOver = !!(amount && amount.gt(remaining));
  const isAmountError = isAmountBelow || isAmountOver;

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!hasAccounts}
        label={t<string>('Contribute')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Contribute to fund')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('This account will contribute to the crowdloan.')}>
              <InputAddress
                label={t<string>('contribute from')}
                onChange={setAccountId}
                type='account'
                value={accountId}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The amount to contribute from this account.')}>
              <InputBalance
                autoFocus
                defaultValue={api.consts.crowdloan.minContribution as BalanceOf}
                isError={isAmountError}
                isZeroable={false}
                label={t<string>('contribution')}
                onChange={setAmount}
              />
              {isAmountBelow && (
                <MarkWarning content={t<string>('The amount is less than the minimum allowed contribution of {{value}}', { replace: { value: formatBalance(api.consts.crowdloan.minContribution as BlockNumber) } })} />
              )}
              {isAmountOver && (
                <MarkWarning content={t<string>('The amount is more than the remaining contribution needed {{value}}', { replace: { value: formatBalance(remaining) } })} />
              )}
            </Modal.Columns>
            {needsSignature && (
              <Modal.Columns hint={t<string>('The verifier signature that is to be associated with this contribution.')}>
                <Input
                  isError={isSignatureError}
                  label={t<string>('verifier signature')}
                  onChange={setSignature}
                />
              </Modal.Columns>
            )}
            <Modal.Columns hint={t<string>('The above contribution should more than minimum contribution amount and less than the remaining value.')}>
              <InputBalance
                defaultValue={api.consts.crowdloan.minContribution as BalanceOf}
                isDisabled
                label={t<string>('minimum allowed')}
              />
              <InputBalance
                defaultValue={remaining}
                isDisabled
                label={t<string>('remaining till cap')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={isAmountError || isSignatureError}
              label={t<string>('Contribute')}
              onStart={toggleOpen}
              params={[paraId, amount, signature]}
              tx={api.tx.crowdloan.contribute}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Contribute);
