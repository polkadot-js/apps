// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { AssetId } from '@polkadot/types/interfaces';
import type { InfoState, MetadataState, TeamState } from './types';

import React, { useEffect, useState } from 'react';

import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useStepper } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import Info from './Info';
import Metadata from './Metadata';
import Team from './Team';

interface Props {
  assetIds: AssetId[];
  className?: string;
  onClose: () => void;
}

function Create ({ assetIds, className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [step, nextStep, prevStep] = useStepper();
  const [asset, setAsset] = useState<InfoState | null>(null);
  const [metadata, setMetadata] = useState<MetadataState | null>(null);
  const [team, setTeam] = useState<TeamState | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  useEffect((): void => {
    setExtrinsic(
      () => asset && metadata && team
        ? team.teamTx
          ? api.tx.utility.batchAll([asset.createTx, metadata.metadataTx, team.teamTx])
          : api.tx.utility.batchAll([asset.createTx, metadata.metadataTx])
        : null
    );
  }, [api, asset, metadata, team]);

  return (
    <Modal
      className={className}
      header={t<string>('create asset {{step}}/{{steps}}', { replace: { step, steps: 3 } })}
      size='large'
    >
      {step === 1 && (
        <Info
          assetIds={assetIds}
          defaultValue={asset}
          onChange={setAsset}
        />
      )}
      {step === 2 && (
        <Metadata
          assetId={asset?.assetId}
          defaultValue={metadata}
          onChange={setMetadata}
        />
      )}
      {step === 3 && (
        <Team
          accountId={asset?.accountId}
          assetId={asset?.assetId}
          defaultValue={team}
          onChange={setTeam}
        />
      )}
      <Modal.Actions onCancel={onClose}>
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
            <Button
              icon='step-forward'
              isDisabled={!metadata}
              label={t<string>('Next')}
              onClick={nextStep}
            />
          </>
        )}
        {step === 3 && (
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
