// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import { Button, InputAddress, InputBalance, Modal, Static, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

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
  const bondPercentage = useMemo(
    () => `${api.consts.treasury.proposalBond.muln(100).divn(1_000_000).toNumber().toFixed(2)}%`,
    [api]
  );

  return (
    <>
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Submit treasury proposal')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('Select the account you wish to submit the proposal from.')}
                  label={t<string>('submit with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('This account will make the proposal and be responsible for the bond.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('The account to which the proposed balance will be transferred if approved')}
                  label={t<string>('beneficiary')}
                  onChange={setBeneficiary}
                  type='allPlus'
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The beneficiary will receive the full amount if the proposal passes.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  help={t<string>('The amount that will be allocated from the treasury pot')}
                  isError={!hasValue}
                  label={t<string>('value')}
                  onChange={setValue}
                />
                <Static
                  help={t<string>('The on-chain percentage for the treasury')}
                  label={t<string>('proposal bond')}
                >
                  {bondPercentage}
                </Static>
                <InputBalance
                  defaultValue={api.consts.treasury.proposalBondMinimum.toString()}
                  help={t<string>('The minimum amount that will be bonded')}
                  isDisabled
                  label={t<string>('minimum bond')}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The value is the amount that is being asked for and that will be allocated to the beneficiary if the proposal is approved.')}</p>
                <p>{t<string>('Of the beneficiary amount, at least {{bondPercentage}} would need to be put up as collateral. The maximum of this and the minimum bond will be used to secure the proposal, refundable if it passes.', { replace: { bondPercentage } })}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || !hasValue}
              label={t<string>('Submit proposal')}
              onStart={toggleOpen}
              params={[value, beneficiary]}
              tx='treasury.proposeSpend'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        label={t<string>('Submit proposal')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Propose);
