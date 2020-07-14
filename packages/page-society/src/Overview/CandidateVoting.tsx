// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useMemo, useState } from 'react';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';

interface Props {
  candidateId: string;
  isMember: boolean;
  ownMembers: string[];
}

function CandidateVoting ({ candidateId, isMember, ownMembers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isVisible, toggleVisible] = useToggle();
  const [vote, setVote] = useState(true);
  const [accountId, setAccountId] = useState<string | null>(null);
  const voteOpts = useMemo(() => [
    { text: t<string>('Aye, I approve'), value: true },
    { text: t<string>('Nay, I do not approve'), value: false }
  ], [t]);

  return (
    <>
      {isVisible && (
        <Modal header={t<string>('Vote for candidate')}>
          <Modal.Content>
            <InputAddress
              filter={ownMembers}
              help={t<string>('The address to vote from (must be a member)')}
              label={t<string>('vote from account')}
              onChange={setAccountId}
            />
            <Dropdown
              help={t<string>('Approve this candidacy.')}
              label={t<string>('vote for candidate')}
              onChange={setVote}
              options={voteOpts}
              value={vote}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              icon='check'
              label={t<string>('Vote')}
              onStart={toggleVisible}
              params={[candidateId, vote]}
              tx='society.vote'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check'
        isDisabled={!isMember}
        label={t<string>('Vote')}
        onClick={toggleVisible}
      />
    </>
  );
}

export default React.memo(CandidateVoting);
