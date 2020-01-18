// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposal } from '@polkadot/api-derive/types';
import { TxSource } from '@polkadot/react-hooks/types';
import { ProposalIndex, Hash } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Input, Modal, TxAccount, TxActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts, useApi, useTxModal } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  councilProposals: DerivedCollectiveProposal[];
  isDisabled?: boolean;
}

interface Option {
  text: React.ReactNode;
  value: number;
}

export default function Voting ({ councilProposals, isDisabled }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [councilOpts, setCouncilOpts] = useState<Option[]>([]);
  const [councilOptId, setCouncilOptId] = useState<number>(0);
  const [{ councilId, councilHash }, setCouncilInfo] = useState<{ councilId: ProposalIndex | null; councilHash: Hash | null }>({ councilId: null, councilHash: null });
  const [voteValue, setVoteValue] = useState(true);

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

  const { isOpen, isSubmittable, onChangeAccountId, onClose, onOpen, sendTx } = useTxModal(
    (): TxSource => {
      let tx;
      try {
        tx = api.tx.council.vote(councilHash, councilId, voteValue);
      } catch (e) {
        tx = null;
      }

      return {
        tx,
        isSubmittable: !!tx && !!councilHash
      };
    },
    [councilHash, councilId, voteValue]
  );

  if (!hasAccounts || !councilOpts.length) {
    return null;
  }

  const _onChangeVote = (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true);
  const _onChangeProposal = (optionId: number): void => {
    const councilProp = councilProposals.find(({ votes }): boolean => !!(votes?.index.eq(optionId)));

    if (councilProp && councilProp.votes) {
      setCouncilInfo({ councilId: councilProp.votes.index, councilHash: councilProp.hash });
      setCouncilOptId(councilOptId);
    } else {
      setCouncilInfo({ councilId: null, councilHash: null });
    }
  };

  return (
    <>
      <Button
        icon='check'
        isDisabled={isDisabled}
        isPrimary
        label={t('Vote')}
        onClick={onOpen}
      />
      <Modal
        header={t('Vote on proposal')}
        open={isOpen}
        size='small'
      >
        <Modal.Content>
          <TxAccount onChange={onChangeAccountId} />
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
        <TxActions
          isSubmittable={isSubmittable}
          onCancel={onClose}
          onSend={sendTx}
          submitButtonLabel={t('Vote')}
        />
      </Modal>
    </>
  );
}
