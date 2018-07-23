// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { shouldDisplaySection } from './shouldDisplaySection';

describe('input extrinsic section', () => {
  let type, dummySection;

  beforeEach(() => {
    type = 'public';

    dummySection = {
      name: 'dummy',
      description: 'an dummy extrinsic section',
      isDeprecated: false,
      isHidden: false,
      private: {},
      public: {
        didUpdate: {
          isDeprecated: false,
          isHidden: false
        }
      }
    }
  });

  it('will be shown if section and its associated methods are not deprecated or hidden', () => {
    const expectedOutput = true;
    const actualOutput = shouldDisplaySection(dummySection, type);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('will not be shown if section is hidden', () => {
    dummySection['isHidden'] = true; 
    const expectedOutput = false;
    const actualOutput = shouldDisplaySection(dummySection, type);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('will not be shown if section is deprecated', () => {
    dummySection['isDeprecated'] = true; 
    const expectedOutput = false;
    const actualOutput = shouldDisplaySection(dummySection, type);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('will not be shown if section is not deprecated or hidden and no associated methods exist', () => {
    type = 'private';
    const expectedOutput = false;
    const actualOutput = shouldDisplaySection(dummySection, type);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('will not be shown if section is not deprecated or hidden but an associated method is deprecated or hidden', () => {
    dummySection['public']['didUpdate']['isHidden'] = true;
    const expectedOutput = false;
    const actualOutput = shouldDisplaySection(dummySection, type);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('will not be shown if section methods are undefined or not an object', () => {
    type = 'non-existant-type';
    const expectedOutput = false;
    const actualOutput = shouldDisplaySection(dummySection, type);

    expect(actualOutput).toEqual(expectedOutput);
  });

});
