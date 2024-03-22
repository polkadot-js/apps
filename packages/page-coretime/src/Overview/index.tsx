import Summary from './Summary.js';

import React from 'react';
import Workloads from './Workloads.js';
import { CoreWorkloadInfo } from '../types.js';

interface Props {
  className?: string;
  infos?: CoreWorkloadInfo[];
}

function Overview ({ className, infos }: Props): React.ReactElement<Props> {
  console.log('timeslice', Summary)

  return (
    <div className={className}>
      <Summary></Summary>
      <Workloads infos={infos}/>
    </div>
  )
}

export default React.memo(Overview);
