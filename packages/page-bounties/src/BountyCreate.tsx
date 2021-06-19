// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React, { useCallback, useEffect, useState } from 'react';

import { useBalance, useBounties } from '@polkadot/app-bounties/hooks';
import { Button, Input, InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { calculateBountyBond, countUtf8Bytes } from './helpers';
import { useTranslation } from './translate';

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
        label={t<string>('Add Bounty')}
        onClick={toggleIsOpen}
      />
      {isOpen && (
        <Modal
          className='ui--AddBountyModal'
          header={t<string>('Add Bounty')}
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('Description of the Bounty (to be stored on-chain)')}>
              <Input
                autoFocus
                defaultValue={TITLE_DEFAULT_VALUE}
                help={t<string>('The description of this bounty')}
                isError={!isTitleValid}
                label={t<string>('bounty title')}
                onChange={onTitleChange}
                value={title}
              />
              {!isTitleValid && (title !== TITLE_DEFAULT_VALUE) && (
                <MarkError content={t<string>('Title too long')} />
              )}
            </Modal.Columns>
            <Modal.Columns hint={t<string>('How much should be paid out for completed Bounty. Upon funding, the amount will be reserved in treasury.')}>
              <InputBalance
                help={t<string>("The total payment amount of this bounty, curator's fee included.")}
                isError={!isValueValid}
                isZeroable
                label={t<string>('bounty requested allocation')}
                onChange={setValue}
                value={value}
              />
              {!isValueValid && !value?.eq(BOUNTY_DEFAULT_VALUE) && (
                <MarkError content={t<string>('Allocation value is smaller than the minimum bounty value.')} />
              )}
            </Modal.Columns>
            <Modal.Columns hint={t<string>('Proposer bond depends on bounty title length.')}>
              <InputBalance
                defaultValue={bond.toString()}
                help={t<string>('This amount will be reserved from origin account and returned on approval or slashed upon rejection.')}
                isDisabled
                label={t<string>('bounty bond')}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('This account will propose the bounty. Bond amount will be reserved on its balance.')}>
              <InputAddress
                help={t<string>('Select the account you wish to propose the bounty from.')}
                isError={!hasFunds}
                label={t<string>('submit with account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
              {!hasFunds && (
                <MarkError content={t<string>('Account does not have enough funds.')} />
              )}
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleIsOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || !isValid}
              label={t<string>('Add Bounty')}
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
