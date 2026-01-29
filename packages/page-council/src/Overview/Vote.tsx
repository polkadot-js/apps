// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useEffect, useMemo, useState } from 'react';

import { Button, InputAddress, InputAddressMulti, InputBalance, Modal, TxButton, VoteValue } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { useModuleElections } from '../useModuleElections.js';

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
    accountId && api.derive.council
      .votesOf(accountId)
      .then(({ votes }): void => {
        setDefaultVotes(
          votes
            .map((a) => a.toString())
            .filter((a) => available.includes(a))
        );
      })
      .catch(console.error);
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
        icon='check-to-slot'
        isDisabled={available.length === 0}
        label={t('Vote')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          header={t('Vote for current candidates')}
          onClose={toggleVisible}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The vote will be recorded for the selected account.')}>
              <InputAddress
                label={t('voting account')}
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The value associated with this vote. The amount will be locked (not available for transfer) and used in all subsequent elections.')}>
              <VoteValue
                accountId={accountId}
                onChange={setVoteValue}
              />
            </Modal.Columns>
            <Modal.Columns
              hint={
                <>
                  <p>{t('The votes for the members, runner-ups and candidates. These should be ordered based on your priority.')}</p>
                  <p>{t('In calculating the election outcome, this prioritized vote ordering will be used to determine the final score for the candidates.')}</p>
                </>
              }
            >
              <InputAddressMulti
                available={available}
                availableLabel={t('council candidates')}
                defaultValue={defaultVotes}
                maxCount={MAX_VOTES}
                onChange={setVotes}
                valueLabel={t('my ordered votes')}
              />
            </Modal.Columns>
            {bondValue && (
              <Modal.Columns hint={t('The amount will be reserved for the duration of your vote')}>
                <InputBalance
                  defaultValue={bondValue}
                  isDisabled
                  label={t('voting bond')}
                />
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='trash-alt'
              isDisabled={!defaultVotes.length}
              label={t('Unvote all')}
              onStart={toggleVisible}
              tx={api.tx[modLocation].removeVoter}
            />
            <TxButton
              accountId={accountId}
              isDisabled={!accountId || votes.length === 0 || voteValue.lten(0)}
              label={t('Vote')}
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
