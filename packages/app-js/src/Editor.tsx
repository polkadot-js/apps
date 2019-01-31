// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import SimpleEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

type Props = BareProps & {};
type State = {
  code: string
};

const DEFAULT_TEMPLATE = `// subscribe to new headers, printing the full result
api.rpc.chain.subscribeNewHead((header) => {
  console.log(\`#\${header.blockNumer}:\`, JSON.stringify(header));
});
`;

export default class Editor extends React.PureComponent<Props, State> {
  state: State = {
    code: DEFAULT_TEMPLATE
  };

  render () {
    return (
      <div className='js--Editor medium'>
        <SimpleEditor
          value={this.state.code}
          onValueChange={this.onEdit}
          highlight={this.onHighlight}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12
          }}
        />
      </div>
    );
  }

  private onEdit = (code: string) => {
    this.setState({ code });
  }

  private onHighlight = (code: string) => {
    return highlight(code, languages.js);
  }
}
