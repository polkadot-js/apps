// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import CodeFlask from 'codeflask';

import WRAPPING from './snippets/wrapping';

type Props = BareProps & {
  children?: React.ReactNode,
  onEdit: (code: string) => void,
  snippet: string
};
type State = {
  code: string,
  subscription: any
};

export default class Editor extends React.PureComponent<Props, State> {
  private id: string;

  constructor (props: Props) {
    super(props);

    const { snippet } = this.props;
    console.log('snippet', this.props)
    this.id = `flask-${Date.now()}`;
    this.state = {
      code: `${WRAPPING}${snippet}`,
      subscription: ''
    }
  }

  componentDidMount () {
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

    this.onEdit(code);
  }

  componentWillReceiveProps (nextProps: any) {
    if(nextProps.snippet !== this.props.snippet){
      console.log('SNIPPET', this.props.snippet)
    }
  }

  componentWillUnmount () {
    // const {subscriptions} = this.state;
    // subscriptions.unsubscribe();
  }

  render () {
    const { children } = this.props;

    return (
      <article className='container js--Editor'>
        <div
          className=''
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
