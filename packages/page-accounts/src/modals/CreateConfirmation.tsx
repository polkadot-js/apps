// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType } from '@polkadot/util-crypto/types';

import React from 'react';

import { AddressRow, Modal, Static } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

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

  const splitSeed = seed && seed.split(' ');
  const shortSeed = isHex(seed)
    ? `${seed.substr(10)} … ${seed.substr(-8)}`
    : splitSeed && splitSeed.map((value, index) => (index % 3) ? '…' : value).join(' ');

  return (
    <Modal.Content>
      <Modal.Columns
        hint={
          <>
            <p>{t<string>('We will provide you with a generated backup file after your account is created. As long as you have access to your account you can always download this file later by clicking on "Backup" button from the Accounts section.')}</p>
            <p>{t<string>('Please make sure to save this file in a secure location as it is required, together with your password, to restore your account.')}</p>
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
            label={t<string>('partial seed')}
            value={shortSeed}
          />
        )}
        <Static
          label={t<string>('keypair type')}
          value={pairType}
        />
        <Static
          label={t<string>('derivation path')}
          value={derivePath || t<string>('<none provided>')}
        />
      </Modal.Columns>
    </Modal.Content>
  );
}

export default React.memo(CreateConfirmation);
