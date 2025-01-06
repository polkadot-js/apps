// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AddressFlags } from '@polkadot/react-hooks/types';

import React from 'react';

import Flag from '../Flag.js';
import { styled } from '../styled.js';
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
          <h5>{t('Flags')}</h5>
        )
      }
      <div>
        {isValidator && (
          <Flag
            color='theme'
            label={t('Validator')}
          />
        )}
        {isNominator && (
          <Flag
            color='theme'
            label={t('Nominator')}
          />
        )}
        {isExternal && (
          isMultisig
            ? (
              <Flag
                color='green'
                label={t('Multisig')}
              />
            )
            : isProxied
              ? (
                <Flag
                  color='grey'
                  label={t('Proxied')}
                />
              )
              : (
                <Flag
                  color='grey'
                  label={t('External')}
                />
              )
        )}
        {isInjected && (
          <Flag
            color='grey'
            label={t('Injected')}
          />
        )}
        {isDevelopment && (
          <Flag
            color='grey'
            label={t('Test account')}
          />
        )}
        {isCouncil && (
          <Flag
            color='blue'
            label={t('Council')}
          />
        )}
        {isSociety && (
          <Flag
            color='green'
            label={t('Society')}
          />
        )}
        {isTechCommittee && (
          <Flag
            color='orange'
            label={t('Technical committee')}
          />
        )}
        {isSudo && (
          <Flag
            color='pink'
            label={t('Sudo key')}
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
