// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Icon } from '@polkadot/react-components';
import styled from 'styled-components';

interface Props {
  className?: string;
  icon?: string;
  type: 'alert';
  upperCase?: boolean;
  value: string;
}

function InfoBox ({ className, icon, value }: Props): React.ReactElement<Props> {
  return (
    <article className={className}>
      { icon && <Icon icon={icon}
        size='2x' /> }
      <div>{value}</div>
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
    font-size: 0.72rem;
    line-height: 1rem;
    color: #E86F00;
    text-transform: ${(props) => props.upperCase ? 'uppercase' : 'none'};
    background: ${(props) => props.type === 'alert' ? 'rgba(232, 111, 0, 0.08)' : 'none'};

    & > .ui--Icon {
        margin-right: 0.8rem;
        height: auto;
        width: 16px;
    }
`;
