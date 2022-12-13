// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PalletReferenda, PalletVote, ReferendaGroup, TrackDescription } from '../types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

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

  const trackInfo = useMemo(
    () => getTrackInfo(api, specName, palletReferenda, tracks, trackId?.toNumber()),
    [api, specName, palletReferenda, tracks, trackId]
  );

  return (
    <Table
      className={className}
      empty={referenda && t<string>('No active referenda')}
      header={[
        [trackName ? <>{trackName}<div>{trackInfo?.text}</div></> : t('referenda'), 'start', 7],
        [undefined, undefined, 3]
      ]}
      key={
        trackName
          ? `track:${trackName}`
          : 'untracked'
      }
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
`);
