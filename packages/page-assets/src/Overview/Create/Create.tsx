// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BatchOptions } from '@polkadot/react-hooks/types';
import type { BN } from '@polkadot/util';
import type { InfoState, TeamState } from './types.js';

import React, { useMemo, useState } from 'react';

import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useStepper, useTxBatch } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import Info from './Info.js';
import Team from './Team.js';

interface Props {
  assetIds: BN[];
  className?: string;
  onClose: () => void;
  openId: BN;
}

const BATCH_OPTS: BatchOptions = { type: 'all' };

function Create ({ assetIds, className, onClose, openId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [step, nextStep, prevStep] = useStepper();
  const [asset, setAsset] = useState<InfoState | null>(null);
  const [team, setTeam] = useState<TeamState | null>(null);

  const [createTx, metadataTx] = useMemo(
    () => asset
      ? [
        api.tx.assets.create(asset.assetId, asset.accountId, asset.minBalance),
        api.tx.assets.setMetadata(asset.assetId, asset.assetName, asset.assetSymbol, asset.assetDecimals)
      ]
      : [null, null],
    [api, asset]
  );

  const teamTx = useMemo(
    () => asset && team && (team.adminId !== asset.accountId || team.freezerId !== asset.accountId || team.issuerId !== asset.accountId)
      ? api.tx.assets.setTeam(asset.assetId, team.issuerId, team.adminId, team.freezerId)
      : null,
    [api, asset, team]
  );

  const txs = useMemo(
    () => createTx && metadataTx && team && (
      teamTx
        ? [createTx, metadataTx, teamTx]
        : [createTx, metadataTx]
    ),
    [createTx, metadataTx, team, teamTx]
  );

  const extrinsic = useTxBatch(txs, BATCH_OPTS);

  return (
    <Modal
      className={className}
      header={t('create asset {{step}}/{{steps}}', { replace: { step, steps: 2 } })}
      onClose={onClose}
      size='large'
    >
      {step === 1 && (
        <Info
          assetIds={assetIds}
          defaultValue={asset}
          onChange={setAsset}
          openId={openId}
        />
      )}
      {step === 2 && asset && (
        <Team
          accountId={asset.accountId}
          defaultValue={team}
          onChange={setTeam}
        />
      )}
      <Modal.Actions>
        {step === 1 &&
          <Button
            icon='step-forward'
            isDisabled={!asset}
            label={t('Next')}
            onClick={nextStep}
          />
        }
        {step === 2 && (
          <>
            <Button
              icon='step-backward'
              label={t('Prev')}
              onClick={prevStep}
            />
            <TxButton
              accountId={asset?.accountId}
              extrinsic={extrinsic}
              icon='plus'
              label={t('Create')}
              onStart={onClose}
            />
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Create);
