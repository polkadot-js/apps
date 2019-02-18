// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import CodeFlask from 'codeflask';

type Props = BareProps & {
  children?: React.ReactNode,
  isDevelopment: boolean,
  code: string,
  onEdit: (code: string) => void
};

export default class Editor extends React.Component<Props> {
  private id: string = `flask-${Date.now()}`;
  private editor: any;

  componentDidMount () {
    this.editor = new CodeFlask(`#${this.id}`, {
      language: 'js',
      lineNumbers: true
    });

    const { editor, props: { onEdit } } = this;

    editor.editorRoot.addEventListener('keydown', () => {
      editor.onUpdate(onEdit);
    });
  }

  shouldComponentUpdate (nextProps: Props) {
    // console.log('next props isCustom', nextProps.isCustomExample)
    return (
      nextProps.code !== this.props.code
    );
  }

  componentDidUpdate () {
    const { code } = this.props;
    this.editor.updateCode(code);
  }

  render () {
    return (
      <div
        className=''
        id={this.id}
      />
    );
  }

  private makeWrapper = (): string => {
    const args = `api, hashing, ${this.props.isDevelopment ? 'keyring, ' : ''}util`;

    return (`// All code is wrapped within an async closure,
// allowing access to ${args}.
//
// (async ({ ${args} }) => {
//   ... any user code is executed here ...
// })();

`);
  }
}
