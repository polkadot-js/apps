// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import React from 'react';

import AddressMini from '../AddressMini.js';
import { useTranslation } from '../translate.js';

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
    <section className='ui--AddressMenu-multisig withDivider'>
      <div className='ui--AddressMenu-sectionHeader'>
        {t<string>('multisig')}
      </div>
      <div className='ui--AddressMenu-multisigTable'>
        <div className='tr'>
          <div className='th'>{t<string>('threshold')}</div>
          <div className='td'>
            {threshold}/{who?.length}
          </div>
        </div>
        <div className='tr'>
          <div className='th signatories'>{t<string>('signatories')}</div>
          <div className='td'>
            {(who as string[])?.map((address) => (
              <AddressMini
                key={address}
                value={address}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Multisig);
