// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetId } from '@polkadot/types/interfaces';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';
import Create from './Create';

interface Props {
  assetIds?: AssetId[];
  className?: string;
}

function CreateButton ({ assetIds, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!assetIds || !hasAccounts || !isFunction(api.tx.utility.batchAll)}
        label={t<string>('Create')}
        onClick={toggleOpen}
      />
      {isOpen && assetIds && (
        <Create
          assetIds={assetIds}
          className={className}
          onClose={toggleOpen}
        />
      )}
    </>
  );
}

export default React.memo(CreateButton);
