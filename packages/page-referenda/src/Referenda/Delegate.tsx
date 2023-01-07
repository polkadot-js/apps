// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda, PalletVote, TrackDescription } from '../types';

import React from 'react';

interface Props {
  palletReferenda: PalletReferenda;
  palletVote: PalletVote;
  tracks?: TrackDescription[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Delegate (_props: Props): React.ReactElement<Props> | null {
  return null;
}

export default React.memo(Delegate);
