// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import CodeFlask from 'codeflask';
import React, { useEffect, useRef, useState } from 'react';
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
function Editor ({ className, code, isValid, onEdit }: Props): React.ReactElement<Props> {
  const [editorId] = useState(`flask-${Date.now()}`);
  const editorRef = useRef<typeof CodeFlask | null>(null);

  useEffect((): void => {
    const editor = new CodeFlask(`#${editorId}`, {
      language: 'js',
      lineNumbers: true
    });

    editor.updateCode(code);
    editor.editorRoot.addEventListener('keydown', (): void => {
      editor.onUpdate(onEdit);
    });

    editorRef.current = editor;
  }, []);

  useEffect((): void => {
    editorRef.current && editorRef.current.updateCode(code);
  }, [code]);

  return (
    <div
      className={classes('ui-Editor', className, isValid === false ? 'invalid' : '')}
      id={editorId}
    />
  );
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
