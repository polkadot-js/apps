// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React from 'react';

import { formatNumber, isString, isUndefined } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import CallExpander from './CallExpander.js';

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
      <div className={`${className} ui--ProposedAction`}>
        <div>{stringId ? `#${stringId}: ` : ''}{t('No execution details available for this proposal')}</div>
      </div>
    );
  }

  return (
    <div className={`${className} ui--ProposedAction`}>
      <CallExpander
        isHeader
        labelHash={t('preimage')}
        stringId={stringId}
        value={proposal}
        withHash
      />
    </div>
  );
}

export default React.memo(ProposedAction);
