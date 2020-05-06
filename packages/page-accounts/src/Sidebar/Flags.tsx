// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressFlags } from '@polkadot/react-hooks/types';

import React from 'react';
import { Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  flags: AddressFlags;
}

function Flags ({ flags: { isCouncil, isDevelopment, isExternal, isInjected, isMultisig, isSociety, isSudo, isTechCommittee } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const hasFlags = isCouncil || isDevelopment || isExternal || isInjected || isMultisig || isSociety || isSudo || isTechCommittee;

  if (!hasFlags) {
    return null;
  }

  return (
    <div className='ui--AddressMenu-flags'>
      {isExternal && (
        isMultisig
          ? (
            <Tag
              color='green'
              label={t('Multisig')}
              size='tiny'
            />
          )
          : (
            <Tag
              color='grey'
              label={t('External')}
              size='tiny'
            />
          )
      )}
      {isInjected && (
        <Tag
          color='grey'
          label={t('Injected')}
          size='tiny'
        />
      )}
      {isDevelopment && (
        <Tag
          color='grey'
          label={t('Test account')}
          size='tiny'
        />
      )}
      {isCouncil && (
        <Tag
          color='blue'
          label={t('Council')}
          size='tiny'
        />
      )}
      {isSociety && (
        <Tag
          color='green'
          label={t('Society')}
          size='tiny'
        />
      )}
      {isTechCommittee && (
        <Tag
          color='orange'
          label={t('Technical committee')}
          size='tiny'
        />
      )}
      {isSudo && (
        <Tag
          color='pink'
          label={t('Sudo key')}
          size='tiny'
        />
      )}
    </div>
  );
}

export default React.memo(Flags);
