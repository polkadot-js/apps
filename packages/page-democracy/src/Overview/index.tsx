// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import DispatchQueue from './DispatchQueue';
import Externals from './Externals';
import Proposals from './Proposals';
import Referendums from './Referendums';
import Summary from './Summary';
import PreImage from './PreImage';
import Propose from './Propose';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [isPreimageOpen, togglePreimage] = useToggle();
  const [isProposeOpen, togglePropose] = useToggle();

  return (
    <div className={className}>
      <Summary />
      <Button.Group>
        <Button
          icon='add'
          label={t('Submit preimage')}
          onClick={togglePreimage}
        />
        <Button.Or />
        <Button
          icon='add'
          label={t('Submit proposal')}
          onClick={togglePropose}
        />
      </Button.Group>
      {isPreimageOpen && (
        <PreImage onClose={togglePreimage} />
      )}
      {isProposeOpen && (
        <Propose onClose={togglePropose} />
      )}
      <Referendums />
      <Proposals />
      <DispatchQueue />
      <Externals />
    </div>
  );
}

export default React.memo(styled(Overview)`
  .proposalSection {
    margin-bottom: 1.5rem;
  }
`);
