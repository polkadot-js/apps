// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { InputAddress, Modal } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  stashId: string;
}

function SenderInfo ({ className = '', controllerId, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Modal.Columns className={className}>
      <Modal.Column>
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
      </Modal.Column>
      <Modal.Column>
        <p>{t<string>('The stash that is to be affected. The transaction will be sent from the associated controller account.')}</p>
      </Modal.Column>
    </Modal.Columns>
  );
}

export default React.memo(SenderInfo);
