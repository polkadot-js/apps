// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import Register from '../modals/Register';
import { useTranslation } from '../translate';

interface Props {
  canRegister?: boolean;
}

function Actions ({ canRegister }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [showRegister, toggleRegister] = useToggle();

  return (
    <>
      <Button.Group>
        <Button
          icon='plus'
          isDisabled={!canRegister || !api.tx.registrar?.registerParathread}
          label={t<string>('Register')}
          onClick={toggleRegister}
        />
      </Button.Group>
      {showRegister && (
        <Register onClose={toggleRegister} />
      )}
    </>
  );
}

export default React.memo(Actions);
