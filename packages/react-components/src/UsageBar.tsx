import type { CoreWorkloadInfo } from '@polkadot/react-hooks/types';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';

import React from 'react';

interface Props {
    info?: CoreWorkloadInfo[] | CoreWorkloadInfo;
    apiEndpoint?: LinkOption | null;
}

function UsageBar({ info, apiEndpoint }: Props): React.ReactElement<Props> {
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

    let total = tasks + idles + pools;
    let taskPerc = (tasks / total) * 100;
    let poolPerc = (pools / total) * 100;

    const taskOffset = (taskPerc / 100) * circumference;
    const poolOffset = taskOffset + (poolPerc / 100) * circumference;

    return (
        <div>
            <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
                <circle cx={radius} cy={radius} r={radius - strokeWidth / 2} fill="none" stroke="#f0f0f0" strokeWidth={strokeWidth} />
                <circle className='highlight--bg' cx={radius} cy={radius} r={radius - strokeWidth / 2} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} transform={`rotate(-90 ${radius} ${radius})`}
                />
                <circle cx={radius} cy={radius} r={radius - strokeWidth / 2} fill="none" stroke='#04AA6D' strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={taskOffset} transform={`rotate(-90 ${radius} ${radius})`} />
                <circle cx={radius} cy={radius} r={radius - strokeWidth / 2} fill="none" stroke='white' strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={poolOffset} transform={`rotate(-90 ${radius} ${radius})`} />
            </svg>
        </div>


    )
}

export default React.memo(UsageBar);
