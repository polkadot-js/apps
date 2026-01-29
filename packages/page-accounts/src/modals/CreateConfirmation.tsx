// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType } from '@polkadot/util-crypto/types';

import React from 'react';

import { AddressRow, Modal, Static } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  address?: string;
  derivePath: string;
  isBusy: boolean;
  name?: string;
  pairType: KeypairType;
  seed?: string;
}

function CreateConfirmation ({ address, derivePath, name, pairType, seed }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const splitSeed = seed?.split(' ');
  const shortSeed = isHex(seed)
    ? `${seed.slice(10)} … ${seed.slice(-8)}`
    : splitSeed?.map((value, index) => (index % 3) ? '…' : value).join(' ');

  return (
    <Modal.Content>
      <Modal.Columns
        hint={
          <>
            <p>{t('We will provide you with a generated backup file after your account is created. As long as you have access to your account you can always download this file later by clicking on "Backup" button from the Accounts section.')}</p>
            <p>{t('Please make sure to save this file in a secure location as it is required, together with your password, to restore your account.')}</p>
          </>
        }
      >
        {address && name && (
          <AddressRow
            defaultName={name}
            isInline
            noDefaultNameOpacity
            value={address}
          />
        )}
        {shortSeed && (
          <Static
            label={t('partial seed')}
            value={shortSeed}
          />
        )}
        <Static
          label={t('keypair type')}
          value={pairType}
        />
        <Static
          label={t('derivation path')}
          value={derivePath || t('<none provided>')}
        />
      </Modal.Columns>
    </Modal.Content>
  );
}

export default React.memo(CreateConfirmation);
