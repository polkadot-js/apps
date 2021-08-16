// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AddressFlags } from '@polkadot/react-hooks/types';

import React from 'react';
import styled from 'styled-components';

import { Tag } from '@polkadot/react-components';

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
          <Tag
            color='theme'
            label={t<string>('Validator')}
            size='tiny'
          />
        )}
        {isNominator && (
          <Tag
            color='theme'
            label={t<string>('Nominator')}
            size='tiny'
          />
        )}
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
    margin: 0.1rem 0 0.1rem 0.571rem;
  }
`);
