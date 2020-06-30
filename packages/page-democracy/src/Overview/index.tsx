// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveReferendumExt } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

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

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isPreimageOpen, togglePreimage] = useToggle();
  const [isProposeOpen, togglePropose] = useToggle();
  const referendums = useCall<DeriveReferendumExt[]>(api.derive.democracy.referendums, []);

  return (
    <div className={className}>
      <Summary referendumCount={referendums?.length} />
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Submit preimage')}
          onClick={togglePreimage}
        />
        <Button
          icon='plus'
          label={t<string>('Submit proposal')}
          onClick={togglePropose}
        />
      </Button.Group>
      {isPreimageOpen && (
        <PreImage onClose={togglePreimage} />
      )}
      {isProposeOpen && (
        <Propose onClose={togglePropose} />
      )}
      <Referendums referendums={referendums} />
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
