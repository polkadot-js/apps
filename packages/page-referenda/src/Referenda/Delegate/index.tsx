// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BatchOptions } from '@polkadot/react-hooks/types';
import type { BN } from '@polkadot/util';
import type { PalletReferenda, PalletVote, TrackDescription } from '../../types.js';

import React, { useCallback, useMemo, useState } from 'react';

import { Button, ConvictionDropdown, InputAddress, Modal, Toggle, ToggleGroup, TxButton, VoteValue } from '@polkadot/react-components';
import { useAccounts, useApi, useStepper, useToggle, useTxBatch } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import TrackDropdown from '../Submit/TrackDropdown.js';
import Activity from './Activity.js';
import useActivityAccount from './useActivityAccount.js';
import useActivityFellows from './useActivityFellows.js';
import useActivityNominators from './useActivityNominators.js';

interface Props {
  className?: string;
  palletReferenda: PalletReferenda;
  palletVote: PalletVote;
  tracks: TrackDescription[];
}

interface Option {
  key: string;
  name: string;
  value: string;
}

const BATCH_OPTS: BatchOptions = { type: 'force' };

function Delegate ({ className, palletReferenda, palletVote, tracks }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();
  const [isAllTracks, toggleAllTracks] = useToggle();
  const [step, nextStep, prevStep] = useStepper();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [toAccount, setToAccount] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<number>(0);
  const [balance, setBalance] = useState<BN | undefined>();
  const [conviction, setConviction] = useState(1);
  const activityFell = useActivityFellows(palletVote);
  const activityVals = useActivityNominators(palletVote);
  const activityFrom = useActivityAccount(palletVote, accountId);
  const activityTo = useActivityAccount(palletVote, toAccount);
  const [accType, setAccType] = useState({ index: 0, type: 'address' });

  const includeTracks = useMemo(
    () => activityFrom && tracks
      .filter((t) => !activityFrom.some((a) => t.id.eq(a.classId)))
      .map(({ id }) => id),
    [activityFrom, tracks]
  );

  const allFell = useMemo(
    // We also filter the fellows by activity - since there are a number
    // we just want to skip those that does not have any activity
    () => activityFell &&
      Object
        .entries(activityFell)
        .map(([key, act]) => (act.length > 0) && ({ key, name: key, value: key }))
        .filter((a): a is Option => !!a),
    [activityFell]
  );

  const allVals = useMemo(
    () => activityVals &&
      Object
        .entries(activityVals)
        .map(([key]) => ({ key, name: key, value: key }))
        .filter((a): a is Option => !!a),
    [activityVals]
  );

  const typeOpts = useMemo(
    () => [
      { text: t('Addresses'), value: 'address' },
      isFunction(api.query.staking?.nominators) &&
        { isDisabled: !allVals?.length, text: t('Validators'), value: 'validators' },
      isFunction(api.query.fellowshipCollective?.members) &&
        { isDisabled: !allFell?.length, text: t('Fellows'), value: 'fellows' }
    ],
    [allFell, allVals, api, t]
  );

  const onChangeType = useCallback(
    (index: number, type: string | number) =>
      setAccType({ index, type: type.toString() }),
    []
  );

  const batchInner = useMemo(
    () => balance && conviction >= 0 && toAccount && includeTracks
      ? (isAllTracks ? includeTracks : [trackId]).map((trackId) =>
        api.tx[palletVote as 'convictionVoting'].delegate(trackId, toAccount, conviction, balance)
      )
      : null,
    [api, balance, conviction, includeTracks, isAllTracks, palletVote, toAccount, trackId]
  );

  const extrinsics = useTxBatch(batchInner, BATCH_OPTS);

  // NOTE The activityFrom & activityTo checks only checks that the hook has received
  // values, not that any values are contained. If we do a length check, that would mean
  // we could only delegate to accounts with activity. Instead, we just check that we
  // have the results from the on-chain data received via useActivity*
  const isStep1Valid = !!(accountId && activityFrom && includeTracks && (includeTracks.length > 0));
  const isStep2Valid = !!(toAccount && activityTo);

  return (
    <>
      {isOpen && (
        <Modal
          className={className}
          header={t('Delegate votes {{step}}/{{numSteps}}', { replace: { numSteps: 2, step } })}
          onClose={toggleOpen}
          size='large'
        >
          {(step === 1) && (
            <Modal.Content>
              <Modal.Columns hint={t('Delegate from this account to another. All votes made on the target would count as a delegated vote for this account.')}>
                <InputAddress
                  label={t('delegate from account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
                <Activity
                  allowEmpty
                  palletReferenda={palletReferenda}
                  trackId={-1}
                  tracks={tracks}
                  value={activityFrom}
                />
              </Modal.Columns>
              <Modal.Columns
                align='right'
                hint={t('Either delegate your votes for a single track as selected or delegate for all available tracks.')}
              >
                <Toggle
                  label={t('apply delegation to all tracks')}
                  onChange={toggleAllTracks}
                  value={isAllTracks}
                />
                {!isAllTracks && includeTracks && (includeTracks.length > 0) && (
                  <TrackDropdown
                    include={includeTracks}
                    onChange={setTrackId}
                    palletReferenda={palletReferenda}
                    tracks={tracks}
                  />
                )}
              </Modal.Columns>
              <Modal.Columns
                hint={
                  <>
                    <p>{t('The balance associated with the vote will be locked as per the conviction specified and will not be available for transfer during this period.')}</p>
                    <p>{t('Conviction locks do overlap and are not additive, meaning that funds locked during a previous vote can be locked again.')}</p>
                  </>
                }
              >
                <VoteValue
                  accountId={accountId}
                  autoFocus
                  label={t('delegated vote value')}
                  onChange={setBalance}
                />
                <ConvictionDropdown
                  label={t('conviction')}
                  onChange={setConviction}
                  value={conviction}
                  voteLockingPeriod={api.consts[palletVote as 'convictionVoting'].voteLockingPeriod}
                />
              </Modal.Columns>
            </Modal.Content>
          )}
          {(step === 2) && (
            <Modal.Content>
              {(typeOpts.length > 1) && (
                <Modal.Columns
                  align='center'
                  hint={t('Select from a list of pre-propulated accounts (based on your account activity) or supply your own')}
                >
                  <ToggleGroup
                    onChange={onChangeType}
                    options={typeOpts}
                    value={accType.index}
                  />
                </Modal.Columns>
              )}
              <Modal.Columns hint={t('The account that you wish to delegate to')}>
                {accType.type === 'address'
                  ? (
                    <InputAddress
                      key='address'
                      label={t('delegate to address')}
                      onChange={setToAccount}
                      type='allPlus'
                    />
                  )
                  : accType.type === 'validators'
                    ? (
                      <InputAddress
                        defaultValue={allVals?.[0].value}
                        key='validators'
                        label={t('delegate to validator')}
                        onChange={setToAccount}
                        options={allVals}
                        type='allPlus'
                      />
                    )
                    : accType.type === 'fellows'
                      ? (
                        <InputAddress
                          defaultValue={allFell?.[0].value}
                          key='fellows'
                          label={t('delegate to fellow')}
                          onChange={setToAccount}
                          options={allFell}
                          type='allPlus'
                        />
                      )
                      : null
                }
                <Activity
                  palletReferenda={palletReferenda}
                  trackId={isAllTracks ? -1 : trackId}
                  tracks={tracks}
                  value={
                    accType.type === 'fellows'
                      ? activityFell && !!toAccount && activityFell[toAccount]
                      : accType.type === 'validators'
                        ? activityVals && !!toAccount && activityVals[toAccount]
                        : activityTo
                  }
                />
              </Modal.Columns>
            </Modal.Content>
          )}
          <Modal.Actions>
            {(step !== 1) && (
              <Button
                icon='step-backward'
                label={t('Prev')}
                onClick={prevStep}
              />
            )}
            {(step !== 2) && (
              <Button
                activeOnEnter
                icon='step-forward'
                isDisabled={
                  step === 1
                    ? !isStep1Valid
                    : !isStep2Valid
                }
                label={t('Next')}
                onClick={nextStep}
              />
            )}
            <TxButton
              accountId={accountId}
              extrinsic={extrinsics}
              icon='code-merge'
              isDisabled={
                !isStep1Valid ||
                !isStep2Valid ||
                step !== 2
              }
              label={t('Delegate')}
              onStart={toggleOpen}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='code-merge'
        isDisabled={!hasAccounts}
        label={t('Delegate')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Delegate);
