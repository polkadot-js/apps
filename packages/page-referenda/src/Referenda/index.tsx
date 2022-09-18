// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda, PalletVote } from '../types';

import React, { useMemo, useRef } from 'react';

import AddPreimage from '@polkadot/app-preimages/Preimages/Add';
import { Button, Table } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

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
  const [referenda, tracks] = useReferenda(palletReferenda);
  const summary = useSummary(palletReferenda, referenda);
  const [isSubmitOpen, toggleSubmit] = useToggle();

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
      <Button.Group>
        <AddPreimage />
        {tracks && (
          <>
            <Button
              icon='plus'
              isDisabled={!isMember}
              label={t<string>('Submit proposal')}
              onClick={toggleSubmit}
            />
            {isSubmitOpen && (
              <Submit
                members={members}
                onClose={toggleSubmit}
                palletReferenda={palletReferenda}
                tracks={tracks}
              />
            )}
          </>
        )}
      </Button.Group>
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
