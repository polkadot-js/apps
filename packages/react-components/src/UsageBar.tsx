// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreDescription, CoreWorkloadInfo } from '@polkadot/react-hooks/types';
import type { PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor } from '@polkadot/types/lookup';

import React from 'react';

interface Props {
  info?: CoreWorkloadInfo[] | CoreWorkloadInfo;
  apiEndpoint?: LinkOption | null;
  coreDescriptors?: CoreDescription[];
}

function UsageBar ({ apiEndpoint, coreDescriptors, info }: Props): React.ReactElement<Props> {
  const color = apiEndpoint?.ui.color ? apiEndpoint?.ui.color : '#f19135';
  const radius = 50;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  let tasks = 0;
  let idles = 0;
  let pools = 0;

  if (coreDescriptors) {
    coreDescriptors.forEach((description) => {
      let sanitized: PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor[] = [];

      if (Array.isArray(description.info)) {
        sanitized = description.info;
      } else if (description.info) {
        sanitized.push(description.info);
      }

      sanitized.forEach((i) => {
        const info = i.currentWork.unwrapOr(undefined);

        if (info) {
          info.assignments.forEach((_, index) => {
            if (info.assignments[index][0].isIdle) {
              idles++;
            } else if (info.assignments[index][0].isPool) {
              pools++;
            } else {
              tasks++;
            }
          });
        }
      });
    });
  } else {
    let sanitized: CoreWorkloadInfo[] = [];

    if (Array.isArray(info)) {
      sanitized = info;
    } else if (info) {
      sanitized.push(info);
    }

    sanitized?.forEach((v) => {
      if (v.info[0].assignment.isTask) {
        ++tasks;
      } else if (v.info[0].assignment.isPool) {
        ++pools;
      } else {
        ++idles;
      }
    });
  }

  const total = tasks + idles + pools;
  const taskPerc = !!total ? (tasks / total) * 100 : 0;
  const poolPerc = !!total ? (pools / total) * 100 : 0;

  const taskOffset = (taskPerc / 100) * 360;
  const poolOffset = taskOffset + (poolPerc / 100) * 360;

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
        <text
          dy='.3em'
          fill='rgba(78, 78, 78, 0.66)'
          fontWeight='bold'
          textAnchor='middle'
          x='50%'
          y='50%'
        >usage</text>
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
        >
          <title>Tasks assignment: {taskPerc.toFixed(2)}%</title>
        </circle>
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
        >
          <title style={{ opacity: '.2' }}>Pool assignment: {poolPerc.toFixed(2)}%</title>
        </circle>
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
        >
          <title>Idle assignment: {(100 - taskPerc - poolPerc).toFixed(2)}%</title>
        </circle>
      </svg>
    </div>

  );
}

export default React.memo(UsageBar);
