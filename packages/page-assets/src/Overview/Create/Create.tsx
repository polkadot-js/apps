// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { InfoState, TeamState } from './types';

import React, { useMemo, useState } from 'react';

import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useStepper, useTxBatch } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import Info from './Info';
import Team from './Team';

interface Props {
  assetIds: BN[];
  className?: string;
  onClose: () => void;
  openId: BN;
}

const BATCH_OPTIONS = {
  isBatchAll: true
};

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

  const extrinsic = useTxBatch(txs, BATCH_OPTIONS);

  return (
    <Modal
      className={className}
      header={t<string>('create asset {{step}}/{{steps}}', { replace: { step, steps: 2 } })}
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
              accountId={asset?.accountId}
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
