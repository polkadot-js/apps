// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { AddressMulti, Modal } from '@polkadot/react-components';
import { useAccounts, useAddresses } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

const MAX_HELPERS = 8;

export default function RecoverSetup ({ address, className, onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { allAddresses } = useAddresses();
  const [availableHelpers, setAvailableHelpers] = useState<string[]>([]);
  const [helpers, setHelpers] = useState<string[]>([]);

  useEffect((): void => {
    if (allAccounts && allAddresses) {
      setAvailableHelpers(
        [...allAccounts, ...allAddresses].filter((a): boolean => a !== address)
      );
    }
  }, [address, allAccounts, allAddresses]);

  return (
    <Modal
      className={className}
      header={t('Setup account as recoverable')}
    >
      <Modal.Content>
        <AddressMulti
          available={availableHelpers}
          help={t('The addresses that are able to help in recovery')}
          label={t('trusted social recovery helpers')}
          onChange={setHelpers}
          maxCount={MAX_HELPERS}
          value={helpers}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>nothing</Modal.Actions>
    </Modal>
  )
}
