// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

export interface CollectionProps extends I18nProps {
  banner?: React.ReactNode;
  buttons?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerText?: React.ReactNode;
  isEmpty?: boolean;
  emptyText?: React.ReactNode;
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
  public constructor (props: P) {
    super(props);

    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    this.state = {
      isEmpty: Collection.isEmpty(props.children)
    } as S;
  }

  private static isEmpty (children?: React.ReactNode): boolean {
    return !children || (Array.isArray(children) && children.length === 0);
  }

  public static getDerivedStateFromProps ({ children }: CollectionProps): Pick<any, never> {
    return {
      isEmpty: Collection.isEmpty(children)
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
    const { emptyText, t } = this.props;

    return (
      <article>
        <div className='ui--Collection-lowercase'>
          {emptyText || t('No items')}
        </div>
      </article>
    );
  }

  protected renderCollection (): React.ReactNode {
    const { children } = this.props;
    return children;
  }
}
