// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveParachainInfo } from '@polkadot/api-derive/types';

import React from 'react';
import { AvatarItem, Icon } from '@polkadot/react-components';

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
          : (
            <Icon
              className='highlight--bg'
              icon='link'
            />
          )
      }
      isBig={isBig}
      subtitle={parachainOwner(t, info)}
      title={parachainName(t, info)}
    >
      {children}
    </AvatarItem>
  );
}

export default React.memo(ParachainInfo);
