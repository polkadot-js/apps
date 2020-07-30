// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposalImage } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, InputAddress, Modal, ProposedAction, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  depositors: AccountId[];
  image?: DeriveProposalImage;
  proposalId: BN | number;
}

function Seconding ({ depositors, image, proposalId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isSecondingOpen, toggleSeconding] = useToggle();

  if (!hasAccounts) {
    return null;
  }

  const isDepositor = depositors.some((depositor) => depositor.eq(accountId));

  return (
    <>
      {isSecondingOpen && (
        <Modal
          header={t<string>('Second proposal')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <ProposedAction
                  idNumber={proposalId}
                  proposal={image?.proposal}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The proposal is in the queue for future referendums. One proposal from this list will move forward to voting.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('Select the account you wish to second with. This will lock your funds until the proposal is either approved or rejected')}
                  label={t<string>('second with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Seconding a proposal that indicates your backing for the proposal. Proposals with greater interest moves up the queue for potential next referendums.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleSeconding}>
            <TxButton
              accountId={accountId}
              icon='sign-in-alt'
              isDisabled={!accountId || isDepositor}
              label={t<string>('Second')}
              onStart={toggleSeconding}
              params={
                api.tx.democracy.second.meta.args.length === 2
                  ? [proposalId, depositors.length]
                  : [proposalId]
              }
              tx='democracy.second'
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
