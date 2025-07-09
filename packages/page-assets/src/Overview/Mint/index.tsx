// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import Modal from './Mint.js';

interface Props {
  className?: string;
  details: PalletAssetsAssetDetails;
  id: BN;
  metadata: PalletAssetsAssetMetadata;
}

function Mint ({ className, details, id, metadata }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, toggleOpen] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        isDisabled={metadata.isFrozen.isTrue}
        label={t('Mint')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          details={details}
          id={id}
          metadata={metadata}
          onClose={toggleOpen}
        />
      )}
    </>
  );
}

export default React.memo(Mint);
