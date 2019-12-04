// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React, { useState } from 'react';
import { Button } from '@polkadot/react-components';

import translate from '../translate';
import Propose from '../Proposals/Propose';
import Members from './Members';
import Summary from './Summary';

interface Props extends I18nProps, ComponentProps {}

function Overview ({ className, members, proposals, t }: Props): React.ReactElement<Props> {
  const [isProposeOpen, setIsProposeOpen] = useState(false);
  const _toggleProposal = (): void => setIsProposeOpen(!isProposeOpen);

  return (
    <div className={className}>
      <Summary
        members={members}
        proposals={proposals}
      />
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
      <Members members={members} />
    </div>
  );
}

export default translate(Overview);
