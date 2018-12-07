// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { generateDisplayParams } from './Query';

describe('Storage queries', () => {
  let actualOutput, expectedOutput, params;

  it('with a single parameter it generates a React node with parameter name and value', () => {
    params = [
      // function parameter 1 of 1
      {
        isValid: true,
        info: 1, // not a tuple
        type: 'AccountId',
        value: 'C123'
      }
    ];
    actualOutput = ReactDOMServer.renderToStaticMarkup(generateDisplayParams(params));
    expectedOutput = "<span>AccountId=<div class=\"ui--Param-text\">C123</div></span>";

    expect(actualOutput).toBe(expectedOutput);
  });

  it('with two parameters it generates a React node with grouped parameter names and values', () => {
    params = [
      // function parameter 1 of 1
      {
        isValid: true,
        info: 1,
        type: 'AccountId',
        value: 'C123'
      },
      // function parameter 2 of 2
      {
        isValid: true,
        info: 1,
        type: 'Hash',
        value: '0x01'
      }
    ];
    actualOutput = ReactDOMServer.renderToStaticMarkup(generateDisplayParams(params));
    expectedOutput = "<span>AccountId=<div class=\"ui--Param-text\">C123</div>, </span><span>Hash=<div class=\"ui--Param-text\">0x01</div></span>";

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('with a tuple of two or more elements it generates a React node with grouped tuple names and tuples values', () => {
    params = [
      // function parameter tuple
      {
        isValid: true,
        info: 3, // tuple with three elements
        type: '(Hash, AccountId, BlockNumber)',
        value: ['0xABC', 'C123', '3'],
        sub: [ { info: 1, type: 'Hash' }, { info: 1, type: 'AccountId' }, { info: 1, type: 'BlockNumber' }]
      }
    ];
    actualOutput = ReactDOMServer.renderToStaticMarkup(generateDisplayParams(params));
    expectedOutput = "<span>(Hash, AccountId, BlockNumber)=<span>(<div class=\"ui--Param-text\">0xABC</div>, </span><span><div class=\"ui--Param-text\">C123</div>, </span><span><div class=\"ui--Param-text\">3</div>)</span></span>";

    expect(actualOutput).toEqual(expectedOutput);
  });
});
