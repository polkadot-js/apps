// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Button } from '@polkadot/react-components';

import TipCreate from './TipCreate';
import Tips from './Tips';

interface Props {
  className?: string;
  hashes?: string[] | null;
  isMember: boolean;
  members: string[];
  trigger: () => void;
}

function TipsEntry ({ className, hashes, isMember, members, trigger }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Button.Group>
        <TipCreate
          members={members}
          refresh={trigger}
        />
      </Button.Group>
      <Tips
        hashes={hashes}
        isMember={isMember}
        members={members}
      />
    </div>
  );
}

export default React.memo(TipsEntry);
