import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, CardSummary, Input, InputAddress, SummaryBox, Table } from '@polkadot/react-components';
import { callXAgereRpc } from '../callXAgereRpc.js';
import { useApi, useToggle } from '@polkadot/react-hooks';
import SubnetInfoTr from './SubnetInfoTr.js';
import { SubnetInfo } from './Subnet.js';
import { FormatBalance } from '@polkadot/react-query';
import { asciiToString, formatBEVM } from '../Utils/formatBEVM.js';
import CopyToClipboard from 'react-copy-to-clipboard';

interface Props {
  className?: string;
  selectedInfo: SubnetInfo;
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

function SubnetDetail({ className, selectedInfo, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [neurons, setNeurons] = useState<NeuronInfo[]>([]);
  const { systemChain } = useApi();
  const GITHUB_REPO = selectedInfo?.identity?.github_repo ? asciiToString(selectedInfo.identity.github_repo) : '-'

  useEffect(() => {
    callXAgereRpc('xagere_getNeuronsLite', [selectedInfo.netuid], systemChain)
      .then((response) => {
        console.log('response', response);
        // Sort neurons by total stake from high to low

        if (Array.isArray(response)) {
          const formatRep = response.sort((a, b) => {
          const totalStakeA = a.stake.reduce((sum, [_, amount]) => sum + Number(amount), 0);
          const totalStakeB = b.stake.reduce((sum, [_, amount]) => sum + Number(amount), 0);
          return totalStakeB - totalStakeA;
        });
        setNeurons(formatRep);
        }
      })
      .catch(console.error);
  }, [selectedInfo, systemChain]);

  const header = [
    [t('Pos'), 'start'],
    [t('User Type'), 'start'],
    [t('User UID'), 'start'],
    [t('Stake'), 'start'],
    [t('VTrust'), 'start'],
    [t('Trust'), 'start'],
    [t('Hot Key'), 'start'],
    [t('Cold Key'), 'start'],
    []
  ];


  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t(`${asciiToString(selectedInfo.identity?.subnet_name)} Details`), 'start', 1],
    [<Button
      icon='times'
      onClick={onClose}
      label={t('Back to homepage')}
    />, 'end', 1]

  ]);

  return (
   <>
     <Table
       className={className}
       header={headerRef.current}
     >
       <tr>
         <td colSpan={2}>
           <InputAddress
            label={t('Owner')}
            value={selectedInfo?.owner ?? '-'}
            isDisabled={true}
            type='allPlus'
            defaultValue={selectedInfo?.owner ?? '-'}
          />
         </td>
       </tr>
       <tr>
         <td colSpan={2}>
         <Input
             className='full'
             isDisabled
             label={t('Github Repo')}
             value={GITHUB_REPO}
           />
         </td>
       </tr>
       <tr>
         <td colSpan={2}>
           <Input
             className='full'
             isDisabled
             label={t('Contact')}
             value={selectedInfo?.identity?.subnet_contact ? asciiToString(selectedInfo.identity.subnet_contact) : '-'}
           />
         </td>
       </tr>
     </Table>
     <SummaryBox className={className}>
       <CardSummary label={t('Emissions')}>
         <span>{formatBEVM(selectedInfo.emission_values)}</span>
       </CardSummary>
       <CardSummary label={t('Validator')}>
         <span>{selectedInfo.max_allowed_validators}</span>
       </CardSummary>
       <CardSummary label={t('Miner')}>
         <span>{selectedInfo.min_allowed_weights}</span>
       </CardSummary>
     </SummaryBox>

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
   </>
  );
}

export default React.memo(SubnetDetail);
