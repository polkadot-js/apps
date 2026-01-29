// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Balance, BalanceOf, BlockNumber, ParaId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo, useState } from 'react';

import { Button, Input, InputAddress, InputBalance, MarkWarning, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { formatBalance, isHex } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  cap: Balance;
  className?: string;
  needsSignature: boolean;
  paraId: ParaId;
  raised: Balance;
}

// 0x, <enum byte>, hex data
const VALID_LENGTHS = [
  2 + 2 + (64 * 2),
  2 + 2 + (65 * 2)
];

function verifySignature (api: ApiPromise, signature: string | null): boolean {
  if (isHex(signature) && VALID_LENGTHS.includes(signature.length)) {
    try {
      api.createType('MultiSignature', signature);

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  return false;
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
    () => needsSignature && !verifySignature(api, signature),
    [api, needsSignature, signature]
  );

  const remaining = cap.sub(raised);
  const isAmountBelow = !amount || amount.lt(api.consts.crowdloan.minContribution as BalanceOf);
  const isAmountOver = !!(amount && amount.gt(remaining));
  const isAmountError = isAmountBelow || isAmountOver;
  const minContribution = api.consts.crowdloan.minContribution as BlockNumber;

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!hasAccounts}
        label={t('Contribute')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t('Contribute to fund')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('This account will contribute to the crowdloan.')}>
              <InputAddress
                label={t('contribute from')}
                onChange={setAccountId}
                type='account'
                value={accountId}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The amount to contribute from this account.')}>
              <InputBalance
                autoFocus
                defaultValue={api.consts.crowdloan.minContribution as BalanceOf}
                isError={isAmountError}
                isZeroable={false}
                label={t('contribution')}
                onChange={setAmount}
              />
              {isAmountBelow && (
                <MarkWarning content={t('The amount is less than the minimum allowed contribution of {{value}}', { replace: { value: formatBalance(minContribution) } })} />
              )}
              {isAmountOver && (
                <MarkWarning content={t('The amount is more than the remaining contribution needed {{value}}', { replace: { value: formatBalance(remaining) } })} />
              )}
            </Modal.Columns>
            {needsSignature && (
              <Modal.Columns hint={t('The verifier signature that is to be associated with this contribution.')}>
                <Input
                  isError={isSignatureError}
                  label={t('verifier signature')}
                  onChange={setSignature}
                  placeholder={t('0x...')}
                />
                {isSignatureError && (
                  <MarkWarning content={t('The hex-encoded verifier signature should be provided to you by the team running the crowdloan (based on the information you provide).')} />
                )}
              </Modal.Columns>
            )}
            <Modal.Columns hint={t('The above contribution should more than minimum contribution amount and less than the remaining value.')}>
              <InputBalance
                defaultValue={api.consts.crowdloan.minContribution as BalanceOf}
                isDisabled
                label={t('minimum allowed')}
              />
              <InputBalance
                defaultValue={remaining}
                isDisabled
                label={t('remaining till cap')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={isAmountError || isSignatureError}
              label={t('Contribute')}
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
