// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveReferendumExt } from '@polkadot/api-derive/types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Externals from './Externals.js';
import PreImage from './PreImage.js';
import Proposals from './Proposals.js';
import Propose from './Propose.js';
import Referendums from './Referendums.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isPreimageOpen, togglePreimage] = useToggle();
  const [isProposeOpen, togglePropose] = useToggle();
  const referendums = useCall<DeriveReferendumExt[]>(api.derive.democracy.referendums);

  return (
    <div className={className}>
      <Summary referendumCount={referendums?.length} />
      <Button.Group>
        {api.tx.democracy.notePreimage && (
          <Button
            icon='plus'
            label={t('Submit preimage')}
            onClick={togglePreimage}
          />
        )}
        <Button
          icon='plus'
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
      <Referendums referendums={referendums} />
      <Proposals />
      <Externals />
    </div>
  );
}

export default React.memo(Overview);
