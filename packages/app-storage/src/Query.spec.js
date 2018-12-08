// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDefInfo } from '@polkadot/types/codec/createType';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { generateDisplayParams } from './Query';

describe('Storage queries', () => {
  let actualOutput, expectedOutput, params;

  it('with a single Plain parameter it generates a React node with parameter name and value', () => {
    params = [
      {
        isValid: true,
        info: TypeDefInfo.Plain,
        type: 'AccountId',
        value: 'C123'
      }
    ];
    actualOutput = ReactDOMServer.renderToStaticMarkup(generateDisplayParams(params));
    expectedOutput = "<span>AccountId=<div class=\"ui--Param-text\">C123</div></span>";

    expect(actualOutput).toBe(expectedOutput);
  });

  it('with two parameters (Plain and Plain) it generates a React node with grouped parameter names and values', () => {
    params = [
      {
        isValid: true,
        info: TypeDefInfo.Plain,
        type: 'AccountId',
        value: 'C123'
      },
      {
        isValid: true,
        info: TypeDefInfo.Plain,
        type: 'Hash',
        value: '0x01'
      }
    ];
    actualOutput = ReactDOMServer.renderToStaticMarkup(generateDisplayParams(params));
    expectedOutput = "<span>AccountId=<div class=\"ui--Param-text\">C123</div>, </span><span>Hash=<div class=\"ui--Param-text\">0x01</div></span>";

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('with a Tuple (with Plain elements only) it generates a React node with grouped tuple names and tuples values', () => {
    params = [
      {
        isValid: true,
        info: TypeDefInfo.Tuple,
        type: '(Hash, AccountId, BlockNumber)',
        value: ['0xABC', 'C123', '3'],
        sub: [
          { 
            info: TypeDefInfo.Plain,
            type: 'Hash'
          },
          { 
            info: TypeDefInfo.Plain,
            type: 'AccountId'
          },
          {
            info: TypeDefInfo.Plain,
            type: 'Text'
          }
        ]
      }
    ];
    actualOutput = ReactDOMServer.renderToStaticMarkup(generateDisplayParams(params));
    expectedOutput = "<span>(Hash, AccountId, BlockNumber)=<span>(<div class=\"ui--Param-text\">0xABC</div>, </span><span><div class=\"ui--Param-text\">C123</div>, </span><span><div class=\"ui--Param-text\">3</div>)</span></span>";

    expect(actualOutput).toEqual(expectedOutput);
  });
});
