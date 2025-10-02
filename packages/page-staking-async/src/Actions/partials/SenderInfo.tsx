// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { InputAddress, Modal } from '@polkadot/react-components';

import { useTranslation } from '../../translate.js';

interface Props {
  className?: string;
  controllerId?: string | null;
  stashId?: string | null;
}

function SenderInfo ({ className = '', controllerId, stashId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!stashId || !controllerId) {
    return null;
  }

  const showController = stashId !== controllerId;

  return (
    <Modal.Columns
      className={className}
      hint={
        showController
          ? t('The stash that is to be affected. The transaction will be sent from the associated controller account.')
          : t('The stash that is to be affected.')
      }
    >
      <InputAddress
        defaultValue={stashId}
        isDisabled
        label={t('stash account')}
      />
      {showController && (
        <InputAddress
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
      )}
    </Modal.Columns>
  );
}

export default React.memo(SenderInfo);
