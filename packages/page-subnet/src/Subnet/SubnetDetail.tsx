import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, Table } from '@polkadot/react-components';
import { callXAgereRpc } from '../callXAgereRpc.js';
import { formatBEVM } from '../utils/formatBEVM.js';
import { useApi } from '@polkadot/react-hooks';

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

  useEffect(() => {
    callXAgereRpc('xagere_getNeuronsLite', [subnetId], systemChain)
      .then((response) => {
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
    [t('Incentive'), 'start'],
    [t('Consensus'), 'start'],
    [t('Trust'), 'start'],
    [t('Validator Trust'), 'start'],
    [t('Status'), 'start']
  ];

  return (
    <div className={className}>
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
          <h2 style={{ margin: 0 }}>{t('Subnet Details')}</h2>
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
            <tr key={info.hotkey}>
              <td><AddressSmall value={info.hotkey} /></td>
              <td><AddressSmall value={info.coldkey} /></td>
              <td>{formatBEVM(info.stake.reduce((sum, [_, amount]) => sum + Number(amount), 0))}</td>
              <td>{info.rank}</td>
              <td>{formatBEVM(Number(info.emission))}</td>
              <td>{info.incentive}%</td>
              <td>{info.consensus}%</td>
              <td>{info.trust}%</td>
              <td>{info.validator_trust}%</td>
              <td>{info.active ? t('Active') : t('Inactive')}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

export default React.memo(SubnetDetail); 