// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetId } from '@polkadot/types/interfaces';
import type { InfoState, MetadataState } from './types';

import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Modal } from '@polkadot/react-components';
import { useAccounts, useApi, useStepper, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';
import Info from './Info';
import Metadata from './Metadata';

interface Props {
  assetIds?: AssetId[];
  className?: string;
}

// 3 steps -
//  - create
//  - metadata
//  - team

function Create ({ assetIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [step, nextStep, prevStep] = useStepper();
  const [isOpen, toggleOpen] = useToggle();
  const [assetInfo, setAssetInfo] = useState<InfoState | null>(null);
  const [metadata, setMetadata] = useState<MetadataState | null>(null);

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
          header={t<string>('create asset')}
          size='large'
        >
          <Info
            assetIds={assetIds}
            className={step === 1 ? '' : 'stepHidden'}
            onChange={setAssetInfo}
          />
          <Metadata
            assetId={assetInfo?.assetId}
            className={step === 2 ? '' : 'stepHidden'}
            onChange={setMetadata}
          />
          <Modal.Actions onCancel={toggleOpen}>
            {step === 1 &&
              <Button
                icon='step-forward'
                isDisabled={!assetInfo}
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
            {/* {step === 3 && (
              <>
                <Button
                  icon='step-backward'
                  label={t<string>('Prev')}
                  onClick={prevStep}
                />
                <Button
                  icon='plus'
                  isBusy={isBusy}
                  label={t<string>('Create')}
                  onClick={_onCommit}
                />
              </>
            )} */}
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(styled(Create)`
  .stepHidden {
    display: none;
  }
`);
