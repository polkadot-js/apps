// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';

export interface CollectionProps extends I18nProps {
  banner?: React.ReactNode;
  buttons?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerText?: React.ReactNode;
  isEmpty?: boolean;
  emptyText?: React.ReactNode;
  showEmptyText?: boolean;
}

export interface CollectionState {
  isEmpty: boolean;
  showHeader?: boolean;
}

export const collectionStyles = `
  .ui--Collection-header {
    display: flex;
    margin-bottom: 0.5rem;
    min-height: 2.75rem;

    h1 {
      flex: 1 1;
      margin: 0;
      text-transform: lowercase;
    }
  }

  .ui--Collection-lowercase {
    text-transform: lowercase;
  }
`;

export default class Collection<P extends CollectionProps, S extends CollectionState> extends React.PureComponent<P, S> {
  constructor (props: P) {
    super(props);

    this.state = {
      isEmpty: Collection.isEmpty(props.children)
    } as S;
  }

  private static isEmpty (children?: React.ReactNode): boolean {
    return !children || (Array.isArray(children) && children.length === 0);
  }

  public static getDerivedStateFromProps ({ children, isEmpty }: CollectionProps): CollectionState {
    return {
      isEmpty: isEmpty === undefined ? Collection.isEmpty(children) : isEmpty
    };
  }

  public render (): React.ReactNode {
    const { banner, className } = this.props;
    const { isEmpty, showHeader } = this.state;

    return (
      <div className={className}>
        {showHeader && this.renderHeader()}
        {banner}
        {isEmpty
          ? this.renderEmpty()
          : this.renderCollection()
        }
      </div>
    );
  }

  protected renderHeader (): React.ReactNode {
    const { buttons, headerText } = this.props;

    if (!headerText && !buttons) {
      return null;
    }

    return (
      <div className='ui--Collection-header'>
        <h1>{headerText}</h1>
        {buttons && (
          <div className='ui--Collection-buttons'>
            {buttons}
          </div>
        )}
      </div>
    );
  }

  protected renderEmpty (): React.ReactNode {
    const { emptyText = this.props.t('No items'), showEmptyText = true } = this.props;

    if (!showEmptyText) {
      return null;
    }

    return (
      <article>
        <div className='ui--Collection-lowercase'>
          {emptyText}
        </div>
      </article>
    );
  }

  protected renderCollection (): React.ReactNode {
    const { children } = this.props;

    return children;
  }
}
