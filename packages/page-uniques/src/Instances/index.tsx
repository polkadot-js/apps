// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UniqueInfo, UniqueInfoComplete } from '../types';

import type { PalletAssetsAssetAccount , PalletUniquesInstanceDetails , PalletUniquesClassDetails} from '@polkadot/types/lookup';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import  { BN } from '@polkadot/util';
import { Dropdown, Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Instance from './Instance';
import useInstances from './useInstances';

interface Props {
  infos?: UniqueInfo[];
}

function Instances ({ infos = [] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [infoIndex, setInfoIndex] = useState(0);
  const [info, setInfo] = useState<UniqueInfoComplete | null>(null);
  // const instances = (info != undefined)? useInstances([info.id]): [];
  const instances = useInstances(info?.id);

  const headerRef = useRef([
    [t('instances'), 'start'],
    [t('frozen'), 'start'],
    [],
    [],
    []
  ]);

  const completeInfos = useMemo(
    () => infos
      .filter((i): i is UniqueInfoComplete => !!(i.details && i.metadata) && !i.details.instances.isZero())
      .sort((a, b) => a.id.cmp(b.id)),
    [infos]
  );

  const uniqueOptions = useMemo(
    () => completeInfos.map(({ id, metadata }, index) => ({
      text: `${formatNumber(id)}`,
      value: index
    })),
    [completeInfos]
  );

  useEffect((): void => {
    setInfo(() =>
      infoIndex >= 0 && infoIndex < completeInfos.length
        ? completeInfos[infoIndex]
        : null
    );
  }, [completeInfos, infoIndex]);

  // class PProps {
  //   instance: PalletUniquesInstanceDetails;
  //   instanceId: BN;
  //   constructor(instanceId:BN, instance:PalletUniquesInstanceDetails) {
  //     this.instance = instance;
  //     this.instanceId = instanceId;
  //    }
  // }
  
  // let mymap:PProps[]  = [];
  // if (instances === null) {
  //   return (<div/>);
  // }
  // for (var index of instances) {
  //   let instance: BN, instanceId:PalletUniquesInstanceDetails = index;
  //   mymap.push(new PProps(instanceId, instance ));
  // }

  return (
    <div>
      <Table
        empty={info && instances && t<string>('No instances found for the unique class')}
        filter={uniqueOptions.length
          ? (
            <Dropdown
              isFull
              label={t<string>('unique class to query for instances')}
              onChange={setInfoIndex}
              options={uniqueOptions}
              value={infoIndex}
            />
          )
          : undefined
        }
        header={headerRef.current}
      >
        {info && instances?.map(( instance ) => (
          <Instance
            instance={instance}
            uniqueId={info.id}
            key={"7".toString()}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Instances)`
  table {
    overflow: auto;
  }
`);
