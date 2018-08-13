// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import arrayContainsArray from './arrayContainsArray';

describe('arrayContainsArray', () => {
  let dummyJson;

  beforeEach(() => {
    dummyJson = {
      'address': '5xx',
      'encoded': '0x123',
      'encoding': {},
      'meta': {}
    };
  });

  it('will return true if superset contains all items in subset', () => {
    const expectedJsonProperties = ['address', 'encoding', 'meta'];
    const actualJsonProperties = Object.keys(dummyJson);

    const expectedOutput = true;
    const actualOutput = arrayContainsArray(actualJsonProperties, expectedJsonProperties);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('will return false if superset is missing an item in the subset', () => {
    const expectedJsonProperties = ['address', 'encoding', 'meta'];
    let actualJsonProperties = ['address', 'encoded', 'meta']; // missing encoding

    const expectedOutput = false;
    const actualOutput = arrayContainsArray(actualJsonProperties, expectedJsonProperties);

    expect(actualOutput).toEqual(expectedOutput);
  });
  it('will return false if superset has all items in the subset but one is misspelt', () => {
    const expectedJsonProperties = ['address', 'misspelt', 'meta'];
    const actualJsonProperties = Object.keys(dummyJson);
    delete dummyJson.encoded;

    const expectedOutput = false;
    const actualOutput = arrayContainsArray(actualJsonProperties, expectedJsonProperties);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('will return false if superset has no values', () => {
    const expectedJsonProperties = ['address', 'encoding', 'meta'];
    const actualJsonProperties = {};

    const expectedOutput = false;
    const actualOutput = arrayContainsArray(actualJsonProperties, expectedJsonProperties);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('will return false if subset has no values', () => {
    const expectedJsonProperties = [];
    const actualJsonProperties = Object.keys(dummyJson);

    const expectedOutput = false;
    const actualOutput = arrayContainsArray(actualJsonProperties, expectedJsonProperties);

    expect(actualOutput).toEqual(expectedOutput);
  });
});
