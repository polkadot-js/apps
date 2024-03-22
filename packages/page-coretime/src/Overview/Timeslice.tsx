import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';
import type { u32 } from '@polkadot/types';
import React from 'react';
import { BrokerStatus } from '@polkadot/react-query';

interface Props {
  children?: React.ReactNode;
  className?: string;
  timeslice?: PalletBrokerStatusRecord | null;
  lastTimeslice?: u32 | null;
}

function Timeslice({ children, className }: Props): React.ReactElement<Props> | null {

  return (
    <BrokerStatus
      className={className}
      query='lastTimeslice'>
      {children}
    </BrokerStatus>
  );
}

export default React.memo(Timeslice);
