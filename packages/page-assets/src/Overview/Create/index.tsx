// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import Create from './Create.js';

interface Props {
  assetIds?: BN[];
  className?: string;
  openId: BN;
}

function CreateButton ({ assetIds, className, openId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!assetIds || !hasAccounts}
        label={t('Create')}
        onClick={toggleOpen}
      />
      {isOpen && assetIds && (
        <Create
          assetIds={assetIds}
          className={className}
          onClose={toggleOpen}
          openId={openId}
        />
      )}
    </>
  );
}

export default React.memo(CreateButton);
