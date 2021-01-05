// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionsProps } from './types';

import React from 'react';
import { Modal as SUIModal } from 'semantic-ui-react';

import Button from '../Button';
import ButtonCancel from '../ButtonCancel';

function Actions ({ cancelLabel, children, className = '', onCancel }: ActionsProps): React.ReactElement<ActionsProps> {
  return (
    <SUIModal.Actions>
      <Button.Group className={className}>
        <ButtonCancel
          label={cancelLabel}
          onClick={onCancel}
        />
        {children}
      </Button.Group>
    </SUIModal.Actions>
  );
}

export default React.memo(Actions);
