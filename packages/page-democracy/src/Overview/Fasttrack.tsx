// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Hash, VoteThreshold } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useMembers, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  imageHash: Hash;
  threshold: VoteThreshold;
}

const ONE_MIN = (1 * 60) / 6;
const DEF_DELAY = new BN(ONE_MIN);
const DEF_VOTING = new BN(ONE_MIN * 60 * 3);

function Fasttrack ({ imageHash, threshold }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useMembers('technicalCommittee');
  const [isFasttrackOpen, toggleFasttrack] = useToggle();
  const [allowFast, setAllowFast] = useState(false);
  const [accountId, setAcountId] = useState<string | null>(null);
  const [delayBlocks, setDelayBlocks] = useState<BN | undefined>(DEF_DELAY);
  const [votingBlocks, setVotingBlocks] = useState<BN | undefined>(DEF_VOTING);
  const [proposal, setProposal] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const memberThreshold = useMemo(
    () => Math.ceil(members.length * 0.5),
    [members]
  );

  useEffect((): void => {
    setAllowFast(isMember && threshold.isSimplemajority);
  }, [isMember, threshold]);

  useEffect((): void => {
    setProposal(
      () => delayBlocks?.gtn(0) && votingBlocks?.gtn(0)
        ? api.tx.democracy.fastTrack(imageHash, votingBlocks, delayBlocks)
        : null
    );
  }, [api, delayBlocks, imageHash, votingBlocks]);

  return (
    <>
      {isFasttrackOpen && (
        <Modal
          header={t('Fast track proposal')}
          size='small'
        >
          <Modal.Content>
            <InputAddress
              filter={members}
              help={t('Select the account you wish to make the proposal with.')}
              label={t('propose from account')}
              onChange={setAcountId}
              type='account'
              withLabel
            />
            <Input
              help={t('The external proposal to send to the technical committee')}
              isDisabled
              label={t('preimage hash')}
              value={imageHash}
            />
            <InputNumber
              autoFocus
              help={t('The voting period to apply in blocks')}
              label={t('voting period')}
              onChange={setVotingBlocks}
              value={votingBlocks}
            />
            <InputNumber
              help={t('The delay period to apply in blocks')}
              label={t('delay')}
              onChange={setDelayBlocks}
              value={delayBlocks}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleFasttrack}>
            <TxButton
              accountId={accountId}
              icon='fast forward'
              isDisabled={!accountId || !proposal || !memberThreshold}
              isPrimary
              label={t('Fast track')}
              onStart={toggleFasttrack}
              params={[memberThreshold, proposal]}
              tx='technicalCommittee.propose'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='fast forward'
        isDisabled={!allowFast}
        label={t('Fast track')}
        onClick={toggleFasttrack}
      />
    </>
  );
}

export default React.memo(Fasttrack);
