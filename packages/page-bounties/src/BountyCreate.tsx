// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BalanceOf } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { Button, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { calculateBountyBond } from './helpers/calculateBountyBond';
import { useTranslation } from './translate';

const MIN_TITLE_LEN = 1;
const TITLE_DEFAULT_VALUE = '';
const AMOUNT_DEFAULT_VALUE = BN_ZERO;

function BountyCreate () {
  const { t } = useTranslation();
  const { api } = useApi();

  const [accountId, setAccountId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [bond, setBond] = useState(((api.consts.bounties || api.consts.treasury).bountyDepositBase as BalanceOf).toBn());
  const [amount, setAmount] = useState<BN | undefined>(AMOUNT_DEFAULT_VALUE);
  const [isOpen, toggleIsOpen] = useToggle();

  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [accountId]);
  const bountyMinValue = new BN((api.consts.bounties || api.consts.treasury).bountyValueMinimum.toString());
  const bountyTitleMaxLength = +(api.consts.bounties || api.consts.treasury).maximumReasonLength.toString();

  const hasTitle = title?.length >= MIN_TITLE_LEN && title?.length <= bountyTitleMaxLength;
  const isMinValue = amount?.gte(bountyMinValue);
  const hasFunds = balances?.availableBalance.gte(bond);

  const isValid = hasFunds && hasTitle && isMinValue;

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
                  isError={!hasTitle}
                  label={t<string>('bounty title')}
                  onChange={onTitleChange}
                  value={title}
                />
                {!hasTitle && (title !== TITLE_DEFAULT_VALUE) && (
                  <article className='error'>
                    {t<string>('Inappropriate title length.')}
                  </article>
                )}
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  help={t<string>('The total payment amount of this bounty, curators fee included.')}
                  isError={!isMinValue}
                  isZeroable
                  label={t<string>('bounty requested allocation')}
                  onChange={setAmount}
                  value={amount}
                />
                {!isMinValue && !amount?.eq(AMOUNT_DEFAULT_VALUE) && (
                  <article className='error'>
                    {t<string>('Allocation value is smaller than the minimum bounty value.')}
                  </article>
                )}
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
                <p>{t<string>('Bond is estimated based on bountyDepositBase and dataDepositPerByte constants.')}</p>
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
                <p>{t<string>('Use this account to propose bounty from. This can be a normal or council account.')}</p>
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
              params={[amount, title]}
              tx={
                api.tx.bounties
                  ? 'bounties.proposeBounty'
                  : 'treasury.proposeBounty'
              }
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(BountyCreate);
