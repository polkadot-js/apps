// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';

import Container from './index';

type DemoProps = {
  attrs: { [string]: mixed },
  attrsReq: Array<string>,
  children: React$Node,
  component: string
};

export default function Demo ({ attrs, attrsReq, children, component }: DemoProps): React$Node {
  const allAttrs = Object.assign({ className: '"..."', style: '{...}' }, attrs);
  const attrsText = Object
    .keys(allAttrs)
    .map((attr) => {
      const value = allAttrs[attr];
      const bool = value === 'bool';
      const opt = bool || !attrsReq.includes(attr);

      return `${opt ? '[' : ''}${attr}${bool ? '' : '='}${bool ? '' : value}${opt ? ']' : ''}`;
    })
    .sort()
    .join('\n  ');

  return (
    <Container className='ui--DemoContainer'>
      <pre className='ui--DemoHeader'>
        {`<${component}\n  ${attrsText}\n/>`}
      </pre>
      {children}
    </Container>
  );
}
