// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import SimpleEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';

import './theme.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

type Props = BareProps & {
  children?: React.ReactNode,
  onEdit: (code: string) => void
};
type State = {
  code: string,
  outerClosing: string,
  outerOpening: string
};

const DEFAULT_TEMPLATE = `// subscribe to new headers, printing the full result
api.rpc.chain.subscribeNewHead((header) => {
  console.log(\`#\${header.blockNumber}:\`, header);
});`;
const OPENING = '(async ({ api, hashing, keyring, util }) => {';
const CLOSING = '})(injected);';

export default class Editor extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      code: DEFAULT_TEMPLATE,
      outerClosing: this.doHighlight(CLOSING),
      outerOpening: this.doHighlight(OPENING)
    };
  }

  componentDidMount () {
    const { onEdit } = this.props;
    const { code } = this.state;

    onEdit(code);
  }

  render () {
    const { children } = this.props;
    const { code, outerClosing, outerOpening } = this.state;

    return (
      <div className='js--Editor js--theme-basic'>
        <pre
          className='nonedit'
          dangerouslySetInnerHTML={{ __html: outerOpening }}
        />
        <SimpleEditor
          className='simpleeditor'
          highlight={this.doHighlight}
          onValueChange={this.onEdit}
          padding={10}
          style={{
            fontFamily: 'monospace',
            fontSize: 14
          }}
          value={code}
        />
        <pre
          className='nonedit'
          dangerouslySetInnerHTML={{ __html: outerClosing }}
        />
        {children}
      </div>
    );
  }

  private onEdit = (code: string): void => {
    const { onEdit } = this.props;

    this.setState({ code }, () => onEdit(code));
  }

  private doHighlight = (code: string): string => {
    return highlight(code, languages.js);
  }
}
