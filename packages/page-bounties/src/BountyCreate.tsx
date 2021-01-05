// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BalanceOf } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { Button, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { calculateBountyBond, countUtf8Bytes } from './helpers';
import { useTranslation } from './translate';

const MIN_TITLE_LEN = 1;
const TITLE_DEFAULT_VALUE = '';
const BOUNTY_DEFAULT_VALUE = BN_ZERO;

function BountyCreate () {
  const { t } = useTranslation();
  const { api } = useApi();

  const [accountId, setAccountId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [bond, setBond] = useState(((api.consts.bounties || api.consts.treasury).bountyDepositBase as BalanceOf).toBn());
  const [value, setValue] = useState<BN | undefined>(BOUNTY_DEFAULT_VALUE);
  const [isOpen, toggleIsOpen] = useToggle();
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isValueValid, setIsValueValid] = useState(false);
  const [hasFunds, setHasFunds] = useState(false);

  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [accountId]);

  useEffect(() => {
    const bountyTitleMaxLength = ((api.consts.bounties || api.consts.treasury).maximumReasonLength as BalanceOf).toNumber();

    setIsTitleValid(title?.length >= MIN_TITLE_LEN && countUtf8Bytes(title) <= bountyTitleMaxLength);
  }, [api, title]);

  useEffect(() => {
    const bountyMinValue = ((api.consts.bounties || api.consts.treasury).bountyValueMinimum as BalanceOf).toBn();

    setIsValueValid(!!value?.gte(bountyMinValue));
  }, [api, value]);

  useEffect(() => {
    setHasFunds(!!balances?.availableBalance.gte(bond));
  }, [balances, bond]);

  const isValid = hasFunds && isTitleValid && isValueValid;

  const onTitleChange = useCallback((value: string) => {
    const bountyBase = api.consts.bounties || api.consts.treasury;
    const bountyDepositBase = bountyBase.bountyDepositBase;
    const bountyDepositPerByte = bountyBase.dataDepositPerByte;

    setTitle(value);
    setBond(calculateBountyBond(value, bountyDepositBase as BalanceOf, bountyDepositPerByte as BalanceOf));
  }, [api]);

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
            <Modal.Columns>
              <Modal.Column>
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
                  <article className='error'>
                    {t<string>('Title too long')}
                  </article>
                )}
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Description of the Bounty (to be stored on-chain)')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  help={t<string>('The total payment amount of this bounty, curators fee included.')}
                  isError={!isValueValid}
                  isZeroable
                  label={t<string>('bounty requested allocation')}
                  onChange={setValue}
                  value={value}
                />
                {!isValueValid && !value?.eq(BOUNTY_DEFAULT_VALUE) && (
                  <article className='error'>
                    {t<string>('Allocation value is smaller than the minimum bounty value.')}
                  </article>
                )}
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('How much should be paid out for completed Bounty. Upon funding, the amount will be reserved in treasury.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  defaultValue={bond.toString()}
                  help={t<string>('This amount will be reserved from origin account and returned on approval or slashed upon rejection.')}
                  isDisabled
                  label={t<string>('bounty bond')}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Proposer bond depends on bounty title length.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('Select the account you wish to propose the bounty from.')}
                  isError={!hasFunds}
                  label={t<string>('submit with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
                {!hasFunds && (
                  <article className='error'>
                    {t<string>('Account does not have enough funds.')}
                  </article>
                )}
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('This account will propose the bounty. Bond amount will be reserved on its balance.')}</p>
              </Modal.Column>
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
              tx={(api.tx.bounties || api.tx.treasury).proposeBounty}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(BountyCreate);
