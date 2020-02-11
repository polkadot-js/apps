// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from './types';

import React from 'react';

import translate from './translate';

interface Props extends I18nProps {
  children: React.ReactNode;
  doThrow?: boolean;
  onError?: () => void;
}

interface State {
  hasError: boolean;
}

// NOTE: This is the only way to do an error boundary, via extend
class ErrorBoundary extends React.Component<Props> {
  state: State = { hasError: false };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError (_error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public componentDidCatch (error: Error, _errorInfo: any): void {
    const { doThrow, onError } = this.props;

    onError && onError();

    if (doThrow) {
      throw error;
    }
  }

  public render (): React.ReactNode {
    const { children, t } = this.props;
    const { hasError } = this.state;

    return hasError
      ? (
        <article className='error'>
          {t('Uncaught error. Something went wrong with the query and rendering of this component.')}
        </article>
      )
      : children;
  }
}

export default translate(ErrorBoundary);
