// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { PalletReferenda, TrackDescription } from '../../types';
import type { TrackOption } from './types';

import React, { useMemo } from 'react';

import { Dropdown } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import { getTrackInfo, getTrackName } from '../../util';

interface Props {
  className?: string;
  onChange: (trackId?: number) => void;
  palletReferenda: PalletReferenda;
  tracks?: TrackDescription[];
}

export function getTrackOptions (api: ApiPromise, specName: string, palletReferenda: string, tracks?: TrackDescription[]): TrackOption[] | undefined {
  return tracks && tracks.map(({ id, info }): TrackOption => {
    const trackInfo = getTrackInfo(api, specName, palletReferenda, tracks, id.toNumber());
    const trackName = getTrackName(id, info);

    return {
      text: trackInfo?.text
        ? (
          <div className='trackOption'>
            <div className='normal'>{trackName}</div>
            <div className='faded'>{trackInfo.text}</div>
          </div>
        )
        : trackName,
      value: id.toNumber()
    };
  });
}

function TrackDropdown ({ className, onChange, palletReferenda, tracks }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, specName } = useApi();

  const trackOpts = useMemo(
    () => getTrackOptions(api, specName, palletReferenda, tracks) || null,
    [api, palletReferenda, specName, tracks]
  );

  return trackOpts && (
    <Dropdown
      className={className}
      defaultValue={trackOpts[0] && trackOpts[0].value}
      label={t<string>('submission track')}
      onChange={onChange}
      options={trackOpts}
    />
  );
}

export default React.memo(TrackDropdown);
