// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { useLocation } from 'react-router-dom';

import { Button } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Candidates from '../Candidates';
import SubmitCandidacy from '../Candidates/SubmitCandidacy';
import Vote from '../Candidates/Vote';
import Members from './Members';
import Summary from './Summary';
import useElectionsInfo from '../useElectionsInfo';

import translate from '../translate';

interface Props extends I18nProps {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { pathname } = useLocation();
  const componentProps = useElectionsInfo(api);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);

  return (
    <div className={className}>
      <Summary
        bestNumber={bestNumber}
        electionsInfo={componentProps.electionsInfo}
      />
      {pathname === '/council/candidates' && (
        <Button.Group>
          <SubmitCandidacy electionsInfo={componentProps.electionsInfo} />
          <Button.Or />
          <Vote electionsInfo={componentProps.electionsInfo} />
        </Button.Group>
      )}
      <Members
        {...componentProps}
        className={pathname === '/council' ? '' : 'council--hidden'}
      />
      <Candidates
        {...componentProps}
        className={pathname === '/council' ? 'council--hidden' : ''}
      />
    </div>
  );
}

export default translate(Overview);
