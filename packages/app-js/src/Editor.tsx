// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import CodeFlask from 'codeflask';

import DEFAULT_CODE from './snippets/newHead';
import WRAPPING from './snippets/wrapping';

type Props = BareProps & {
  children?: React.ReactNode,
  onEdit: (code: string) => void
};
type State = {
  code: string
};

export default class Editor extends React.PureComponent<Props, State> {
  private id: string;

  constructor (props: Props) {
    super(props);

    this.id = `flask-${Date.now()}`;
    this.state = {
      code: `${WRAPPING}${DEFAULT_CODE}`
    };
  }

  componentDidMount () {
    const { onEdit } = this.props;
    const { code } = this.state;

    const editor = new CodeFlask(`#${this.id}`, {
      language: 'js',
      lineNumbers: true
    });

    editor.updateCode(code);

    editor.onUpdate((code: string) => {
      this.onEdit(code);
    });

    editor.editorRoot.addEventListener('focusin', () => {
      editor.onUpdate(this.onEdit);
    });

    editor.editorRoot.addEventListener('focusout', () => {
      editor.onUpdate(() => {
        // empty
      });
    });

    onEdit(code);
  }

  render () {
    const { children } = this.props;

    return (
      <article className='js--Editor'>
        <div
          className='container'
          id={this.id}
        />
        {children}
      </article>
    );
  }

  private onEdit = (code: string): void => {
    const { onEdit } = this.props;

    this.setState({ code }, () => onEdit(code));
  }
}
