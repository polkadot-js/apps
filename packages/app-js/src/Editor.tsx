// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import CodeFlask from 'codeflask';

import WRAPPING from './snippets/wrapping';

type Props = BareProps & {
  children?: React.ReactNode,
  code: string,
  onEdit: (code: string) => void,
  snippet: string
};

export default class Editor extends React.PureComponent<Props> {
  private id: string;
  private editor: any;

  constructor (props: Props) {
    super(props);
    this.id = `flask-${Date.now()}`;
  }

  componentDidMount () {
    // const { code } = this.props;
    this.editor = new CodeFlask(`#${this.id}`, {
      language: 'js',
      lineNumbers: true
    });

    const { editor, props: { code, onEdit } } = this;

    editor.updateCode(`${WRAPPING}${code}`);

    editor.onUpdate((code: string) => {
      this.props.onEdit(code);
    });

    editor.editorRoot.addEventListener('focusin', () => {
      this.editor.onUpdate(this.props.onEdit);
    });

    onEdit(code);
  }

  componentWillReceiveProps (nextProps: any) {
    const { code, onEdit, snippet } = nextProps;
    if (snippet !== this.props.snippet) {
      onEdit(code);
      this.editor.updateCode(`${WRAPPING}${code}`);
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
