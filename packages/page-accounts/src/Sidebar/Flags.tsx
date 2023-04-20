// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AddressFlags } from '@polkadot/react-hooks/types';

import React from 'react';

import { Flag, styled } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

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
    <StyledDiv className={`${className} ui--AddressMenu-flags`}>
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
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--Tag {
    margin: 0.2rem 1rem 0.2rem 0.571rem;
  }
`;

export default React.memo(Flags);
