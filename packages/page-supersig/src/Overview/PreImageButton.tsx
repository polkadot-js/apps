// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash, Proposal } from '@polkadot/types/interfaces';

import React from 'react';

interface Props {
  className?: string;
  imageHash: Hash | string;
  proposal?: Proposal | null;
  isImminent?: boolean;
}

function PreImageButton (props: Props): React.ReactElement<Props> {
  return <div>ProposalCell Component</div>;
}

export default React.memo(PreImageButton);
