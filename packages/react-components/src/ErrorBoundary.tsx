// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { I18nProps } from './types';

import React from 'react';

import translate from './translate';

interface Props extends I18nProps {
  children: React.ReactNode;
  doThrow?: boolean;
  error?: Error | null;
  onError?: () => void;
  trigger?: unknown;
}

interface State {
  error: Error | null;
  prevTrigger: string | null;
}

// NOTE: This is the only way to do an error boundary, via extend
class ErrorBoundary extends React.Component<Props> {
  public override state: State = { error: null, prevTrigger: null };

  static getDerivedStateFromError (error: Error): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps ({ trigger }: Props, { prevTrigger }: State): State | null {
    const newTrigger = JSON.stringify({ trigger });

    return (prevTrigger !== newTrigger)
      ? { error: null, prevTrigger: newTrigger }
      : null;
  }

  public override componentDidCatch (error: Error): void {
    const { doThrow, onError } = this.props;

    onError && onError();

    if (doThrow) {
      throw error;
    }
  }

  public override render (): React.ReactNode {
    const { children, error: errorProps, t } = this.props;
    const { error } = this.state;
    const displayError = errorProps || error;

    return displayError
      ? (
        <article className='error extraMargin'>
          {t<string>('Uncaught error. Something went wrong with the query and rendering of this component. {{message}}', {
            replace: { message: displayError.message }
          })}
        </article>
      )
      : children;
  }
}

export default translate(ErrorBoundary);
