// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Icon } from '@polkadot/react-components';
import styled from 'styled-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  icon?: string;
  type: 'alert';
  upperCase?: boolean;
  value: string;
}

function InfoBox ({ className, icon, type, upperCase = false, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <article className={`${className || ''} ui--InfoBox-${type}${upperCase ? ' ui--InfoBox-upperCase' : ''}`}>
      { icon && <Icon icon={icon} /> }
      <div>{t<string>(value)}</div>
    </article>
  );
}

export default styled(InfoBox)`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.7rem 0.9rem 0.6rem;
    margin: 0 0 16px;
    border: 0;
    border-radius: 4px;
    font-weight: 800;
    font-size: 0.71rem;
    line-height: 1rem;
    color: #E86F00;

    &.ui--InfoBox-alert {
        background: rgba(232, 111, 0, 0.08);
    }

    &.ui--InfoBox-upperCase {
        text-transform: uppercase;
    }

    & > .ui--Icon {
        margin-right: 0.8rem;
    }
`;
