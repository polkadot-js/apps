// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  canRegister?: boolean;
}

function Actions ({ canRegister }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [, toggleRegister] = useToggle();

  return (
    <Button.Group>
      <Button
        icon='plus'
        isDisabled={!canRegister}
        label={t<string>('Register')}
        onClick={toggleRegister}
      />
    </Button.Group>
  );
}

export default React.memo(Actions);
