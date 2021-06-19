// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveProposalImage } from '@polkadot/api-derive/types';
import type { AccountId, Balance } from '@polkadot/types/interfaces';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, ProposedAction, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  deposit?: Balance;
  depositors: AccountId[];
  image?: DeriveProposalImage;
  proposalId: BN | number;
}

function Seconding ({ deposit, depositors, image, proposalId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isSecondingOpen, toggleSeconding] = useToggle();

  if (!hasAccounts) {
    return null;
  }

  return (
    <>
      {isSecondingOpen && (
        <Modal
          header={t<string>('Second proposal')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The proposal is in the queue for future referendums. One proposal from this list will move forward to voting.')}>
              <ProposedAction
                idNumber={proposalId}
                proposal={image?.proposal}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('Seconding a proposal that indicates your backing for the proposal. Proposals with greater interest moves up the queue for potential next referendums.')}>
              <InputAddress
                help={t<string>('Select the account you wish to second with. This will lock your funds until the proposal is either approved or rejected')}
                label={t<string>('second with account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The deposit will be locked for the lifetime of the proposal.')}>
              <InputBalance
                isDisabled
                label={t<string>('deposit required')}
                value={deposit || api.consts.democracy.minimumDeposit}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleSeconding}>
            <TxButton
              accountId={accountId}
              icon='sign-in-alt'
              isDisabled={!accountId}
              label={t<string>('Second')}
              onStart={toggleSeconding}
              params={
                api.tx.democracy.second.meta.args.length === 2
                  ? [proposalId, depositors.length]
                  : [proposalId]
              }
              tx={api.tx.democracy.second}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='toggle-off'
        label={t<string>('Second')}
        onClick={toggleSeconding}
      />
    </>
  );
}

export default React.memo(Seconding);
