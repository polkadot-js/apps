// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Text } from '@polkadot/types';

import React, { useMemo } from 'react';

import { useToggle } from '@polkadot/react-hooks';

import Icon from './Icon.js';
import { styled } from './styled.js';

interface Meta {
  docs: Text[];
}

export interface Props {
  children?: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  isHeader?: boolean;
  isLeft?: boolean;
  isPadded?: boolean;
  onClick?: (isOpen: boolean) => void;
  renderChildren?: (() => React.ReactNode | undefined | null) | null;
  summary?: React.ReactNode;
  summaryHead?: React.ReactNode;
  summaryMeta?: Meta;
  summarySub?: React.ReactNode;
  withBreaks?: boolean;
  withHidden?: boolean;
}

function splitSingle (value: string[], sep: string): string[] {
  return value.reduce((result: string[], value: string): string[] => {
    return value.split(sep).reduce((result: string[], value: string) => result.concat(value), result);
  }, []);
}

function splitParts (value: string): string[] {
  return ['[', ']'].reduce((result: string[], sep) => splitSingle(result, sep), [value]);
}

function formatMeta (meta?: Meta): [React.ReactNode, React.ReactNode] | null {
  if (!meta?.docs.length) {
    return null;
  }

  const strings = meta.docs.map((d) => d.toString().trim());
  const firstEmpty = strings.findIndex((d) => !d.length);
  const combined = (
    firstEmpty === -1
      ? strings
      : strings.slice(0, firstEmpty)
  ).join(' ').replace(/# ?<weight>[^<]*<\/weight>/, '');
  const parts = splitParts(combined.replace(/\\/g, '').replace(/`/g, ''));

  return [
    parts[0].split(/[.(]/)[0],
    <>{parts.map((part, index) => index % 2 ? <em key={index}>[{part}]</em> : <span key={index}>{part}</span>)}&nbsp;</>
  ];
}

function Expander ({ children, className = '', isHeader, isLeft, isOpen, isPadded, onClick, renderChildren, summary, summaryHead, summaryMeta, summarySub, withBreaks, withHidden }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleExpanded] = useToggle(isOpen, onClick);

  const demandChildren = useMemo(
    () => isExpanded && renderChildren && renderChildren(),
    [isExpanded, renderChildren]
  );

  const [headerSubMini, headerSub] = useMemo(
    () => formatMeta(summaryMeta) || [summarySub, summarySub],
    [summaryMeta, summarySub]
  );

  const hasContent = useMemo(
    () => !!renderChildren || (!!children && (!Array.isArray(children) || children.length !== 0)),
    [children, renderChildren]
  );

  const icon = useMemo(
    () => (
      <Icon
        color={
          hasContent
            ? undefined
            : 'transparent'
        }
        icon={
          isExpanded
            ? 'caret-up'
            : 'caret-down'
        }
      />
    ),
    [hasContent, isExpanded]
  );

  return (
    <StyledDiv className={`${className} ui--Expander ${isExpanded ? 'isExpanded' : ''} ${isHeader ? 'isHeader' : ''} ${isPadded ? 'isPadded' : ''} ${hasContent ? 'hasContent' : ''} ${withBreaks ? 'withBreaks' : ''}`}>
      <div
        className={`ui--Expander-summary${isLeft ? ' isLeft' : ''}`}
        onClick={toggleExpanded}
      >
        {isLeft && icon}
        <div className='ui--Expander-summary-header'>
          <div className='ui--Expander-summary-title'>
            {summaryHead}
          </div>
          {summary}
          {headerSub && (
            <div className='ui--Expander-summary-header-sub'>{isExpanded ? headerSub : headerSubMini}</div>
          )}
        </div>
        {!isLeft && icon}
      </div>
      {hasContent && (isExpanded || withHidden) && (
        <div className='ui--Expander-content'>{children || demandChildren}</div>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  max-width: 60rem;
  overflow: hidden;
  text-overflow: ellipsis;

  &:not(.isExpanded) {
    .ui--Expander-content {
      display: none;
    }
  }

  &.isExpanded {
    .ui--Expander-content {
      margin-top: 0.75rem;

      .body.column {
        justify-content: end;
      }
    }
  }

  &.isHeader {
    margin-left: 2rem;
  }

  &.withBreaks .ui--Expander-content {
    white-space: normal;
  }

  .ui--Expander-summary {
    margin: 0;
    min-width: 13.5rem;
    overflow: hidden;

    .ui--Expander-summary-header {
      display: inline-block;
      max-width: calc(100% - 2rem);
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      white-space: nowrap;

      span {
        white-space: normal;
      }

      .ui--Expander-summary-header-sub,
      .ui--Expander-summary-title {
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        box-orient: vertical;
        display: -webkit-box;
        line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }

      .ui--Expander-summary-header-sub {
        font-size: var(--font-size-small);
        opacity: var(--opacity-light);
      }
    }

    .ui--Icon {
      vertical-align: middle;
    }

    &:not(.isLeft) > .ui--Icon {
      margin-left: 0.75rem;
    }

    &.isLeft > .ui--Icon {
      margin-right: 0.75rem;
    }

    .ui--LabelHelp {
      .ui--Icon {
        margin-left: 0;
        margin-right: 0.5rem;
        vertical-align: text-bottom;
      }
    }
  }

  &.hasContent .ui--Expander-summary {
    cursor: pointer;
  }

  &.isPadded .ui--Expander-summary {
    margin-left: 2.25rem;
  }
`;

export default React.memo(Expander);
