// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useCallback, useEffect, useState } from 'react';

import { Button, Input, InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { calculateBountyBond, countUtf8Bytes } from './helpers/index.js';
import { useBalance, useBounties } from './hooks/index.js';
import { useTranslation } from './translate.js';

const MIN_TITLE_LEN = 1;
const TITLE_DEFAULT_VALUE = '';
const BOUNTY_DEFAULT_VALUE = BN_ZERO;

function BountyCreate () {
  const { t } = useTranslation();
  const { bountyDepositBase, bountyValueMinimum, dataDepositPerByte, maximumReasonLength, proposeBounty } = useBounties();
  const [accountId, setAccountId] = useState<string | null>(null);
  const balance = useBalance(accountId);

  const [title, setTitle] = useState('');
  const [bond, setBond] = useState(bountyDepositBase);
  const [value, setValue] = useState<BN | undefined>(BOUNTY_DEFAULT_VALUE);
  const [isOpen, toggleIsOpen] = useToggle();
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isValueValid, setIsValueValid] = useState(false);
  const [hasFunds, setHasFunds] = useState(false);

  useEffect(() => {
    setIsTitleValid(title?.length >= MIN_TITLE_LEN && countUtf8Bytes(title) <= maximumReasonLength);
  }, [maximumReasonLength, title]);

  useEffect(() => {
    setIsValueValid(!!value?.gte(bountyValueMinimum));
  }, [bountyValueMinimum, value]);

  useEffect(() => {
    setHasFunds(!!balance?.gte(bond));
  }, [balance, bond]);

  const isValid = hasFunds && isTitleValid && isValueValid;

  const onTitleChange = useCallback((value: string) => {
    setTitle(value);
    setBond(calculateBountyBond(value, bountyDepositBase, dataDepositPerByte));
  }, [bountyDepositBase, dataDepositPerByte]);

  return (
    <>
      <Button
        icon='plus'
        isDisabled={false}
        label={t('Add Bounty')}
        onClick={toggleIsOpen}
      />
      {isOpen && (
        <Modal
          className='ui--AddBountyModal'
          header={t('Add Bounty')}
          onClose={toggleIsOpen}
        >
          <Modal.Content>
            <Modal.Columns hint={t('Description of the Bounty (to be stored on-chain)')}>
              <Input
                autoFocus
                defaultValue={TITLE_DEFAULT_VALUE}
                isError={!isTitleValid}
                label={t('bounty title')}
                onChange={onTitleChange}
                value={title}
              />
              {!isTitleValid && (title !== TITLE_DEFAULT_VALUE) && (
                <MarkError content={t('Title too long')} />
              )}
            </Modal.Columns>
            <Modal.Columns hint={t('How much should be paid out for completed Bounty. Upon funding, the amount will be reserved in treasury.')}>
              <InputBalance
                isError={!isValueValid}
                isZeroable
                label={t('bounty requested allocation')}
                onChange={setValue}
                value={value}
              />
              {!isValueValid && !value?.eq(BOUNTY_DEFAULT_VALUE) && (
                <MarkError content={t('Allocation value is smaller than the minimum bounty value.')} />
              )}
            </Modal.Columns>
            <Modal.Columns hint={t('Proposer bond depends on bounty title length.')}>
              <InputBalance
                defaultValue={bond.toString()}
                isDisabled
                label={t('bounty bond')}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('This account will propose the bounty. Bond amount will be reserved on its balance.')}>
              <InputAddress
                isError={!hasFunds}
                label={t('submit with account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
              {!hasFunds && (
                <MarkError content={t('Account does not have enough funds.')} />
              )}
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || !isValid}
              label={t('Add Bounty')}
              onStart={toggleIsOpen}
              params={[value, title]}
              tx={proposeBounty}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(BountyCreate);
