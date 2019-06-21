// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';

import translate from './translate';

type Props = I18nProps & {
  buttons?: React.ReactNode,
  children: React.ReactNode,
  className?: string,
  headerText?: string,
  emptyText?: string
};

type State = {
  isEmpty: boolean
};

class CardGrid extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps ({ children }: Props) {
    if (!children || (children as Array<any>).length <= 0) {
      return { isEmpty: true };
    }
    return { isEmpty: false };
  }

  render () {
    const { className } = this.props;
    const { isEmpty } = this.state;

    return (
      <div className={className}>
        {this.renderHeader()}
        {isEmpty ?
          this.renderEmpty() :
          this.renderGrid()
        }
      </div>
    );
  }

  renderHeader () {
    const { buttons, headerText } = this.props;
    const { isEmpty } = this.state;

    if (isEmpty && !headerText) {
      return null;
    }

    return (
      <div className='ui--CardGrid-header'>
        {headerText && (
          <h1>
            {headerText}
          </h1>
        )}
        {buttons && (
          <div className='ui--CardGrid-buttons'>
            {buttons}
          </div>
        )}
      </div>
    );
  }

  renderEmpty () {
    const { buttons, headerText, t } = this.props;

    const emptyText = this.props.emptyText || t('No items');

    if (headerText) {
      return (
        <div className='ui--CardGrid-grid'>
          <div className='ui--CardGrid-lowercase'>
            {emptyText}
          </div>
        </div>
      );
    }

    return (
      <div className='ui--CardGrid-empty'>
        <h2>
          {emptyText}
        </h2>
        {buttons && (
          <div className='ui--CardGrid-buttons'>
            {buttons}
          </div>
        )}
        <div className='ui--CardGrid-spacer' />
      </div>
    );
  }

  renderGrid () {
    const { children } = this.props;

    return (
      <div className='ui--CardGrid-grid'>
        {children}
        <div className='ui--CardGrid-spacer' />
        <div className='ui--CardGrid-spacer' />
        <div className='ui--CardGrid-spacer' />
      </div>
    );
  }
}

export default translate(
  styled(CardGrid as React.ComponentClass<Props, State>)`
    .ui--CardGrid-grid {
      display: flex;
      flex-wrap: wrap;

      > .ui--CardGrid-spacer {
        flex: 1 1;
        margin: 0.25rem;
        padding: 0 1.5rem;
      }
    }

    .ui--CardGrid-header {
      margin-bottom: 0.5rem;

      h1 {
        text-transform: lowercase;
        position: absolute;
      }
    }

    .ui--CardGrid-lowercase {
      text-transform: lowercase;
    }

    .ui--Card,
    .ui--CardGrid-spacer {
      flex: 1 1;
      min-width: 35rem;
      max-width: 71rem;
    }

    .ui--CardGrid-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 6rem 0;

      > h2 {
        margin-bottom: 2rem;
      }
    }
  }
`);
