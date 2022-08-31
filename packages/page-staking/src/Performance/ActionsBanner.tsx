// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { MarkWarning } from '@polkadot/react-components';

import { useTranslation } from '../translate';

function ActionsBanner (): React.ReactElement {
  const { t } = useTranslation();

  const AlephZeroRotatingCommitteeInfo = 'https://alephzero.org/blog/fundamentals-rotating-committees/';

  return (
    <MarkWarning
      className='warning centered'
      content={<>
        {'Performance of a validator is calculated based on ratio of blocks created in given session to expected number of blocks produced in a said session. See more info '}
        {<a
          href={AlephZeroRotatingCommitteeInfo}
          rel='noopener noreferrer'
          target='_blank'
        >{'here.'}</a>}
      </>}
    />
  );
}

export default React.memo(ActionsBanner);
