// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PalletReferenda, PalletVote, ReferendaGroup } from '../types.js';

import React, { useMemo, useState } from 'react';

import AddPreimage from '@polkadot/app-preimages/Preimages/Add';
import { Button, Dropdown, styled } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import useReferenda from '../useReferenda.js';
import useSummary from '../useSummary.js';
import Delegate from './Delegate/index.js';
import Submit from './Submit/index.js';
import Group from './Group.js';
import Summary from './Summary.js';

export { useCounterNamed as useCounter } from '../useCounter.js';

interface Props {
  className?: string;
  isConvictionVote?: boolean;
  members?: string[];
  palletReferenda: PalletReferenda;
  palletVote: PalletVote;
  ranks?: BN[];
}

function Referenda ({ className, isConvictionVote, members, palletReferenda, palletVote, ranks }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const totalIssuance = useCall<BN | undefined>(api.query.balances.totalIssuance);
  const inactiveIssuance = useCall<BN | undefined>(api.query.balances.inactiveIssuance);
  const { allAccounts } = useAccounts();
  const [grouped, tracks] = useReferenda(palletReferenda);
  const summary = useSummary(palletReferenda, grouped);
  const [trackSelected, setTrackSelected] = useState(-1);

  const activeIssuance = useMemo(
    () => totalIssuance?.sub(inactiveIssuance || BN_ZERO),
    [inactiveIssuance, totalIssuance]
  );

  const trackOpts = useMemo(
    () => [{ text: t('All active/available tracks'), value: -1 }].concat(
      grouped
        .map(({ trackId, trackName }) => ({
          text: trackName,
          value: trackId ? trackId.toNumber() : -1
        }))
        .filter((v): v is { text: string, value: number } => !!v.text)
    ),
    [grouped, t]
  );

  const filtered = useMemo(
    () => (
      trackSelected === -1
        ? grouped
        : grouped.filter(({ trackId }) => !!trackId && trackId.eqn(trackSelected))
    ) || [{ referenda: [] }],
    [grouped, trackSelected]
  );

  const isMember = useMemo(
    () => !members || allAccounts.some((a) => members.includes(a)),
    [allAccounts, members]
  );

  return (
    <StyledDiv className={className}>
      <Summary
        issuanceActive={activeIssuance}
        issuanceInactive={inactiveIssuance}
        issuanceTotal={totalIssuance}
        summary={summary}
        withIssuance={isConvictionVote}
      />
      <Button.Group>
        <Dropdown
          className='topDropdown media--800'
          label={t('selected track')}
          onChange={setTrackSelected}
          options={trackOpts}
          value={trackSelected}
        />
        {isConvictionVote && (
          <Delegate
            palletReferenda={palletReferenda}
            palletVote={palletVote}
            tracks={tracks}
          />
        )}
        <AddPreimage />
        <Submit
          isMember={isMember}
          members={members}
          palletReferenda={palletReferenda}
          tracks={tracks}
        />
      </Button.Group>
      {filtered.map(({ key, referenda, trackId, trackName }: ReferendaGroup) => (
        <Group
          activeIssuance={activeIssuance}
          isMember={isMember}
          key={key}
          members={members}
          palletReferenda={palletReferenda}
          palletVote={palletVote}
          ranks={ranks}
          referenda={referenda}
          trackId={trackId}
          trackName={trackName}
          tracks={tracks}
        />
      ))}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--Dropdown.topDropdown {
    min-width: 25rem;
    padding-left: 0;

    > label {
      left: 1.55rem !important;
    }
  }
`;

export default React.memo(Referenda);
