// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda, TrackDescription, TrackInfoExt } from '../../types';
import type { VoteResultItem } from './types';

import React, { useMemo } from 'react';

import { MarkWarning } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import { getTrackInfo } from '../../util';

interface Props {
  className?: string;
  palletReferenda: PalletReferenda;
  trackId: number;
  tracks: TrackDescription[];
  value?: VoteResultItem[] | null | false;
}

function Activity ({ className, palletReferenda, tracks, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, specName } = useApi();

  const infos = useMemo(
    () => value && value.map((v): [VoteResultItem, TrackInfoExt | undefined] =>
      [v, getTrackInfo(api, specName, palletReferenda, tracks, v.classId.toNumber())]
    ),
    [api, palletReferenda, specName, tracks, value]
  );

  if (!infos) {
    return null;
  }

  return (
    <div className={className}>
      {infos.length
        ? (
          <ul>
            {infos.map(([{ classId, delegating }, info], index) => (
              <li key={index}>
                {(info && info.trackName) || classId.toString()}{delegating && '/delegating'}
              </li>
            ))}
          </ul>
        )
        : <MarkWarning content={t<string>('This account has no voting/delating activity in the chain state')} />
      }
      {infos.some(([{ delegating }]) => delegating) && (
        <MarkWarning content={t<string>('This account has some delegations in itself')} />
      )}
    </div>
  );
}

export default React.memo(Activity);
