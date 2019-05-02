/* Copyright 2017-2019 @polkadot/app-learning authors & contributors
/* This software may be modified and distributed under the terms
/* of the Apache-2.0 license. See the LICENSE file for details. */

import { TrackData } from '../types';

import BN from 'bn.js';

const trackData: TrackData = {
  'tracks': [
    {
      'dateLastUpdated': Date.now(),
      'dateReleased': Date.now(),
      'description': 'Add track description',
      'duration': 1.5,
      'icon': '',
      'id': new BN(1),
      'kind': 'track',
      'courses': [new BN(123), new BN(456)],
      'prerequisites': [new BN(456), new BN(789)],
      'rating': new BN(1),
      'tags': ['accounts', 'addresses'],
      'title': 'Add track title',
      'votesUp': new BN(20),
      'xp': new BN(1)
    },
    {
      'dateLastUpdated': Date.now(),
      'dateReleased': Date.now(),
      'description': 'Add track description',
      'duration': 1.5,
      'icon': '',
      'id': new BN(1),
      'kind': 'track',
      'courses': [new BN(123), new BN(456)],
      'prerequisites': [new BN(456), new BN(789)],
      'rating': new BN(1),
      'tags': ['accounts', 'addresses'],
      'title': 'Add track title',
      'votesUp': new BN(20),
      'xp': new BN(1)
    },
    {
      'dateLastUpdated': Date.now(),
      'dateReleased': Date.now(),
      'description': '',
      'duration': 1.5,
      'icon': '',
      'id': new BN(1),
      'kind': 'track',
      'courses': [new BN(123), new BN(456)],
      'prerequisites': [new BN(456), new BN(789)],
      'rating': new BN(1),
      'tags': ['accounts', 'addresses'],
      'title': 'Add track title',
      'votesUp': new BN(20),
      'xp': new BN(1)
    },
    {
      'dateLastUpdated': Date.now(),
      'dateReleased': Date.now(),
      'description': '',
      'duration': 1.5,
      'icon': '',
      'id': new BN(1),
      'kind': 'track',
      'courses': [new BN(123), new BN(456)],
      'prerequisites': [new BN(456), new BN(789)],
      'rating': new BN(1),
      'tags': ['accounts', 'addresses'],
      'title': 'Add track title',
      'votesUp': new BN(20),
      'xp': new BN(1)
    }
  ]
};

export default trackData;
