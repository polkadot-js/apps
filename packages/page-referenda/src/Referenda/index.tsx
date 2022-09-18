// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda, PalletVote } from '../types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useReferenda from '../useReferenda';
import useSummary from '../useSummary';
import Referendum from './Referendum';
import Summary from './Summary';

export { useCounterNamed as useCounter } from '../useCounter';

interface Props {
  className?: string;
  members?: string[];
  palletReferenda: PalletReferenda;
  palletVote: PalletVote;
}

function Referenda ({ className, members, palletReferenda, palletVote }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const [referenda] = useReferenda(palletReferenda);
  const summary = useSummary(palletReferenda, referenda);

  const isMember = useMemo(
    () => !members || allAccounts.some((a) => members.includes(a)),
    [allAccounts, members]
  );

  const headerRef = useRef([
    [t('referenda'), 'start', 2],
    [undefined, undefined, 3]
  ]);

  return (
    <div className={className}>
      <Summary summary={summary} />
      <Table
        className={className}
        empty={referenda && t<string>('No referendums found')}
        header={headerRef.current}
      >
        {referenda && referenda.map((r) => (
          <Referendum
            isMember={isMember}
            key={r.key}
            members={members}
            palletVote={palletVote}
            value={r}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Referenda);
