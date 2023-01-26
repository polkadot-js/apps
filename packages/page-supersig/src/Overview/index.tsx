// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import type { DeriveReferendumExt } from '@polkadot/api-derive/types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
//import Proposal from './Proposal';
// import Submission from '../Extrinsics/Submission';
// import NewSupersig from './NewSupersig';
import { useTranslation } from '../translate';
import Proposal from './ProposalModal';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isExtrinsicOpen, toggleExtrinsic] = useToggle();
  const [isProposalOpen, toggleProposal] = useToggle();
  const [, toggleNewSupersig] = useToggle();
  // const referendums = useCall<DeriveReferendumExt[]>(api.derive.democracy.referendums);

  return (
    <div className={className}>
      {/* <Summary /> */}
      <Button.Group>

        <Button
          icon='plus'
          label={t<string>('Create Supersig')}
          onClick={toggleNewSupersig}
        />
        <Button
          icon='plus'
          label={t<string>('Create Proposal')}
          onClick={toggleProposal}
        />

        {/* <Button
          icon='plus'
          label={t<string>('Create Extrinsic')}
          onClick={toggleExtrinsic}
        /> */}

      </Button.Group>
      {isProposalOpen && (
        <Proposal onClose={toggleProposal} />
      )}
      {/* {isExtrinsicOpen && (
        <Submission onClose={toggleExtrinsic} defaultValue={decoded}/>
      )} */}
      {/* {isNewSupersigOpen && (
        <NewSupersig onClose={toggleNewSupersig} />
      )} */}
    </div>
  );
}

export default React.memo(Overview);
