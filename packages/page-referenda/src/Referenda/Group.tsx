// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PalletReferenda, PalletVote, ReferendaGroup, TrackDescription } from '../types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { ExpandButton, Table } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { getTrackInfo } from '../util';
import Referendum from './Referendum';

interface Props extends ReferendaGroup {
  activeIssuance?: BN;
  className?: string;
  isMember: boolean;
  members?: string[];
  palletReferenda: PalletReferenda;
  palletVote: PalletVote;
  ranks?: BN[];
  tracks?: TrackDescription[] | undefined;
}

function Group ({ activeIssuance, className, isMember, members, palletReferenda, palletVote, ranks, referenda, trackId, trackName, tracks }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, specName } = useApi();
  const [isExpanded, toggleExpanded] = useToggle();

  const trackInfo = useMemo(
    () => getTrackInfo(api, specName, palletReferenda, tracks, trackId?.toNumber()),
    [api, specName, palletReferenda, tracks, trackId]
  );

  const [headerButton, headerChildren] = useMemo(
    () => [
      false && trackInfo && (
        <ExpandButton
          expanded={isExpanded}
          onClick={toggleExpanded}
        />
      ),
      isExpanded && trackInfo && (
        <tr>
          <th colSpan={9}>Hello expanded</th>
        </tr>
      )
    ],
    [isExpanded, toggleExpanded, trackInfo])

  const [header, key] = useMemo(
    () => [
      [
        [trackName ? <>{trackName}<div>{trackInfo?.text}</div></> : t('referenda'), 'start', 5],
        [undefined, 'number', 3],
        [headerButton]
      ],
      trackName
        ? `track:${trackName}`
        : 'untracked'
    ],
    [headerButton, t, trackInfo, trackName]
  );

  return (
    <Table
      className={className}
      empty={referenda && t<string>('No active referenda')}
      header={header}
      headerChildren={headerChildren}
      key={key}
      withCollapsibleRows
    >
      {referenda && referenda.map((r) => (
        <Referendum
          activeIssuance={activeIssuance}
          isMember={isMember}
          key={r.key}
          members={members}
          palletReferenda={palletReferenda}
          palletVote={palletVote}
          ranks={ranks}
          trackInfo={trackInfo}
          value={r}
        />
      ))}
    </Table>
  );
}

export default React.memo(styled(Group)`
  th > h1 > div {
    display: inline-block;
    font-size: 1rem;
    padding-left: 1.5rem;
    text-overflow: ellipsis;
  }

  th.number h1 {
    display: inline-block;
    opacity: 0.75;
  }
`);
