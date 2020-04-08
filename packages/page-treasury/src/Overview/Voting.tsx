// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { ProposalIndex, Hash } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Modal, VoteAccount, VoteActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  councilProposals: DeriveCollectiveProposal[];
  isDisabled?: boolean;
}

interface Option {
  text: React.ReactNode;
  value: number;
}

function Voting ({ councilProposals, isDisabled }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [councilOpts, setCouncilOpts] = useState<Option[]>([]);
  const [councilOptId, setCouncilOptId] = useState<number>(0);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [{ councilHash, councilId }, setCouncilInfo] = useState<{ councilHash: Hash | null; councilId: ProposalIndex | null }>({ councilHash: null, councilId: null });
  const [isOpen, toggleOpen] = useToggle();
  const [voteValue, setVoteValue] = useState(true);

  useEffect((): void => {
    isOpen && setVoteValue(true);
  }, [isOpen]);

  useEffect((): void => {
    const available = councilProposals
      .map(({ proposal: { methodName, sectionName }, votes }): Option => ({
        text: `Council #${votes?.index.toNumber()}: ${sectionName}.${methodName} `,
        value: votes ? votes?.index.toNumber() : -1
      }))
      .filter(({ value }): boolean => value !== -1);

    setCouncilOptId(available.length ? available[0].value : 0);
    setCouncilOpts(available);
  }, [councilProposals]);

  const _onChangeVote = useCallback(
    (vote?: boolean) => setVoteValue(isBoolean(vote) ? vote : true),
    []
  );

  const _onChangeProposal = useCallback(
    (optionId: number): void => {
      const councilProp = councilProposals.find(({ votes }): boolean => !!(votes?.index.eq(optionId)));

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
          header={t('Vote on proposal')}
          size='small'
        >
          <Modal.Content>
            <VoteAccount onChange={setAccountId} />
            <Dropdown
              help={t('The council proposal to make the vote on')}
              label={t('council proposal')}
              onChange={_onChangeProposal}
              options={councilOpts}
              value={councilOptId}
            />
            <Input
              help={t('The hash for the proposal this vote applies to')}
              isDisabled
              label={t('proposal hash')}
              value={councilHash}
            />
            <VoteToggle
              onChange={_onChangeVote}
              value={voteValue}
            />
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
        label={t('Vote')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Voting);
