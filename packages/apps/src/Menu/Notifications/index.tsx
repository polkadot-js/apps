// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Badge, Icon, styled } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import NotificationsModal from './modal.js';

interface Props {
  count?: number;
  className?: string;
  isToplevel?: boolean;
  classNameText?: string;
}

const Notifications = ({ className, count = 5, isToplevel = true }: Props) => {
  const { t } = useTranslation();
  const [isModalVisible, toggleModal] = useToggle();

  return (
    <StyledLi className={`${className} ui--MenuItem ${count ? 'withCounter' : ''} isLink ${isToplevel ? 'topLevel highlight--color-contrast' : ''}`}>
      <section onClick={toggleModal}>
        <Icon icon={'bell'} />
        <span className='media--800'>{t('Notifications')}</span>
        {!!count && (
          <Badge
            color='white'
            info={count}
          />
        )}
      </section>
      {isModalVisible && <NotificationsModal toggleModal={toggleModal} />}
    </StyledLi>
  );
};

const StyledLi = styled.li`
  cursor: pointer;
  position: relative;
  white-space: nowrap;

  &.topLevel {
    font-weight: var(--font-weight-normal);
    line-height: 1.214rem;
    border-radius: 0.15rem;

    section {
      padding: 0.857rem 0.857em 0.857rem 1rem;
      line-height: 1.214rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s ease;
    }

    &:hover section {
      background-color: rgba(0, 0, 0, 0.2);
    }

    &.isActive.highlight--color-contrast {
      font-weight: var(--font-weight-normal);
      color: var(--color-text);

      section {
        background-color: var(--bg-tabs);
      }
    }

    &.isActive {
      border-radius: 0.15rem 0.15rem 0 0;

      section {
        padding: 0.857rem 1.429rem 0.857rem;
        cursor: default;
      }

      &&.withCounter section {
        padding-right: 3.2rem;
      }
    }

    .ui--Badge {
      top: 0.7rem;
    }
  }

  &&.withCounter section {
    padding-right: 3.2rem;
  }

  section {
    color: inherit !important;
    display: block;
    padding: 0.5rem 1.15rem 0.57rem;
    text-decoration: none;
    line-height: 1.5rem;
  }

  .ui--Badge {
    position: absolute;
    right: 0.5rem;
  }

  .ui--Icon {
    margin-right: 0.5rem;
  }
`;

export default React.memo(Notifications);
