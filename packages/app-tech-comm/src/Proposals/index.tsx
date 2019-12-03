// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { ComponentProps as Props } from '../types';

import React, { useState } from 'react';
import { Button, Table } from '@polkadot/react-components';

import Proposal from './Proposal';
import Propose from './Propose';
import translate from '../translate';

function Proposals ({ className, members, proposals, t }: Props): React.ReactElement<Props> {
  const [isProposeOpen, setIsProposeOpen] = useState(false);

  return (
    <div className={className}>
      <Button.Group>
        <Button
          isPrimary
          label={t('Propose a committee motion')}
          icon='add'
          onClick={(): void => setIsProposeOpen(true)}
        />
      </Button.Group>
      <Propose
        isOpen={isProposeOpen}
        memberCount={members?.length || 0}
        onClose={(): void => setIsProposeOpen(false)}
      />
      {proposals?.length
        ? (
          <Table>
            <Table.Body>
              {proposals?.map((hash: Hash): React.ReactNode => (
                <Proposal
                  hash={hash.toHex()}
                  key={hash.toHex()}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No committee proposals')
      }
    </div>
  );
}

export default translate(Proposals);
