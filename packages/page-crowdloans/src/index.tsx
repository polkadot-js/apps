// Copyright 2017-2021 @polkadot/app-crowdloans authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
}

function CrowdloansApp ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <main className={className}>
      {t<string>('Nothing here yet...')}
    </main>
  );
}

export default React.memo(styled(CrowdloansApp)``);
