// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreWorkloadInfo } from '@polkadot/react-hooks/types';

import React from 'react';

interface Props {
  info?: CoreWorkloadInfo[] | CoreWorkloadInfo;
  apiEndpoint?: LinkOption | null;
}

function UsageBar ({ apiEndpoint, info }: Props): React.ReactElement<Props> {
  const color = apiEndpoint?.ui.color ? apiEndpoint?.ui.color : '#f19135';
  const radius = 50;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  let sanitized: CoreWorkloadInfo[] = [];

  if (Array.isArray(info)) {
    sanitized = info;
  } else if (info) {
    sanitized.push(info);
  }

  let tasks = 0;
  let idles = 0;
  let pools = 0;

  sanitized?.forEach((v) => {
    if (v.info[0].assignment.isTask) {
      ++tasks;
    } else if (v.info[0].assignment.isPool) {
      ++pools;
    } else {
      ++idles;
    }
  });

  const total = tasks + idles + pools;
  const taskPerc = (tasks / total) * 100;
  const poolPerc = (pools / total) * 100;

  const taskOffset = (taskPerc / 100) * circumference;
  const poolOffset = taskOffset + (poolPerc / 100) * circumference;

  return (
    <div>
      <svg
        height={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        width={radius * 2}
      >
        <circle
          cx={radius}
          cy={radius}
          fill='none'
          r={radius - strokeWidth / 2}
          stroke='#f0f0f0'
          strokeWidth={strokeWidth}
        />
        <circle
          className='highlight--bg'
          cx={radius}
          cy={radius}
          fill='none'
          r={radius - strokeWidth / 2}
          stroke={color}
          strokeDasharray={circumference}
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <circle
          cx={radius}
          cy={radius}
          fill='none'
          r={radius - strokeWidth / 2}
          stroke='#04AA6D'
          strokeDasharray={circumference}
          strokeDashoffset={taskOffset}
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <circle
          cx={radius}
          cy={radius}
          fill='none'
          r={radius - strokeWidth / 2}
          stroke='white'
          strokeDasharray={circumference}
          strokeDashoffset={poolOffset}
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
    </div>

  );
}

export default React.memo(UsageBar);
