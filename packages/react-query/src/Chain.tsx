// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

function Chain ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { systemChain } = useApi();

  return (
    <div className={className}>
      {label || ''}{systemChain || t('Unknown')}{children}
    </div>
  );
}

export default React.memo(Chain);
