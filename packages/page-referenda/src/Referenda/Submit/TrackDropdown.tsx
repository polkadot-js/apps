// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { PalletReferenda, TrackDescription } from '../../types';
import type { TrackOption } from './types';

import React from 'react';
import styled from 'styled-components';

import { Dropdown } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import { getTrackInfo, getTrackName } from '../../util';
import useTrackOptions from './useTrackOptions';

interface Props {
  className?: string;
  onChange: (trackId?: number) => void;
  palletReferenda: PalletReferenda;
  tracks: TrackDescription[];
}

export function getTrackOptions (api: ApiPromise, specName: string, palletReferenda: string, tracks: TrackDescription[]): TrackOption[] | undefined {
  return tracks.map(({ id, info }): TrackOption => {
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
  const trackOpts = useTrackOptions(palletReferenda, tracks);

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

export default React.memo(styled(TrackDropdown)`
  .trackOption {
    .faded {
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-normal);
      margin-top: 0.125rem;
      opacity: 0.6;
    }
  }
`);
