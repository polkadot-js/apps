// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { Editor } from './Editor';

const mockT = (key, options) => (key);

describe('Editor', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Editor t={mockT} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });
});
