// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { UniqueInfo } from '../types';

import React from 'react';

import { Button } from '@polkadot/react-components';

import Uniques from './Uniques';
import Create from './Create';
import Summary from './Summary';

interface Props {
  className?: string;
  ids?: BN[];
  infos?: UniqueInfo[];
  openId: BN;
}

function Overview ({ ids, infos, openId }: Props): React.ReactElement<Props> {
  return (
    <div>
      <Summary numUniques={ids?.length} />
      <Button.Group>
        <Create
          uniqueIds={ids}
          openId={openId}
        />
      </Button.Group>
      <Uniques infos={infos} />
    </div>
  );
}

export default React.memo(Overview);
