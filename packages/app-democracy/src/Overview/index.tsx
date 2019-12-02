// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';

import translate from '../translate';
import Proposals from './Proposals';
import Referendums from './Referendums';
import Summary from './Summary';
import PreImage from './PreImage';
import Propose from './Propose';

function Overview ({ className, t }: Props): React.ReactElement {
  const [isPreimageOpen, setIsPreimageOpen] = useState(false);
  const [isProposeOpen, setIsProposeOpen] = useState(false);

  const _togglePreimage = (): void => setIsPreimageOpen(!isPreimageOpen);
  const _togglePropose = (): void => setIsProposeOpen(!isProposeOpen);

  return (
    <div className={className}>
      <Summary />
      <Button.Group>
        <Button
          icon='add'
          isPrimary
          label={t('Submit preimage')}
          onClick={_togglePreimage}
        />
        <Button.Or />
        <Button
          icon='add'
          isPrimary
          label={t('Submit proposal')}
          onClick={_togglePropose}
        />
      </Button.Group>
      {isPreimageOpen && (
        <PreImage onClose={_togglePreimage} />
      )}
      {isProposeOpen && (
        <Propose onClose={_togglePropose} />
      )}
      <Referendums />
      <Proposals />
    </div>
  );
}

export default translate(
  styled(Overview)`
    .proposalSection {
      margin-bottom: 1.5rem;
    }
  `
);
