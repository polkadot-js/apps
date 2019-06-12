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
  emptyText?: string
};

class CardGrid extends React.PureComponent<Props> {
  render () {
    const { buttons, children, className } = this.props;

    if (!children || (children as Array<any>).length <= 0) {
      return this.empty();
    }

    return (
      <div className={className}>
        {buttons && (
          <div className='ui--CardGrid-buttons'>
            {buttons}
          </div>
        )}
        <div className='ui--CardGrid-grid'>
          {children}
          <div className='ui--CardGrid-spacer' />
          <div className='ui--CardGrid-spacer' />
          <div className='ui--CardGrid-spacer' />
        </div>
      </div>
    );
  }

  empty () {
    const { buttons, className, emptyText, t } = this.props;

    return (
      <div className={className}>
        <div className='ui--CardGrid-empty'>
          <h2>
            {emptyText || t('No items')}
          </h2>
          {buttons && (
            <div className='ui--CardGrid-buttons'>
              {buttons}
            </div>
          )}
          <div className='ui--CardGrid-spacer' />
        </div>
      </div>
    );
  }
}

export default translate(
  styled(CardGrid)`
    .ui--CardGrid-grid {
      display: flex;
      flex-wrap: wrap;

      > .ui--CardGrid-spacer {
        flex: 1 1;
        margin: 0.25rem;
        padding: 1 1.5rem;
      }
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
