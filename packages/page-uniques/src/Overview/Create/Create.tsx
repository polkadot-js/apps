// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { InfoState, TeamState } from './types';

import React, { useMemo, useState } from 'react';

import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useStepper, useTxBatch } from '@polkadot/react-hooks';
import { u8aWrapBytes } from '@polkadot/util';

import { useTranslation } from '../../translate';
import Info from './Info';
import Team from './Team';

interface Props {
  uniqueIds: BN[];
  onClose: () => void;
  openId: BN;
}

const BATCH_OPTIONS = {
  isBatchAll: true
};

function Create ({ uniqueIds, onClose, openId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [step, nextStep, prevStep] = useStepper();
  const [unique, setUnique] = useState<InfoState | null>(null);
  const [team, setTeam] = useState<TeamState | null>(null);

  const [createTx, metadataTx] = useMemo(
    () => unique
      ? [
        api.tx.uniques.create(unique.uniqueId, unique.accountId),
        api.tx.uniques.setClassMetadata(unique.uniqueId, u8aWrapBytes(unique.data), unique.isFrozen)
      ]
      : [null, null],
    [api, unique]
  );

  const teamTx = useMemo(
    () => unique && team && (team.adminId !== unique.accountId || team.freezerId !== unique.accountId || team.issuerId !== unique.accountId)
      ? api.tx.uniques.setTeam(unique.uniqueId, team.issuerId, team.adminId, team.freezerId)
      : null,
    [api, unique, team]
  );

  const txs = useMemo(
    () => createTx && metadataTx && team && (
      teamTx
        ? [createTx, metadataTx, teamTx]
        : [createTx, metadataTx]
    ),
    [createTx, metadataTx, team, teamTx]
  );

  const extrinsic = useTxBatch(txs, BATCH_OPTIONS);

  return (
    <Modal
      header={t<string>('create unique {{step}}/{{steps}}', { replace: { step, steps: 2 } })}
      onClose={onClose}
      size='large'
    >
      {step === 1 && (
        <Info
          uniqueIds={uniqueIds}
          defaultValue={unique}
          onChange={setUnique}
          openId={openId}
        />
      )}
      {step === 2 && unique && (
        <Team
          accountId={unique.accountId}
          defaultValue={team}
          onChange={setTeam}
        />
      )}
      <Modal.Actions>
        {step === 1 &&
          <Button
            icon='step-forward'
            isDisabled={!unique}
            label={t<string>('Next')}
            onClick={nextStep}
          />
        }
        {step === 2 && (
          <>
            <Button
              icon='step-backward'
              label={t<string>('Prev')}
              onClick={prevStep}
            />
            <TxButton
              accountId={unique?.accountId}
              extrinsic={extrinsic}
              icon='plus'
              label={t<string>('Create')}
              onStart={onClose}
            />
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Create);
