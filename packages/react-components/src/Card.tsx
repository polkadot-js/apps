// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { classes } from './util';

interface Props {
  children: React.ReactNode;
  className?: string;
  isError?: boolean;
  isSuccess?: boolean;
  withBottomMargin?: boolean;
}

function Card ({ children, className, isError, isSuccess, withBottomMargin }: Props): React.ReactElement<Props> {
  return (
    <article className={classes('ui--Card', className, (isError && !isSuccess) && 'error', (!isError && isSuccess) && 'success', withBottomMargin && 'withBottomMargin')}>
      {children}
    </article>
  );
}

export default styled(Card)`
  position: relative;
  flex: 1 1;
  min-width: 24%;
  justify-content: space-around;

  &.error {
    background: rgba(255, 0, 0, 0.05);

    &, h1, h2, h3, h4, h5, h6, p {
      color: rgba(156, 0, 0) !important;
    }
  }

  &.success {
    border: 1px solid rgb(168, 255, 136);
    background: rgba(0, 255, 0, 0.05);

    &, h1, h2, h3, h4, h5, h6, p {
      color: rgba(34, 125, 0) !important;
    }
  }

  &.withBottomMargin {
    margin-bottom: 1.5rem;
  }

  i.help.circle.icon,
  .ui.button.mini,
  .ui.button.tiny,
  .addTags {
    visibility: hidden;
  }

  &:hover {
    i.help.circle.icon,
    .ui.button.mini,
    .ui.button.tiny,
    .addTags {
      visibility: visible;
    }
  }

  .ui--AddressSummary-buttons {
    text-align: right;
    margin-bottom: 2em;

    button {
      margin-left: 0.2em;
    }
  }
`;
