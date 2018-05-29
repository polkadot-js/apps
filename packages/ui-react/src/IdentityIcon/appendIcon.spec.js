// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

describe('autoFocus', () => {
  let appendIcon;
  let mockIdenticon;
  let node;

  beforeEach(() => {
    node = {
      appendChild: jest.fn()
    };

    mockIdenticon = jest.fn(() => 'genIdentitycon');
    jest.mock('@polkadot/ui-identicon', () => mockIdenticon);

    appendIcon = require('./appendIcon').default;
  });

  it('generates & appends icon to the node', () => {
    appendIcon('testAddr', 'testSize')(node);

    expect(node.appendChild).toHaveBeenCalledWith('genIdentitycon');
    expect(mockIdenticon).toHaveBeenCalledWith('testAddr', 'testSize');
  });

  it('does not call identicon when no node', () => {
    appendIcon('testAddr', 'testSize')();

    expect(mockIdenticon).not.toHaveBeenCalled();
  });
});
