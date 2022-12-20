// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React from 'react';
import styled from 'styled-components';

import { formatNumber, isString, isUndefined } from '@polkadot/util';

import CallExpander from './CallExpander';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  proposal?: Call | null;
  idNumber?: BN | number | string;
  withLinks?: boolean;
  expandNested?: boolean;
}

function ProposedAction ({ className = '', idNumber, proposal }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const stringId = isString(idNumber) || isUndefined(idNumber)
    ? idNumber
    : formatNumber(idNumber);

  if (!proposal) {
    return (
      <div className={`ui--ProposedAction ${className}`}>
        <h1>{stringId ? `#${stringId}: ` : ''}{t<string>('No execution details available for this proposal')}</h1>
      </div>
    );
  }

  return (
    <div className={`ui--ProposedAction ${className}`}>
      <CallExpander
        isHeader
        labelHash={t<string>('preimage')}
        stringId={stringId}
        value={proposal}
        withHash
      />
    </div>
  );
}

export default React.memo(styled(ProposedAction)`
  margin-left: 2rem;

  > h1 {
    font-size: 1.25rem;
    text-transform: none;
  }

  .ui--ProposedAction-extrinsic {
    > .ui--Params-Content {
      padding-left: 0;
    }
  }

  .ui--ProposedAction-header {
    margin-bottom: 1rem;
  }
`);
