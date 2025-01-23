// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PalletReferenda, TrackDescription } from '../../types.js';

import React from 'react';

import { Dropdown, styled } from '@polkadot/react-components';

import { useTranslation } from '../../translate.js';
import useTrackOptions from './useTrackOptions.js';

interface Props {
  className?: string;
  exclude?: (BN | number)[];
  include?: (BN | number)[];
  onChange: (trackId: number) => void;
  palletReferenda: PalletReferenda;
  tracks: TrackDescription[];
}

function TrackDropdown ({ className, exclude, include, onChange, palletReferenda, tracks }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const trackOpts = useTrackOptions(palletReferenda, tracks, include, exclude);

  return (
    <Dropdown
      className={className}
      defaultValue={trackOpts[0].value}
      label={t('submission track')}
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
