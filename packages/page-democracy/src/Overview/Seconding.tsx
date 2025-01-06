// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveProposalImage } from '@polkadot/api-derive/types';
import type { AccountId, Balance } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { ProposedAction } from '@polkadot/react-params';

import { useTranslation } from '../translate.js';

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
          header={t('Endorse proposal')}
          onClose={toggleSeconding}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The proposal is in the queue for future referendums. One proposal from this list will move forward to voting.')}>
              <ProposedAction
                idNumber={proposalId}
                proposal={image?.proposal}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('Endorsing a proposal that indicates your backing for the proposal. Proposals with greater interest moves up the queue for potential next referendums.')}>
              <InputAddress
                label={t('endorse with account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The deposit will be locked for the lifetime of the proposal.')}>
              <InputBalance
                defaultValue={deposit || api.consts.democracy.minimumDeposit}
                isDisabled
                label={t('deposit required')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='sign-in-alt'
              isDisabled={!accountId}
              label={t('Endorse')}
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
        label={t('Endorse')}
        onClick={toggleSeconding}
      />
    </>
  );
}

export default React.memo(Seconding);
