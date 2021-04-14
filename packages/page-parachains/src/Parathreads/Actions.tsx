// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import RegisterThread from './RegisterThread';

interface Props {
  className?: string;
}

function Actions ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isRegisterOpen, toggleRegisterOpen] = useToggle();

  return (
    <Button.Group className={className}>
      <Button
        icon='plus'
        label={t<string>('Register')}
        onClick={toggleRegisterOpen}
      />
      {isRegisterOpen && (
        <RegisterThread onClose={toggleRegisterOpen} />
      )}
    </Button.Group>
  );
}

export default React.memo(Actions);
