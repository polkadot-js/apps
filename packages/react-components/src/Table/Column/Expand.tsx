// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ColExpandProps as Props } from '../types';

import React from 'react';
import styled from 'styled-components';

import Icon from '../../Icon';

function Expand ({ className = '', isExpanded, toggle }: Props): React.ReactElement<Props> {
  return (
    <td
      className={`ui--Table-Column-Expand ${className}`}
      onClick={toggle}
    >
      <div>
        <Icon
          icon={
            isExpanded
              ? 'caret-up'
              : 'caret-down'
          }
        />
      </div>
    </td>
  );
}

export default React.memo(styled(Expand)`
  && {
    cursor: pointer;
    min-width: 1.7rem;
    padding-left: 0;
    text-align: left;
    width: 1.7rem;

    > div {
      align-items: center;
      border: 1px solid var(--border-table);
      border-radius: 4px;
      box-sizing: border-box;
      display: inline-flex;
      height: 1.7rem;
      justify-content: center;
      width: 1.7rem;
    }
  }
`);
