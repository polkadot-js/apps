// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u128 } from '@polkadot/types';
import type { Permill } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';

import { Button, InputAddress, InputBalance, MarkWarning, Modal, Static, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN, BN_HUNDRED, BN_MILLION } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
}

function Propose ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<string | null>(null);
  const [isOpen, toggleOpen] = useToggle();
  const [value, setValue] = useState<BN | undefined>();
  const hasValue = value?.gtn(0);

  const [bondMin, bondMax, bondPercentage] = useMemo(
    () => [
      api.consts.treasury.proposalBondMinimum
        ? (api.consts.treasury.proposalBondMinimum as u128).toString()
        : null,
      (api.consts.treasury.proposalBondMaximum as Option<u128>)?.isSome
        ? (api.consts.treasury.proposalBondMaximum as Option<u128>).unwrap().toString()
        : null,
      api.consts.treasury.proposalBond
        ? `${(api.consts.treasury.proposalBond as Permill).mul(BN_HUNDRED).div(BN_MILLION).toNumber().toFixed(2)}%`
        : `${new BN(0).toNumber().toFixed(2)}%`
    ],
    [api]
  );

  return (
    <>
      {isOpen && (
        <Modal
          className={className}
          header={t('Submit treasury proposal')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('This account will make the proposal and be responsible for the bond.')}>
              <InputAddress
                label={t('submit with account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The beneficiary will receive the full amount if the proposal passes.')}>
              <InputAddress
                label={t('beneficiary')}
                onChange={setBeneficiary}
                type='allPlus'
              />
            </Modal.Columns>
            <Modal.Columns
              hint={
                <>
                  <p>{t('The value is the amount that is being asked for and that will be allocated to the beneficiary if the proposal is approved.')}</p>
                  {bondMax
                    ? <p>{t('Of the beneficiary amount, no less than the minimum bond amount and no more than maximum on-chain bond would need to be put up as collateral. This is calculated from {{bondPercentage}} of the requested amount.', { replace: { bondPercentage } })}</p>
                    : <p>{t('Of the beneficiary amount, no less than the minimum bond amount would need to be put up as collateral. This is calculated from {{bondPercentage}} of the requested amount.', { replace: { bondPercentage } })}</p>
                  }
                </>
              }
            >
              <InputBalance
                isError={!hasValue}
                label={t('value')}
                onChange={setValue}
              />
              <Static
                label={t('proposal bond')}
              >
                {bondPercentage}
              </Static>
              {bondMin && (
                <InputBalance
                  defaultValue={bondMin}
                  isDisabled
                  label={t('minimum bond')}
                />
              )}
              {bondMax && (
                <InputBalance
                  defaultValue={bondMax}
                  isDisabled
                  label={t('maximum bond')}
                />
              )}
              <MarkWarning content={t('Be aware that once submitted the proposal will be put to a vote. If the proposal is rejected due to a lack of info, invalid requirements or non-benefit to the network as a whole, the full bond posted (as describe above) will be lost.')} />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || !hasValue}
              label={t('Submit proposal')}
              onStart={toggleOpen}
              params={[value, beneficiary]}
              tx={api.tx.treasury.spendLocal ?? api.tx.treasury.proposeSpend}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        label={t('Submit proposal')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Propose);
