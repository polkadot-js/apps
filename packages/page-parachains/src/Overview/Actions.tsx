// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import RegisterThread from './RegisterThread';

interface Props {
  className?: string;
}

function Actions ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isRegisterOpen, toggleRegisterOpen] = useToggle();

  return (
    <Button.Group className={className}>
      {api.tx.registrar?.register && (
        <>
          <Button
            icon='plus'
            label={t<string>('Register')}
            onClick={toggleRegisterOpen}
          />
          {isRegisterOpen && (
            <RegisterThread onClose={toggleRegisterOpen} />
          )}
        </>
      )}
    </Button.Group>
  );
}

export default React.memo(Actions);
