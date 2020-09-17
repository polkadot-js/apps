// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Button from './Button';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  isDisabled?: boolean;
  label?: string;
  onClick: () => void;
  tabIndex?: number;
}

function ButtonCancel ({ className = '', isDisabled, label, onClick, tabIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Button
      className={className}
      icon='times'
      isDisabled={isDisabled}
      label={label || t<string>('Cancel')}
      onClick={onClick}
      tabIndex={tabIndex}
    />
  );
}

export default React.memo(ButtonCancel);
