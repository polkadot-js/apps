import React from 'react';
import { RuntimeVersion } from '@polkadot/types/interfaces';
import styled from 'styled-components';
import { ChainImg } from '@polkadot/react-components';
import { BestNumber, Chain } from '@polkadot/react-query';
import { useTranslation } from '../translate';
import { colors } from '../../../../styled-theming';

interface Props {
  runtimeVersion: RuntimeVersion;
  _toggleModal: (arg0: string) => any;
}

const SideBarHeaderContainer = styled.div`
  align-items: center;
  color: ${colors.N0};
  cursor: pointer;
  display: flex;
  font-size: 12px;
  height: 3rem;
  line-height: 1rem;
  margin: 1rem 0 2rem;

  .info {
    margin-left: 0.5rem;
  }

  .expanded & {
    width: 100%;
  }

  .collapsed & {
    padding: 0;
    width: 3rem;

    .info {
      display: none;
    }
  }

  img {
    height: 3rem;
    width: 3rem;
  }
`;

function SideBarHeader ({ _toggleModal, runtimeVersion }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SideBarHeaderContainer
      className='apps--SideBar-logo'
      onClick={_toggleModal('network')}
    >
      <ChainImg logo='cennznet' />
      <div className='info'>
        <Chain className='chain' />
          <div className='runtimeVersion'>{t('version {{version}}', { replace: { version: runtimeVersion.specVersion.toNumber() } })}</div>
        <BestNumber label='#' />
      </div>
    </SideBarHeaderContainer>
  );
}

export default SideBarHeader;
