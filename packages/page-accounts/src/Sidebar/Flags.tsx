// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AddressFlags } from '@polkadot/react-hooks/types';

import React from 'react';
import { Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  flags: AddressFlags;
}

function Flags ({ flags: { isCouncil, isDevelopment, isExternal, isInjected, isMultisig, isProxied, isSociety, isSudo, isTechCommittee } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const hasFlags = isCouncil || isDevelopment || isExternal || isInjected || isMultisig || isProxied || isSociety || isSudo || isTechCommittee;

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
              label={t<string>('Multisig')}
              size='tiny'
            />
          )
          : isProxied
            ? (
              <Tag
                color='grey'
                label={t<string>('External')}
                size='tiny'
              />
            )
            : (
              <Tag
                color='grey'
                label={t<string>('External')}
                size='tiny'
              />
            )
      )}
      {isInjected && (
        <Tag
          color='grey'
          label={t<string>('Injected')}
          size='tiny'
        />
      )}
      {isDevelopment && (
        <Tag
          color='grey'
          label={t<string>('Test account')}
          size='tiny'
        />
      )}
      {isCouncil && (
        <Tag
          color='blue'
          label={t<string>('Council')}
          size='tiny'
        />
      )}
      {isSociety && (
        <Tag
          color='green'
          label={t<string>('Society')}
          size='tiny'
        />
      )}
      {isTechCommittee && (
        <Tag
          color='orange'
          label={t<string>('Technical committee')}
          size='tiny'
        />
      )}
      {isSudo && (
        <Tag
          color='pink'
          label={t<string>('Sudo key')}
          size='tiny'
        />
      )}
    </div>
  );
}

export default React.memo(Flags);
