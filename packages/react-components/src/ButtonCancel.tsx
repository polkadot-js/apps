// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Button from './Button';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  onClick: () => void;
}

export default function ButtonCancel ({ className, onClick }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Button
      className={className}
      icon='cancel'
      isNegative
      label={t('Cancel')}
      onClick={onClick}
    />
  );
}
