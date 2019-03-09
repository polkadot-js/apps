// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import CodeFlask from 'codeflask';

type Props = BareProps & {
  code: string,
  onEdit: (code: string) => void
};

export default class Editor extends React.Component<Props> {
  private id: string = `flask-${Date.now()}`;
  private editor: any;

  componentDidMount () {
    const { onEdit } = this.props;

    this.editor = new CodeFlask(`#${this.id}`, {
      language: 'js',
      lineNumbers: true
    });

    this.editor.updateCode(this.props.code);

    this.editor.editorRoot.addEventListener('keydown', () => {
      this.editor.onUpdate(onEdit);
    });
  }

  shouldComponentUpdate (nextProps: Props): boolean {
    return (
      nextProps.code !== this.props.code
    );
  }

  componentDidUpdate () {
    this.editor.updateCode(this.props.code);
  }

  render () {
    return (
      <div id={this.id} />
    );
  }
}
