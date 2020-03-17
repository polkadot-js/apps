// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
function ButtonCancel ({ className, isDisabled, label, onClick, tabIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Button
      className={className}
      icon='cancel'
      isDisabled={isDisabled}
      isNegative
      label={label || t('Cancel')}
      onClick={onClick}
      tabIndex={tabIndex}
    />
  );
}

export default React.memo(ButtonCancel);
