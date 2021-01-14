// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';

import Propose from '../modals/Propose';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Actions (): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [showPropose, togglePropose] = useToggle();

  return (
    <>
      <Button.Group>
        {api.query.proposeParachain && (
          <Button
            icon='plus'
            isDisabled={!hasAccounts}
            label={t<string>('Propose')}
            onClick={togglePropose}
          />
        )}
      </Button.Group>
      {showPropose && (
        <Propose onClose={togglePropose} />
      )}
    </>
  );
}

export default React.memo(Actions);
