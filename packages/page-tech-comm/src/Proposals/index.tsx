// Copyright 2017-2022 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { ComponentProps } from '../types';

import React, { useRef } from 'react';

import { Button, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Proposal from './Proposal';
import Propose from './Propose';

interface Props extends ComponentProps {
  defaultProposal?: SubmittableExtrinsicFunction<'promise'>;
  defaultThreshold?: number;
  filter?: (section: string, method?: string) => boolean;
}

function Proposals ({ className = '', defaultProposal, defaultThreshold, filter, isMember, members, prime, proposalHashes, type }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('proposals'), 'start', 2],
    [t('threshold')],
    [t('voting end')],
    [t('aye'), 'address'],
    [t('nay'), 'address'],
    []
  ]);

  return (
    <div className={className}>
      <Button.Group>
        <Propose
          defaultThreshold={defaultThreshold}
          defaultValue={defaultProposal}
          filter={filter}
          isMember={isMember}
          members={members}
          type={type}
        />
      </Button.Group>
      <Table
        empty={proposalHashes && t<string>('No committee proposals')}
        header={headerRef.current}
      >
        {proposalHashes?.map((hash: Hash): React.ReactNode => (
          <Proposal
            imageHash={hash}
            isMember={isMember}
            key={hash.toHex()}
            members={members}
            prime={prime}
            type={type}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Proposals);
