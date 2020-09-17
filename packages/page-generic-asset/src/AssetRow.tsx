// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { CopyButton } from '@polkadot/react-components';
import Row from '@polkadot/react-components/Row';

import { useTranslation } from './translate';

interface Props {
  buttons?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  isDisabled?: boolean;
  isInline?: boolean;
  onSaveName: (name: string) => void;
  assetId: string;
}

export default function AssetRow ({ assetId, buttons, children, className, defaultName = 'New Asset', isDisabled, isInline, onSaveName }: Props): React.ReactElement<Props> {
  const { t } =
   useTranslation();
  const [name, setName] = useState(defaultName);

  return (
    <Row
      buttons={buttons}
      className={className}
      details={
        <div>
          <CopyButton value={assetId}>
            <span>{t('Asset ID')}: {assetId}</span>
          </CopyButton>
        </div>
      }
      isDisabled={isDisabled}
      isEditableName
      isInline={isInline}
      name={name}
      onChangeName={setName}
      onSaveName={onSaveName}
    >
      {children}
    </Row>
  );
}
