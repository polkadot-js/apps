// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import React from 'react';
import { AddressMini, Icon, Static } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  isMultisig: boolean;
  meta?: KeyringJson$Meta;
}

function Multisig ({ isMultisig, meta }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!isMultisig || !meta) {
    return null;
  }

  const { threshold, who } = meta;

  return (
    <section>
      <div className='ui--AddressMenu-sectionHeader'>
        <div>
          <Icon name='handshake outline' />
          &nbsp;
          {t('multisig')}
        </div>
      </div>
      <Static
        isFull
        label={t('threshold')}
      >
        {threshold}/{who.length}
      </Static>
      <Static
        isFull
        label={t('signatories')}
      >
        {who?.map((address: string) => (
          <AddressMini
            key={address}
            value={address}
          />
        ))}
      </Static>
    </section>
  );
}

export default React.memo(Multisig);
