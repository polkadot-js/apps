// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import CodeFlask from 'codeflask';
import React from 'react';
import styled from 'styled-components';
import { classes } from '@polkadot/react-components/util';

interface Props extends BareProps {
  code: string;
  isValid?: boolean;
  onEdit: (code: string) => void;
}

/**
 * @name Editor
 * @summary A code editor based on the codeflask npm module
 * @description It allows to live-edit code examples and JSON files.
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import {Editor} from '@polkadot/react-components';
 *
 * <Editor
 *    className={string} // optional
 *    code={string}
 *    isValid={boolean}, // optional
 *    onEdit={() => callbackFunction}
 *  />
 * ```
 */
class Editor extends React.Component<Props> {
  private id: string = `flask-${Date.now()}`;

  private editor: any;

  public componentDidMount (): void {
    const { onEdit } = this.props;

    this.editor = new CodeFlask(`#${this.id}`, {
      language: 'js',
      lineNumbers: true
    });

    this.editor.updateCode(this.props.code);

    this.editor.editorRoot.addEventListener('keydown', (): void => {
      this.editor.onUpdate(onEdit);
    });
  }

  public shouldComponentUpdate (nextProps: Props): boolean {
    return (
      nextProps.code !== this.props.code
    );
  }

  public componentDidUpdate (): void {
    this.editor.updateCode(this.props.code);
  }

  public render (): React.ReactNode {
    const { className, isValid } = this.props;

    return (
      <div
        className={classes('ui-Editor', className, isValid === false ? 'invalid' : '')}
        id={this.id}
      />
    );
  }
}

export default styled(Editor)`
  .codeflask {
    border: 1px solid rgba(34,36,38,.15);
    background: transparent;
  }

  &.invalid {
    .codeflask {
      background-color: #fff6f6;
      border-color: #e0b4b4;
    }
  }
`;
