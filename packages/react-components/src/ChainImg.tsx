// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { chainLogos, emptyLogos, namedLogos, nodeLogos, specLogos } from '@polkadot/apps-config';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  isInline?: boolean;
  logo?: keyof typeof namedLogos;
  onClick?: () => any;
  withoutHl?: boolean;
}

function sanitize (value?: string): string {
  return value?.toLowerCase().replace('-', ' ') || '';
}

function ChainImg ({ className = '', isInline, logo, onClick, withoutHl }: Props): React.ReactElement<Props> {
  const { specName, systemChain, systemName } = useApi();
  const [isEmpty, img] = useMemo((): [boolean, string] => {
    const found = logo
      ? namedLogos[logo]
      : chainLogos[sanitize(systemChain)] || nodeLogos[sanitize(systemName)] || specLogos[sanitize(specName)];

    return [!found || logo === 'empty', (found || emptyLogos.empty) as string];
  }, [logo, specName, systemChain, systemName]);

  return (
    <img
      alt='chain logo'
      className={`${className}${(isEmpty && !withoutHl) ? ' highlight--bg' : ''}${isInline ? ' isInline' : ''}`}
      onClick={onClick}
      src={img}
    />
  );
}

export default React.memo(styled(ChainImg)`
  background: white;
  border-radius: 50%;
  box-sizing: border-box;

  &.isInline {
    display: inline-block;
    height: 24px;
    margin-right: 0.75rem;
    vertical-align: middle;
    width: 24px;
  }
`);
