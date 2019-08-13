// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  className?: string;
}

class Card extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className } = this.props;

    return (
      <article className={`ui--Card ${className}`}>
        {children}
      </article>
    );
  }
}

export default styled(Card)`
  position: relative;
  flex: 1 1;
  min-width: 24%;
  justify-content: space-around;

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
