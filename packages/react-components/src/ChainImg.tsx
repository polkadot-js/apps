// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { chainLogos, emptyLogo, namedLogos, nodeLogos } from '@polkadot/apps-config/ui/logos';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  logo?: keyof typeof namedLogos;
  onClick?: () => any;
}

function sanitize (value?: string): string {
  return value?.toLowerCase().replace('-', ' ') || '';
}

function ChainImg ({ className = '', logo, onClick }: Props): React.ReactElement<Props> {
  const { systemChain, systemName } = useApi();
  const [isEmpty, img] = useMemo((): [boolean, string] => {
    const found: unknown = namedLogos[logo || ''] || chainLogos[sanitize(systemChain)] || nodeLogos[sanitize(systemName)];

    return [!found || logo === 'empty', (found || emptyLogo) as string];
  }, [logo, systemChain, systemName]);

  return (
    <img
      alt='chain logo'
      className={`${className}${isEmpty ? ' highlight--bg' : ''}`}
      onClick={onClick}
      src={img}
    />
  );
}

export default React.memo(styled(ChainImg)`
  background: white;
  border-radius: 50%;
  box-sizing: border-box;
`);
