// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { ComponentProps as Props } from '../types';

import React from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Proposal from './Proposal';
import Propose from './Propose';

export default function Proposals ({ className, members, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isProposeOpen, togglePropose] = useToggle(false);

  return (
    <div className={className}>
      {isProposeOpen && (
        <Propose
          memberCount={members?.length}
          onClose={togglePropose}
        />
      )}
      <Button.Group>
        <Button
          isPrimary
          label={t('Submit proposal')}
          icon='add'
          onClick={togglePropose}
        />
      </Button.Group>
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
