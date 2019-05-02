// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export type BaseId = BN;
export type UnitId = BaseId;
export type CourseId = BaseId;
export type TrackId = BaseId;

export type TagFilter = 'accounts';

export type Tag = string | undefined;

export type UnitKind = 'track' | 'course' | 'unit';

export type BaseUnit = {
  dateReleased?: number | undefined,
  dateLastUpdated?: number | undefined,
  description?: string | undefined,
  duration?: number | undefined,
  icon?: string | undefined,
  kind: UnitKind,
  rating?: BN | undefined,
  tags?: Array<Tag> | undefined,
  title?: string | undefined,
  votesUp?: BN | undefined,
  xp?: BN | undefined
};

export type Unit = BaseUnit & {
  id: UnitId
};

export type Course = BaseUnit & {
  id: CourseId,
  units: Array<UnitId>,
  prerequisites?: Array<UnitId> | undefined
};

export type TrackFilter = 'all' | 'accounts';

export type Track = BaseUnit & {
  id: TrackId,
  courses: Array<CourseId>,
  prerequisites?: Array<UnitId> | undefined
};

export type Tracks = Array<Track>;

export type TrackData = {
  [index: string]: Tracks
};
