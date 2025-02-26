import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { Button, Table } from '@polkadot/react-components';
import { callXAgereRpc } from '../callXAgereRpc.js';
import { useApi, useToggle } from '@polkadot/react-hooks';
import SubnetInfoTr from './SubnetInfoTr.js';

interface Props {
  className?: string;
  subnetId: string;
  onClose: () => void;
}

interface NeuronInfo {
  hotkey: string;
  coldkey: string;
  uid: number;
  netuid: number;
  active: boolean;
  axon_info: {
    ip: string;
    port: number;
    ip_type: number;
    protocol: number;
    placeholder1: number;
    placeholder2: number;
  };
  prometheus_info: {
    ip: string;
    port: number;
  };
  stake: [string, string][];
  rank: number;
  emission: string;
  incentive: number;
  consensus: number;
  trust: number;
  validator_trust: number;
  dividends: number;
  last_update: number;
  validator_permit: boolean;
  pruning_score: number;
}

function SubnetDetail({ className, subnetId, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [neurons, setNeurons] = useState<NeuronInfo[]>([]);
  const { systemChain } = useApi();
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  useEffect(() => {
    callXAgereRpc('xagere_getNeuronsLite', [Number(subnetId)], systemChain)
      .then((response) => {
        console.log('response', response);
        if (Array.isArray(response)) {
          setNeurons(response);
        }
      })
      .catch(console.error);
  }, [subnetId, systemChain]);

  const header = [
    [t('Hot Key'), 'start'],
    [t('Cold Key'), 'start'],
    [t('Stake'), 'start'],
    [t('Rank'), 'start'],
    [t('Emission'), 'start'],
    [t('Status'), 'start'],
    []  // 为展开按钮预留列
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.25rem',
      padding: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{ margin: 0 }}>{t('Agere Details')}</h2>
        <Button
          icon='times'
          onClick={onClose}
          label={t('Close')}
        />
      </div>

      <Table
        empty={t('No neurons found')}
        header={header}
      >
        {neurons.map((info) => (
          <SubnetInfoTr
            key={info.hotkey}
            className={className}
            info={info}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(SubnetDetail);
