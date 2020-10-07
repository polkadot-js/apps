// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionsProps } from './types';

import React from 'react';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

import Button from '../Button';

import { useTranslation } from '../translate';

function Actions ({ cancelLabel, children, className, onCancel }: ActionsProps): React.ReactElement<ActionsProps> {
  const { t } = useTranslation();

  return (
    <SUIModal.Actions>
      <Button.Group className={className}>
        <Button
          label={cancelLabel || t<string>('Cancel')}
          onClick={onCancel}
        />
        {children}
      </Button.Group>
    </SUIModal.Actions>
  );
}

export default React.memo(Actions);
