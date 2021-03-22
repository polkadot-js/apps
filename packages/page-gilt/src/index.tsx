// Copyright 2017-2021 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
}

function GiltApp ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return <div className={className}>{t<string>('gilts')}</div>;
}

export default React.memo(GiltApp);
