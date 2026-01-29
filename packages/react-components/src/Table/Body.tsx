// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { isString } from '@polkadot/util';

import Spinner from '../Spinner.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  empty?: React.ReactNode | false;
  emptySpinner?: React.ReactNode;
  isEmpty: boolean;
  noBodyTag?: boolean;
}

function Body ({ children, className = '', empty, emptySpinner, isEmpty, noBodyTag }: Props): React.ReactElement<Props> {
  const bodyClassName = `${className} ui--Table-Body`;

  return isEmpty
    ? (
      <tbody className={bodyClassName}>
        <tr>
          <td colSpan={100}>{
            isString(empty)
              ? <div className='empty'>{empty}</div>
              : empty || <Spinner label={emptySpinner} />
          }</td>
        </tr>
      </tbody>
    )
    : noBodyTag
      ? <>{children}</>
      : <tbody className={bodyClassName}>{children}</tbody>;
}

export default React.memo(Body);
