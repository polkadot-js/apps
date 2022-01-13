// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AddressFlags } from '@polkadot/react-hooks/types';

import React from 'react';
import styled from 'styled-components';

import { Flag } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  flags: AddressFlags;
  className?: string;
}

function Flags ({ className = '', flags: { isCouncil, isDevelopment, isExternal, isInjected, isMultisig, isNominator, isProxied, isSociety, isSudo, isTechCommittee, isValidator } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const hasFlags = isCouncil || isDevelopment || isExternal || isInjected || isMultisig || isProxied || isSociety || isSudo || isTechCommittee || isValidator || isNominator;

  if (!hasFlags) {
    return null;
  }

  return (
    <div className={`${className} ui--AddressMenu-flags`}>
      {
        hasFlags && (
          <h5>{t<string>('Flags')}</h5>
        )
      }
      <div>
        {isValidator && (
          <Flag
            color='theme'
            label={t<string>('Validator')}
          />
        )}
        {isNominator && (
          <Flag
            color='theme'
            label={t<string>('Nominator')}
          />
        )}
        {isExternal && (
          isMultisig
            ? (
              <Flag
                color='green'
                label={t<string>('Multisig')}
              />
            )
            : isProxied
              ? (
                <Flag
                  color='grey'
                  label={t<string>('Proxied')}
                />
              )
              : (
                <Flag
                  color='grey'
                  label={t<string>('External')}
                />
              )
        )}
        {isInjected && (
          <Flag
            color='grey'
            label={t<string>('Injected')}
          />
        )}
        {isDevelopment && (
          <Flag
            color='grey'
            label={t<string>('Test account')}
          />
        )}
        {isCouncil && (
          <Flag
            color='blue'
            label={t<string>('Council')}
          />
        )}
        {isSociety && (
          <Flag
            color='green'
            label={t<string>('Society')}
          />
        )}
        {isTechCommittee && (
          <Flag
            color='orange'
            label={t<string>('Technical committee')}
          />
        )}
        {isSudo && (
          <Flag
            color='pink'
            label={t<string>('Sudo key')}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(Flags)`
  h5 {
    text-align: left;
    font-style: normal;
    font-weight: var(--font-weight-bold);
    font-size: 0.714rem;
    line-height: 1rem;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .ui--Tag {
    margin: 0.2rem 1rem 0.2rem 0.571rem;
  }
`);
