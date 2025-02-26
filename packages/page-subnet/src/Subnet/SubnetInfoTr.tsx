 import React from 'react';
import { AddressSmall, Table } from '@polkadot/react-components';
import { useTranslation } from '../translate.js';
import { formatBEVM } from '../Utils/formatBEVM.js';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  info: {
    hotkey: string
    coldkey: string
    uid: number
    netuid: number
    active: boolean
    axon_info: {
      block: number
      version: number
      ip: number
      port: number
      ip_type: number
      protocol: number
      placeholder1: number
      placeholder2: number
    },
    prometheus_info: {
      block: number
      version: number
      ip: number
      port: number
      ip_type: number
    },
    stake: [string, number][],
    rank: number
    emission: number
    incentive: number
    consensus: number
    trust: number
    validator_trust: number
    dividends: number
    last_update: number
    validator_permit: boolean
    pruning_score: number
  }
}

function SubnetInfoTr({ className, info }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  return (
    <React.Fragment>
      <tr className={`${className} isExpanded isFirst ${isExpanded ? 'packedBottom' : 'isLast'}`}>
        <td>{info.netuid}</td>
        <td>{info.axon_info.ip_type}</td>
        <td>{info.uid}</td>
        <td>{formatBEVM(info.stake[0][1])}</td>
        <td>{info.validator_trust}</td>
        <td>{info.trust}</td>
        <td><AddressSmall value={info.hotkey} /></td>
        <td><AddressSmall value={info.coldkey} /></td>
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleIsExpanded}
        />
      </tr>
      {isExpanded && (
        <tr className={`${className} isExpanded details-row`}>
          <td colSpan={7}>
            <div style={{
              display: 'flex',
              gap: '10rem',
              padding: '1rem'
            }}>
              <div>
                <h5>{t('Consensus')}</h5>
                <div>{info.consensus}%</div>
              </div>
              <div>
                <h5>{t('Incentive')}</h5>
                <div>{info.incentive}%</div>
              </div>
              <div>
                <h5>{t('Dividends')}</h5>
                <div>{info.dividends}%</div>
              </div>
              <div>
                <h5>{t('Axon')}</h5>
                <div>{info.axon_info.port}%</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default React.memo(SubnetInfoTr);
