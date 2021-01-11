// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import Propose from '../modals/Propose';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Actions (): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [showPropose, togglePropose] = useToggle();

  return (
    <>
      <Button.Group>
        {api.query.proposeParachains && (
          <Button
            icon='plus'
            isDisabled={true}
            label={t<string>('Register')}
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
