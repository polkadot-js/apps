// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda, PalletVote, ReferendaGroup } from '../types';

import React, { useMemo } from 'react';

import AddPreimage from '@polkadot/app-preimages/Preimages/Add';
import { Button, Table } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useReferenda from '../useReferenda';
import useSummary from '../useSummary';
import Referendum from './Referendum';
import Submit from './Submit';
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
  const [grouped, tracks] = useReferenda(palletReferenda);
  const summary = useSummary(palletReferenda, grouped);

  const isMember = useMemo(
    () => !members || allAccounts.some((a) => members.includes(a)),
    [allAccounts, members]
  );

  return (
    <div className={className}>
      <Summary summary={summary} />
      <Button.Group>
        <AddPreimage />
        <Submit
          isMember={isMember}
          members={members}
          palletReferenda={palletReferenda}
          tracks={tracks}
        />
      </Button.Group>
      {grouped.map(({ referenda, trackName }: ReferendaGroup) => (
        <Table
          empty={referenda && t<string>('No active referenda')}
          header={[
            [trackName || t('referenda'), 'start', 2],
            [undefined, undefined, 6]
          ]}
          key={
            trackName
              ? `track:${trackName}`
              : 'untracked'
          }
        >
          {referenda && referenda.map((r) => (
            <Referendum
              isMember={isMember}
              key={r.key}
              members={members}
              palletReferenda={palletReferenda}
              palletVote={palletVote}
              value={r}
            />
          ))}
        </Table>
      ))}
    </div>
  );
}

export default React.memo(Referenda);
