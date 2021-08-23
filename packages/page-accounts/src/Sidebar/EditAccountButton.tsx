// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/app-accounts/translate';
import Button from '@polkadot/react-components/Button';

interface Props {
  className?: string;
  isEditing: () => boolean;
  onClick: () => void;
}

function EditAccountButton ({ className = '', isEditing, onClick }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const buttonText = isEditing() ? 'Save' : 'Edit account';

  return (
    <Button
      className={className}
      icon={'edit'}
      label={t<string>(buttonText)}
      onClick={onClick}
    />
  );
}

export default React.memo(styled(EditAccountButton)`
  cursor: pointer;
  margin-top: 1.25rem;
  border-radius: 4px;
  border: 1px solid #DFDFDF;

  .editSpan {
    white-space: nowrap;
  }
`);
