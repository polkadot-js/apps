// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Labelled from '../Labelled';

interface Props {
  children: React.ReactNode;
  className?: string;
  help?: React.ReactNode;
  label: React.ReactNode;
  withLabel?: boolean;
}

function LinkedWrapper ({ children, className = '', help, label, withLabel }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Labelled
        help={help}
        label={label}
        withLabel={withLabel}
      >
        <div className='ui--DropdownLinked ui--row'>
          {children}
        </div>
      </Labelled>
    </div>
  );
}

export default React.memo(styled(LinkedWrapper)`
  .ui--DropdownLinked-Items {
    .text {
      box-sizing: border-box;
      display: flex !important;
      flex-wrap: nowrap;
      justify-content: space-between;
      overflow: hidden;
      position: relative;
      width: 100%;
      white-space: nowrap;
    }

    > .text {
      padding-left: 1em;
    }
  }

  .ui--DropdownLinked-Item-text,
  .ui--DropdownLinked-Item-call {
    display: inline-block;
  }

  .ui--DropdownLinked-Item-call {
    flex: 1 0;
    margin-right: 1rem;
    text-align: left;
    text-overflow: ellipsis;
  }

  .ui--DropdownLinked-Item-text {
    flex: 1;
    opacity: 0.5;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }
`);
