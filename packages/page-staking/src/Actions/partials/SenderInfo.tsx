// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { InputAddress, Modal } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

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

  return (
    <Modal.Columns
      className={className}
      hint={t<string>('The stash that is to be affected. The transaction will be sent from the associated controller account.')}
    >
      <InputAddress
        defaultValue={stashId}
        isDisabled
        label={t<string>('stash account')}
      />
      <InputAddress
        defaultValue={controllerId}
        isDisabled
        label={t<string>('controller account')}
      />
    </Modal.Columns>
  );
}

export default React.memo(SenderInfo);
