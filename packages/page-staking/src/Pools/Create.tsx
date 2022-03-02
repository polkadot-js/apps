// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Create (): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [, toggleCreate] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        label={t<string>('Add pool')}
        onClick={toggleCreate}
      />
    </>
  );
}

export default React.memo(Create);
