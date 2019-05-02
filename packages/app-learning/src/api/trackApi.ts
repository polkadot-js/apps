/* Copyright 2017-2019 @polkadot/app-learning authors & contributors
/* This software may be modified and distributed under the terms
/* of the Apache-2.0 license. See the LICENSE file for details. */

import { Tracks } from '../types';

import tracks from '../data/tracks';

// return cloned copy so item passed by value instead of by reference
const _clone = (item: Tracks) => {
  return JSON.parse(JSON.stringify(item));
};

const TrackApi = {
  getAllTracks: (): Tracks => {
    return _clone(tracks.tracks);
  }
};

export default TrackApi;
