// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { AssetId } from '@polkadot/types/interfaces';
import type { InfoState, MetadataState, TeamState } from './types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useStepper, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';
import Info from './Info';
import Metadata from './Metadata';
import Team from './Team';

interface Props {
  assetIds?: AssetId[];
  className?: string;
}

function Create ({ assetIds, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [step, nextStep, prevStep] = useStepper();
  const [isOpen, toggleOpen] = useToggle();
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
    <>
      <Button
        icon='plus'
        isDisabled={!assetIds || !hasAccounts || !isFunction(api.tx.utility.batchAll)}
        label={t<string>('Create')}
        onClick={toggleOpen}
      />
      {isOpen && assetIds && (
        <Modal
          className={className}
          header={t<string>('create asset {{step}}/{{steps}}', { replace: { step, steps: 3 } })}
          size='large'
        >
          {step === 1 && (
            <Info
              assetIds={assetIds}
              onChange={setAsset}
            />
          )}
          {step === 2 && (
            <Metadata
              assetId={asset?.assetId}
              onChange={setMetadata}
            />
          )}
          {step === 3 && (
            <Team
              accountId={asset?.accountId}
              assetId={asset?.assetId}
              onChange={setTeam}
            />
          )}
          <Modal.Actions onCancel={toggleOpen}>
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
                  onStart={toggleOpen}
                />
              </>
            )}
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(styled(Create)`
  .stepHidden.content {
    display: none !important;
  }
`);
