// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachainInfo } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import { AvatarItem } from '@polkadot/react-components';

import { useTranslation } from './translate';
import { parachainName, parachainOwner } from './util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  info: DeriveParachainInfo | null;
  isBig?: boolean;
}

function ParachainInfo ({ children, className = '', info, isBig }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <AvatarItem
      className={className}
      icon={
        info?.icon
          ? <img src={info.icon} />
          : <i className='icon chain' />
      }
      isBig={isBig}
      subtitle={parachainOwner(t, info)}
      title={parachainName(t, info)}
    >
      {children}
    </AvatarItem>
  );
}

export default React.memo(styled(ParachainInfo)`
  & {
    .icon.chain {
      background: #e03997;
    }
  }
`);
