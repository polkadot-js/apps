// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { Hash } from '@polkadot/types/interfaces';
import { ComponentProps } from '../types';

import React, { useState } from 'react';
import { Button, Table } from '@polkadot/react-components';

import translate from '../translate';
import Proposal from './Proposal';
import Propose from './Propose';

interface Props extends ComponentProps, I18nProps {}

function Proposals ({ className, members, proposals, t }: Props): React.ReactElement<Props> {
  const [isProposeOpen, setIsProposeOpen] = useState(false);
  const _toggleProposal = (): void => setIsProposeOpen(!isProposeOpen);

  return (
    <div className={className}>
      {isProposeOpen && (
        <Propose
          memberCount={members?.length}
          onClose={_toggleProposal}
        />
      )}
      <Button.Group>
        <Button
          isPrimary
          label={t('Submit proposal')}
          icon='add'
          onClick={_toggleProposal}
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

export default translate(Proposals);
