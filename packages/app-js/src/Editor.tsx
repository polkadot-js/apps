// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import CodeFlask from 'codeflask';

import makeWrapper from './snippets/wrapping';

type Props = BareProps & {
  children?: React.ReactNode,
  isDevelopment: boolean,
  code: string,
  onEdit: (code: string) => void,
  snippet: string
};

type State = {
  snippet: string
};

export default class Editor extends React.PureComponent<Props> {
  private id: string = `flask-${Date.now()}`;
  private editor: any;

  state: State = {
    snippet: ''
  };

  constructor (props: Props) {
    super(props);

    this.id = `flask-${Date.now()}`;
  }

  componentDidMount () {
    this.editor = new CodeFlask(`#${this.id}`, {
      language: 'js',
      lineNumbers: true
    });

    const { editor, props: { code, onEdit } } = this;

    editor.onUpdate((code: string) => {
      onEdit(code);
    });

    editor.editorRoot.addEventListener('focusin', () => {
      this.editor.onUpdate(onEdit);
    });

    onEdit(code);
  }

  componentDidUpdate () {
    const { code, isDevelopment, onEdit, snippet } = this.props;

    if (snippet !== this.state.snippet) {
      onEdit(code);

      this.editor.updateCode(`${makeWrapper(isDevelopment)}${code}`);
      this.setState({ snippet });
    }
  }

  render () {
    return (
      <article className='container js--Editor'>
        <div
          className=''
          id={this.id}
        />
        {this.props.children}
      </article>
    );
  }
}
