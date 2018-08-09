// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import expect from 'expect';
import { shallow } from '../test/enzyme';

import DownloadButton from './DownloadButton';

describe ('DownloadButton', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = shallow(<DownloadButton className='test' />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toBeDefined();
  });
});