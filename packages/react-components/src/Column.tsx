// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Collection, { CollectionProps, CollectionState, collectionStyles } from './Collection';

import translate from './translate';

type Props = CollectionProps;

type State = CollectionState;

class Column extends Collection<Props, State> {
  public render (): React.ReactNode {
    const { className } = this.props;
    const { isEmpty } = this.state;

    return (
      <div className={`ui--Column ${className}`}>
        {this.renderHeader()}
        {isEmpty && this.renderEmpty()}
        {this.renderCollection()}
      </div>
    );
  }

  public renderCollection (): React.ReactNode {
    const { children } = this.props;

    return children;
  }

  // renderEmpty () {
  //   const { emptyText } = this.props;
  //   return (
  //     <article className='container'>
  //       {emptyText}
  //     </article>
  //   );
  // }
}

export default translate(
  styled(Column as React.ComponentClass<Props, State>)`
    ${collectionStyles}

    box-sizing: border-box;
    max-width: 100%;
    flex: 1 1;
    margin: 0;
    padding: 0.5rem;

    .container {
      margin: 0;
      padding: 0;

      article {
        border: none;
        margin: 0;
      }

      article+article {
        border-top: 1px solid #f2f2f2;
      }
    }

    @media (min-width: 1025px) {
      max-width: 50%;
      min-width: 50%;
    }
  `
);
