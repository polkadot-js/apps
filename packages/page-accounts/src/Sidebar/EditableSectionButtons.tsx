// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/app-accounts/translate';
import { Button } from '@polkadot/react-components';

interface Props {
  className?: string;
  isEditing: () => boolean; onCancel: () => void; onClick: () => void
}

function EditableSectionButtons ({ className = '', isEditing, onCancel, onClick }: Props) {
  const { t } = useTranslation();

  return (
    <div className={`${className} ${isEditing() ? 'isEditing' : ''}`}>
      {isEditing()
        ? (
          <>
            <Button
              label={t<string>('Cancel')}
              onClick={onCancel}
            />
            <Button
              label={t<string>('Save')}
              onClick={onClick}
            />
          </>
        )
        : (
          <Button
            label={t<string>('Edit account')}
            onClick={onClick}
          />
        )
      }
    </div>
  );
}

export default React.memo(styled(EditableSectionButtons)`
  display: flex;
  justify-content: space-between;
  width: 100%;

  .ui--Button {
    margin-top: 1.5rem;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #DFDFDF;
  }

  &.isEditing .ui--Button {
    width: 48%;
  }
`);
