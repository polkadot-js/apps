import Summary from './Summary.js';

import React from 'react';
import Workloads from './Workloads.js';
import Workplans from './Workplans.js';
import { CoreWorkloadInfo, CoreWorkplanInfo } from '../types.js';

interface Props {
  className?: string;
  workloadInfos?: CoreWorkloadInfo[];
  workplanInfos?: CoreWorkplanInfo[];
}

function Overview ({ className, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {

  return (
    <div className={className}>
      <Summary></Summary>
      <Workloads workloadInfos={workloadInfos}/>
      <Workplans workplanInfos={workplanInfos}/>
    </div>
  )
}

export default React.memo(Overview);
