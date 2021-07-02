// Copyright 2017-2021 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';

import React, { useEffect, useMemo, useState } from 'react';

import { Button, InputAddress, InputAddressMulti, InputBalance, Modal, TxButton, VoteValue } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';
import { useModuleElections } from '../useModuleElections';

interface Props {
  className?: string;
  electionsInfo?: DeriveElectionsInfo;
}

const MAX_VOTES = 16;

function Vote ({ electionsInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, toggleVisible] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [available, setAvailable] = useState<string[]>([]);
  const [defaultVotes, setDefaultVotes] = useState<string[]>([]);
  const [votes, setVotes] = useState<string[]>([]);
  const [voteValue, setVoteValue] = useState(BN_ZERO);
  const modLocation = useModuleElections();

  useEffect((): void => {
    if (electionsInfo) {
      const { candidates, members, runnersUp } = electionsInfo;

      setAvailable(
        members
          .map(([accountId]) => accountId.toString())
          .concat(runnersUp.map(([accountId]) => accountId.toString()))
          .concat(candidates.map((accountId) => accountId.toString()))
      );
    }
  }, [electionsInfo]);

  useEffect((): void => {
    accountId && api.derive.council.votesOf(accountId).then(({ votes }): void => {
      setDefaultVotes(
        votes
          .map((a) => a.toString())
          .filter((a) => available.includes(a))
      );
    });
  }, [api, accountId, available]);

  const bondValue = useMemo(
    (): BN | undefined => {
      const location = api.consts.elections || api.consts.phragmenElection || api.consts.electionsPhragmen;

      return location &&
        location.votingBondBase &&
        location.votingBondBase.add(location.votingBondFactor.muln(votes.length));
    },
    [api, votes]
  );

  if (!modLocation) {
    return null;
  }

  return (
    <>
      <Button
        icon='check'
        isDisabled={available.length === 0}
        label={t<string>('Vote')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          header={t<string>('Vote for current candidates')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The vote will be recorded for the selected account.')}>
              <InputAddress
                help={t<string>('This account will be use to approve each candidate.')}
                label={t<string>('voting account')}
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The value associated with this vote. The amount will be locked (not available for transfer) and used in all subsequent elections.')}>
              <VoteValue
                accountId={accountId}
                isCouncil
                onChange={setVoteValue}
              />
            </Modal.Columns>
            <Modal.Columns hint={
              <>
                <p>{t<string>('The votes for the members, runner-ups and candidates. These should be ordered based on your priority.')}</p>
                <p>{t<string>('In calculating the election outcome, this prioritized vote ordering will be used to determine the final score for the candidates.')}</p>
              </>
            }>
              <InputAddressMulti
                available={available}
                availableLabel={t<string>('council candidates')}
                defaultValue={defaultVotes}
                help={t<string>('Select and order council candidates you wish to vote for.')}
                maxCount={MAX_VOTES}
                onChange={setVotes}
                valueLabel={t<string>('my ordered votes')}
              />
            </Modal.Columns>
            {bondValue && (
              <Modal.Columns hint={t('The amount will be reserved for the duration of your vote')}>
                <InputBalance
                  defaultValue={bondValue}
                  help={t<string>('The amount that is reserved')}
                  isDisabled
                  label={t<string>('voting bond')}
                />
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              icon='trash-alt'
              isDisabled={!defaultVotes.length}
              label={t<string>('Unvote all')}
              onStart={toggleVisible}
              tx={api.tx[modLocation].removeVoter}
            />
            <TxButton
              accountId={accountId}
              isDisabled={!accountId || votes.length === 0 || voteValue.lten(0)}
              label={t<string>('Vote')}
              onStart={toggleVisible}
              params={[votes, voteValue]}
              tx={api.tx[modLocation].vote}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Vote);
