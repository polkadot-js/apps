// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Something is seriously going wrong here...
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import CodeFlask from 'codeflask';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
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
function Editor ({ className = '', code, isValid, onEdit }: Props): React.ReactElement<Props> {
  const [editorId] = useState(() => `flask-${Date.now()}`);
  const editorRef = useRef<CodeFlask | null>(null);

  useEffect((): void => {
    const editor = new CodeFlask(`#${editorId}`, {
      language: 'js',
      lineNumbers: true
    });

    editor.updateCode(code);
    (editor as any).editorRoot.addEventListener('keydown', (): void => {
      (editor as unknown as Record<string, (value: unknown) => void>).onUpdate(onEdit);
    });

    editorRef.current = editor;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    editorRef.current && editorRef.current.updateCode(code);
  }, [code]);

  return (
    <div
      className={`ui-Editor ${className}${isValid === false ? ' invalid' : ''}`}
      id={editorId}
    />
  );
}

export default React.memo(styled(Editor)`
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
`);
