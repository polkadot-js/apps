// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Summary from './Summary';
import { useTranslation } from './translate';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [, toggleAddFund] = useToggle();

  return (
    <div className={className}>
      <Summary />
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Add campaign')}
          onClick={toggleAddFund}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Overview);
