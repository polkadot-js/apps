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
  trigger?: unknown;
}

interface State {
  error: Error | null;
  prevTrigger: string | null;
}

// NOTE: This is the only way to do an error boundary, via extend
class ErrorBoundary extends React.Component<Props> {
  state: State = { error: null, prevTrigger: null };

  static getDerivedStateFromError (error: Error): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps ({ trigger }: Props, { prevTrigger }: State): State | null {
    const newTrigger = JSON.stringify({ trigger });

    return (prevTrigger !== newTrigger)
      ? { error: null, prevTrigger: newTrigger }
      : null;
  }

  public componentDidCatch (error: Error): void {
    const { doThrow, onError } = this.props;

    onError && onError();

    if (doThrow) {
      throw error;
    }
  }

  public render (): React.ReactNode {
    const { children, t } = this.props;
    const { error } = this.state;

    return error
      ? (
        <article className='error'>
          {t<string>('Uncaught error. Something went wrong with the query and rendering of this component. {{message}}', {
            replace: { message: error.message }
          })}
        </article>
      )
      : children;
  }
}

export default translate(ErrorBoundary);
