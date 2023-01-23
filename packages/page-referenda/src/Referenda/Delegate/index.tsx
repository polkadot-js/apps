// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda, PalletVote, TrackDescription } from '../../types';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, InputAddress, Modal, Toggle, ToggleGroup, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';
import TrackDropdown from '../Submit/TrackDropdown';
import Activity from './Activity';
import useActivityAccount from './useActivityAccount';
import useActivityFellows from './useActivityFellows';
import useActivityNominators from './useActivityNominators';

interface Props {
  className?: string;
  palletReferenda: PalletReferenda;
  palletVote: PalletVote;
  tracks?: TrackDescription[];
}

function Delegate ({ className, palletReferenda, palletVote, tracks }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();
  const [isAllTracks, toggleAllTracks] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [toAccount, setToAccount] = useState<string | null>(null);
  const [, setTrackId] = useState<number | undefined>();
  const activityFell = useActivityFellows(palletVote);
  const activityVals = useActivityNominators(palletVote);
  const activityTo = useActivityAccount(palletVote, toAccount);
  const [accType, setAccType] = useState({ index: 0, type: 'address' });

  const allFell = useMemo(
    () => activityFell && Object.keys(activityFell).map((key) => ({ key, name: key, value: key })),
    [activityFell]
  );

  const allVals = useMemo(
    () => activityVals && Object.keys(activityVals).map((key) => ({ key, name: key, value: key })),
    [activityVals]
  );

  const typeOpts = useMemo(
    () => [
      { text: t<string>('Addresses'), value: 'address' },
      isFunction(api.query.staking?.nominators) &&
        { isDisabled: !allVals || !allVals.length, text: t<string>('Validators'), value: 'validators' },
      isFunction(api.query.fellowshipCollective?.members) &&
        { isDisabled: !allFell || !allFell.length, text: t<string>('Fellows'), value: 'fellows' }
    ],
    [allFell, allVals, api, t]
  );

  const onChangeType = useCallback(
    (index: number, type: string | number) =>
      setAccType({ index, type: type.toString() }),
    []
  );

  return (
    <>
      {isOpen && (
        <StyledModal
          className={className}
          header={t<string>('Delegate votes')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('Delegate from this account to another. All votes made on the target would count as a delegated vote for this account.')}>
              <InputAddress
                label={t<string>('delegate from account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns
              className='toggleRight'
              hint={t<string>('Either delegate your votes for a single track as selected or delegate for all available tracks.')}
            >
              <Toggle
                label={t<string>('apply delegation to all tracks')}
                onChange={toggleAllTracks}
                value={isAllTracks}
              />
              {!isAllTracks && (
                <TrackDropdown
                  onChange={setTrackId}
                  palletReferenda={palletReferenda}
                  tracks={tracks}
                />
              )}
            </Modal.Columns>
            {(typeOpts.length > 1) && (
              <Modal.Columns
                className='toggleCenter'
                hint={t<string>('Select from a list of pre-propulated accounts (based on your account activity) or supply your own')}
              >
                <ToggleGroup
                  onChange={onChangeType}
                  options={typeOpts}
                  value={accType.index}
                />
              </Modal.Columns>
            )}
            <Modal.Columns hint={t<string>('The account that you wish to delegate to')}>
              {accType.type === 'address'
                ? (
                  <>
                    <InputAddress
                      key='address'
                      label={t<string>('delegate to address')}
                      onChange={setToAccount}
                      type='allPlus'
                    />
                    <Activity value={activityTo} />
                  </>
                )
                : accType.type === 'validators'
                  ? (
                    <>
                      <InputAddress
                        defaultValue={allVals?.[0].value}
                        key='validators'
                        label={t<string>('delegate to validator')}
                        onChange={setToAccount}
                        options={allVals}
                      />
                      <Activity value={activityFell && !!toAccount && activityFell[toAccount]} />
                    </>
                  )
                  : accType.type === 'fellows'
                    ? (
                      <>
                        <InputAddress
                          defaultValue={allFell?.[0].value}
                          key='fellows'
                          label={t<string>('delegate to fellow')}
                          onChange={setToAccount}
                          options={allFell}
                        />
                        <Activity value={activityVals && !!toAccount && activityVals[toAccount]} />
                      </>
                    )
                    : null
              }
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='code-merge'
              label={t<string>('Delegate')}
              onStart={toggleOpen}
              params={[0, false]}
              tx={api.tx[palletVote].delegate}
            />
          </Modal.Actions>
        </StyledModal>
      )}
      <Button
        icon='code-merge'
        isDisabled={!hasAccounts}
        label={t<string>('Delegate')}
        onClick={toggleOpen}
      />
    </>
  );
}

const StyledModal = styled(Modal)`
  .ui--Modal-Columns.toggleCenter > div:first-child {
    text-align: center;
  }

  .ui--Modal-Columns.toggleRight > div:first-child {
    text-align: right;
  }
`;

export default React.memo(Delegate);
