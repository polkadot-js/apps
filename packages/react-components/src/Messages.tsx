// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { classes } from '@canvas-ui/react-util';
import React from 'react';
import styled from 'styled-components';

import { Abi } from '@polkadot/api-contract';

import Message from './Message';
import { BareProps } from './types';

interface Props extends BareProps {
  abi: Abi;
  address?: string;
  isLabelled?: boolean;
  isRemovable: boolean;
  onRemove?: () => void;
  onSelect?: (messageIndex: number) => () => void;
  onSelectConstructor?: (constructorIndex: number) => void;
  withConstructors?: boolean;
}

function Messages (props: Props): React.ReactElement<Props> {
  const { abi: { constructors, messages }, className = '', isLabelled, /* isRemovable, onRemove = NOOP, */ withConstructors } = props;

  return (
    <div className={classes(className, 'ui--Messages', isLabelled && 'labelled')}>
      {withConstructors && constructors.map((constructor, index): React.ReactNode => ((
        <Message
          isConstructor
          key={`constructor-${index}`}
          message={constructor}
        />
      )))}
      {messages.map((message, index): React.ReactNode => ((
        <Message
          isConstructor
          key={`message-${index}`}
          message={message}
        />
      )))}
    </div>
  );
}

export default React.memo(styled(Messages)`
  .remove-abi {
    float: right;

    &:hover, &:hover :not(i) {
      text-decoration: underline;
    }
  }
`);
