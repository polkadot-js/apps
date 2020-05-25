// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatementKind } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import PolkadotRegular from './statements/polkadot/regular';
import PolkadotSaft from './statements/polkadot/saft';
import { useTranslation } from './translate';
import { getStatement } from './util';

export interface Props {
  className?: string;
  kind?: StatementKind;
  systemChain: string;
}

// Get the full hardcoded text for a statement
function StatementFullText ({ kind, systemChain }: { kind?: StatementKind; systemChain: string }): React.ReactElement | null {
  const { t } = useTranslation();

  switch (systemChain) {
    case 'Polkadot CC1': {
      if (!kind) {
        return null;
      }

      return kind.isRegular
        ? <PolkadotRegular />
        : <PolkadotSaft />;
    }

    default:
      return <p>{t('Warning: we did not find any attest statement for {{chain}}', { replace: { chain: systemChain } })}</p>;
  }
}

function Statement ({ className, kind, systemChain }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const statementUrl = getStatement(systemChain, kind)?.url;

  return (
    <div className={className}>
      {t('Please read these terms and conditions carefully. By submitting this statement, you are deemed to have accepted these Terms and Conditions. If you do not agree to these terms, please refrain from accessing or proceeding. You can also find them at:')}
      <a className='statementUrl'
        href={statementUrl}
        rel='noopener noreferrer'
        target='_blank'>{statementUrl}</a>
      <div className='statement'>
        <StatementFullText
          kind={kind}
          systemChain={systemChain}
        />
      </div>
    </div>
  );
}

export default React.memo(styled(Statement)`
  .statement{
    border: 1px solid #c2c2c2;
    background: #f2f2f2;
    height: 15rem;
    overflow-y: scroll;
    padding: 1rem;
    width: 100%;
    margin: 1rem 0;
    white-space: normal;

    p {
      color: #4e4e4e !important
    }
  }

  .statementUrl{
    margin-left: 0.3rem
  }
`);
