// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  isMember: boolean;
  ownMembers: string[];
}

function DefenderVoting ({ isMember, ownMembers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, toggleVisible] = useToggle();
  const [vote, setVote] = useState(true);
  const [accountId, setAccountId] = useState<string | null>(null);

  const voteOptsRef = useRef([
    { text: t<string>('Aye, I approve'), value: true },
    { text: t<string>('Nay, I do not approve'), value: false }
  ]);

  return (
    <>
      {isVisible && (
        <Modal header={t<string>('Vote for defender')}>
          <Modal.Content>
            <InputAddress
              filter={ownMembers}
              help={t<string>('The address to vote from (must be a member)')}
              label={t<string>('vote from account')}
              onChange={setAccountId}
            />
            <Dropdown
              help={t<string>('Approve or reject this defender.')}
              label={t<string>('vote for defender')}
              onChange={setVote}
              options={voteOptsRef.current}
              value={vote}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              icon='check'
              label={t<string>('Vote')}
              onStart={toggleVisible}
              params={[vote]}
              tx={api.tx.society.defenderVote}
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

export default React.memo(DefenderVoting);
