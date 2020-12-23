// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BalanceOf } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { Button, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { calculateBountyBond, countUtf8Bytes } from './helpers/calculateBountyBond';
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

  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [accountId]);
  const bountyMinValue = ((api.consts.bounties || api.consts.treasury).bountyValueMinimum as BalanceOf).toBn();
  const bountyTitleMaxLength = ((api.consts.bounties || api.consts.treasury).maximumReasonLength as BalanceOf).toNumber();

  const isTitleValid = title?.length >= MIN_TITLE_LEN && countUtf8Bytes(title) <= bountyTitleMaxLength;
  const isValueValid = value?.gte(bountyMinValue);
  const hasFunds = accountId ? balances?.availableBalance.gte(bond) : true;

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
              params={[value, title]}
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
