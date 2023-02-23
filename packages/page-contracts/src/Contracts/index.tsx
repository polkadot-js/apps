// Copyright 2017-2023 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { Button, styled } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Codes from '../Codes';
import CodeAdd from '../Codes/Add';
import CodeUpload from '../Codes/Upload';
import { useTranslation } from '../translate';
import { useCodes } from '../useCodes';
import { useContracts } from '../useContracts';
import ContractAdd from './Add';
import ContractsTable from './ContractsTable';
import Deploy from './Deploy';
import Summary from './Summary';

interface Props {
  className?: string;
}

function Contracts ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allCodes, codeTrigger } = useCodes();
  const { allContracts } = useContracts();
  const [isAddOpen, toggleAdd] = useToggle();
  const [isDeployOpen, toggleDeploy, setIsDeployOpen] = useToggle();
  const [isHashOpen, toggleHash] = useToggle();
  const [isUploadOpen, toggleUpload] = useToggle();
  const [codeHash, setCodeHash] = useState<string | undefined>();
  const [constructorIndex, setConstructorIndex] = useState(0);

  const _onShowDeploy = useCallback(
    (codeHash: string, constructorIndex: number): void => {
      setCodeHash(codeHash || (allCodes && allCodes[0] ? allCodes[0].json.codeHash : undefined));
      setConstructorIndex(constructorIndex);
      toggleDeploy();
    },
    [allCodes, toggleDeploy]
  );

  const _onCloseDeploy = useCallback(
    () => setIsDeployOpen(false),
    [setIsDeployOpen]
  );

  return (
    <StyledDiv className={className}>
      <Summary trigger={codeTrigger} />
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Upload & deploy code')}
          onClick={toggleUpload}
        />
        <Button
          icon='plus'
          label={t<string>('Add an existing code hash')}
          onClick={toggleHash}
        />
        <Button
          icon='plus'
          label={t<string>('Add an existing contract')}
          onClick={toggleAdd}
        />
      </Button.Group>
      <ContractsTable
        contracts={allContracts}
        updated={codeTrigger}
      />
      <Codes
        onShowDeploy={_onShowDeploy}
        updated={codeTrigger}
      />
      {codeHash && isDeployOpen && (
        <Deploy
          codeHash={codeHash}
          constructorIndex={constructorIndex}
          onClose={_onCloseDeploy}
          setConstructorIndex={setConstructorIndex}
        />
      )}
      {isUploadOpen && (
        <CodeUpload onClose={toggleUpload} />
      )}
      {isHashOpen && (
        <CodeAdd onClose={toggleHash} />
      )}
      {isAddOpen && (
        <ContractAdd onClose={toggleAdd} />
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--Table td > article {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }
`;

export default React.memo(Contracts);
