// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { BlockNumber, Hash, ProposalIndex } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Modal, VoteAccount, VoteActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';

interface CouncilInfo {
  councilHash: Hash | null;
  councilId: ProposalIndex | null;
}

interface Props {
  councilProposals: DeriveCollectiveProposal[];
  isDisabled?: boolean;
  members: string[];
}

interface Option {
  text: React.ReactNode;
  value: number;
}

function Voting ({ councilProposals, isDisabled, members }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const [councilOpts, setCouncilOpts] = useState<Option[]>([]);
  const [councilOptId, setCouncilOptId] = useState<number>(0);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [{ councilHash, councilId }, setCouncilInfo] = useState<CouncilInfo>({ councilHash: null, councilId: null });
  const [isOpen, toggleOpen] = useToggle();
  const [voteValue, setVoteValue] = useState(true);

  useEffect((): void => {
    isOpen && setVoteValue(true);
  }, [isOpen]);

  useEffect((): void => {
    const available = councilProposals
      .filter(({ votes }) => bestNumber && votes && (!votes.end || votes.end.gt(bestNumber)))
      .map(({ proposal: { methodName, sectionName }, votes }): Option => ({
        text: `Council #${votes?.index.toNumber() || '-'}: ${sectionName}.${methodName} `,
        value: votes ? votes?.index.toNumber() : -1
      }))
      .filter(({ value }) => value !== -1);

    setCouncilOptId(available.length ? available[0].value : 0);
    setCouncilOpts(available);
  }, [bestNumber, councilProposals]);

  const _onChangeVote = useCallback(
    (vote?: boolean) => setVoteValue(isBoolean(vote) ? vote : true),
    []
  );

  const _onChangeProposal = useCallback(
    (optionId: number): void => {
      const councilProp = councilProposals.find(({ votes }) => votes?.index.eq(optionId));

      if (councilProp && councilProp.votes) {
        setCouncilInfo({ councilHash: councilProp.hash, councilId: councilProp.votes.index });
        setCouncilOptId(councilOptId);
      } else {
        setCouncilInfo({ councilHash: null, councilId: null });
      }
    },
    [councilOptId, councilProposals]
  );

  if (!hasAccounts || !councilOpts.length) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          header={t<string>('Vote on proposal')}
          size='small'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <VoteAccount
                  filter={members}
                  onChange={setAccountId}
                />
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <Dropdown
                  help={t<string>('The council proposal to make the vote on')}
                  label={t<string>('council proposal')}
                  onChange={_onChangeProposal}
                  options={councilOpts}
                  value={councilOptId}
                />
                <Input
                  help={t<string>('The hash for the proposal this vote applies to')}
                  isDisabled
                  label={t<string>('proposal hash')}
                  value={councilHash?.toString()}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Multiple council proposals could exist, both approval and rejection. Apply your vote to the correct council proposal (also available on council motions page)')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <VoteToggle
                  onChange={_onChangeVote}
                  value={voteValue}
                />
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <VoteActions
            accountId={accountId}
            aye={voteValue}
            isDisabled={!councilHash}
            onClick={toggleOpen}
            params={[councilHash, councilId, voteValue]}
            tx='council.vote'
          />
        </Modal>
      )}
      <Button
        icon='check'
        isDisabled={isDisabled}
        label={t<string>('Vote')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Voting);
