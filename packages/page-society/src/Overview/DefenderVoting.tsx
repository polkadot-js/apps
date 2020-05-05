// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useMemo, useState } from 'react';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';

interface Props {
  isMember: boolean;
  ownMembers: string[];
}

function DefenderVoting ({ isMember, ownMembers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isVisible, toggleVisible] = useToggle();
  const [vote, setVote] = useState(true);
  const [accountId, setAccountId] = useState<string | null>(null);
  const voteOpts = useMemo(() => [
    { text: t('Aye, I approve'), value: true },
    { text: t('Nay, I do not approve'), value: false }
  ], [t]);

  return (
    <>
      {isVisible && (
        <Modal header={t('Vote for defender')}>
          <Modal.Content>
            <InputAddress
              filter={ownMembers}
              help={t('The address to vote from (must be a member)')}
              label={t('vote from account')}
              onChange={setAccountId}
            />
            <Dropdown
              help={t('Approve or reject this defender.')}
              label={t('vote for defender')}
              onChange={setVote}
              options={voteOpts}
              value={vote}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              icon='check'
              label={t('Vote')}
              onStart={toggleVisible}
              params={[vote]}
              tx='society.defenderVote'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check'
        isDisabled={!isMember}
        label={t('Vote')}
        onClick={toggleVisible}
      />
    </>
  );
}

export default React.memo(DefenderVoting);
