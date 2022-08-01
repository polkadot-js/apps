// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage } from '@polkadot/app-preimages/types';
import type { BN } from '@polkadot/util';
import type { PalletVote } from '../types';

import React, { useState } from 'react';

import { Button, ConvictionDropdown, Modal, ProposedAction, TxButton, VoteAccount, VoteValue } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  id: BN;
  isConvictionVote: boolean;
  isMember: boolean;
  members?: string[];
  palletVote: PalletVote;
  preimage: Preimage;
}

function Voting ({ id, isConvictionVote, isMember, members, palletVote, preimage: { proposal } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [conviction, setConviction] = useState(0);
  const [isVotingOpen, toggleVoting] = useToggle();

  if (!hasAccounts) {
    return null;
  }

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t<string>('Vote on proposal')}
          onClose={toggleVoting}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('If this proposal is passed, the changes will be applied via dispatch and the deposit returned.')}>
              <ProposedAction
                idNumber={id}
                proposal={proposal}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The vote will be recorded for this account. If another account delegated to this one, the delegated votes will also be counted.')}>
              <VoteAccount
                filter={members}
                onChange={setAccountId}
              />
            </Modal.Columns>
            {isConvictionVote && (
              <Modal.Columns
                hint={
                  <>
                    <p>{t<string>('The balance associated with the vote will be locked as per the conviction specified and will not be available for transfer during this period.')}</p>
                    <p>{t<string>('Conviction locks do overlap and are not additive, meaning that funds locked during a previous vote can be locked again.')}</p>
                  </>
                }
              >
                <VoteValue
                  accountId={accountId}
                  autoFocus
                  onChange={setBalance}
                />
                <ConvictionDropdown
                  help={t<string>('The conviction to use for this vote, with an appropriate lock period.')}
                  label={t<string>('conviction')}
                  onChange={setConviction}
                  value={conviction}
                />
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='ban'
              isDisabled={!isMember}
              label={t<string>('Vote Nay')}
              onStart={toggleVoting}
              params={
                isConvictionVote
                  ? [id, { Standard: { balance, vote: { aye: false, conviction } } }]
                  : [id, false]
              }
              tx={api.tx[palletVote].vote}
            />
            <TxButton
              accountId={accountId}
              icon='check'
              isDisabled={!isMember}
              label={t<string>('Vote Aye')}
              onStart={toggleVoting}
              params={
                isConvictionVote
                  ? [id, { Standard: { balance, vote: { aye: true, conviction } } }]
                  : [id, true]
              }
              tx={api.tx[palletVote].vote}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check-to-slot'
        label={t<string>('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
