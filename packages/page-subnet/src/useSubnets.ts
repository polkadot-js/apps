import type { SubnetInfo } from './types.js';
import { useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { useCall } from '@polkadot/react-hooks';

function useSubnetsImpl (): SubnetInfo[] {
  const { api } = useApi();
  const [subnets, setSubnets] = useState<SubnetInfo[]>([]);

  useEffect((): void => {
    if (!api.rpc.xagere?.getDelegates) {
      console.log('xagere_getDelegates method not found');
      return;
    }

    let unsubscribe: null | (() => void) = null;

    api.rpc.xagere
      .getDelegates()
      .then((result: any): void => {
        console.log('Delegates result:', result);
        
        const subnetInfos = result.map((info: any) => ({
          id: info.id?.toString() || '',
          name: info.name?.toString() || '',
          owner: info.owner?.toString() || '',
          emissions: info.emissions?.toString() || '',
          recycledTotal: info.recycledTotal?.toString() || '',
          recycled24h: info.recycled24h?.toString() || '',
          lifetime: info.lifetime?.toString() || ''
        }));

        setSubnets(subnetInfos);
      })
      .catch((error): void => {
        console.error('Failed to fetch delegates:', error);
      });

    return (): void => {
      unsubscribe && unsubscribe();
    };
  }, [api]);

  return subnets;
}

export default useSubnetsImpl; 