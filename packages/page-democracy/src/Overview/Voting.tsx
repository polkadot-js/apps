// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PropIndex, Proposal } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ConvictionDropdown, Modal, ProposedAction, VoteAccount, VoteActions, VoteToggle, VoteValue } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  proposal?: Proposal;
  referendumId: PropIndex;
}

function Voting ({ proposal, referendumId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [conviction, setConviction] = useState(0);
  const [isVotingOpen, toggleVoting] = useToggle();
  const [aye, setVoteValue] = useState(true);

  useEffect((): void => {
    isVotingOpen && setVoteValue(true);
  }, [isVotingOpen]);

  const isCurrentVote = useMemo(
    () => !!api.query.democracy.votingOf,
    [api]
  );

  const _onChangeVote = useCallback(
    (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true),
    []
  );

  if (!hasAccounts) {
    return null;
  }

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t<string>('Vote on proposal')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <ProposedAction
                  idNumber={referendumId}
                  proposal={proposal}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('If this proposal is passed, the changes will be applied via dispatch and the deposit returned.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <VoteAccount onChange={setAccountId} />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The vote will be recorded for this account. If another account delegated to this one, the delegated votes will also be counted.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                {isCurrentVote && (
                  <VoteValue
                    accountId={accountId}
                    autoFocus
                    onChange={setBalance}
                  />
                )}
                <ConvictionDropdown
                  help={t<string>('The conviction to use for this vote, with an appropriate lock period.')}
                  label={t<string>('conviction')}
                  onChange={setConviction}
                  value={conviction}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The balance associated with the vote will be locked as per the conviction specified and will not be available for transfer during this period.')}</p>
                <p>{t<string>('Conviction locks do overlap and is additive, meaning that funds locked during a previous vote can be locked again.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <VoteToggle
                  onChange={_onChangeVote}
                  value={aye}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Register the vote for or against the proposal.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <VoteActions
            accountId={accountId}
            aye={aye}
            isDisabled={isCurrentVote ? !balance : false}
            onClick={toggleVoting}
            params={
              isCurrentVote
                ? [referendumId, { Standard: { balance, vote: { aye, conviction } } }]
                : [referendumId, { aye, conviction }]}
            tx='democracy.vote'
          />
        </Modal>
      )}
      <Button
        icon='check'
        label={t<string>('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
