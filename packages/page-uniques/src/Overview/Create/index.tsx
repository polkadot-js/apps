// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import Create from './Create';

interface Props {
  uniqueIds?: BN[];
  openId: BN;
}

function CreateButton ({ uniqueIds, openId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!uniqueIds || !hasAccounts}
        label={t<string>('Create')}
        onClick={toggleOpen}
      />
      {isOpen && uniqueIds && (
        <Create
          uniqueIds={uniqueIds}
          onClose={toggleOpen}
          openId={openId}
        />
      )}
    </>
  );
}

export default React.memo(CreateButton);
