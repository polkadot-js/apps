// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { MarkWarning } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

function ActionsBanner (): React.ReactElement<null> | null {
  const { t } = useTranslation();

  return (
    <MarkWarning
      className='warning centered'
      content={t('Use the account actions to create a new validator/nominator stash and bond it to participate in staking. Do not send funds directly via a transfer to a validator.')}
    />
  );
}

export default React.memo(ActionsBanner);
