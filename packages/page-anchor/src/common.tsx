import React from 'react';
import { hex } from './hrproof';

export function hexDisplay(bs: Uint8Array): React.ReactElement {
  return <span style={{ fontFamily: 'monospace', width: `{bs.length}ch` }}>
    {hex(bs)}
  </span>;
}
