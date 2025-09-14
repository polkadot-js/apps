// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartOptions, ChartTypeRegistry, TooltipItem } from 'chart.js';
import type { PalletConvictionVotingTally, PalletRankedCollectiveTally, PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally, PalletReferendaTrackDetails } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { CurveGraph, ReferendumProps as Props } from '../types.js';

import React, { useMemo } from 'react';

import { Chart, Columar, LinkExternal, styled, Table } from '@polkadot/react-components';
import { useBestNumber, useBlockInterval, useToggle } from '@polkadot/react-hooks';
import { calcBlockTime } from '@polkadot/react-hooks/useBlockTime';
import { BN_MILLION, BN_THOUSAND, bnMax, bnToBn, formatNumber, objectSpread } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Killed from './RefKilled.js';
import Ongoing from './RefOngoing.js';
import Tuple from './RefTuple.js';

const COMPONENTS: Record<string, React.ComponentType<Props>> = {
  Killed,
  Ongoing
};

const VAL_COLORS = ['#ff8c00', '#9c3333', '#339c33'];
const BOX_COLORS = {
  conf: 'rgba(255, 140, 0, 0.1)',
  enac: 'rgba(0, 0, 140, 0.1)',
  fail: 'rgba(140, 0, 0, 0.02)',
  pass: 'rgba(0, 140, 0, 0.02)',
  past: 'rgba(140, 140, 140, 0.2)'
};
const PT_CUR = 0;
const PT_NEG = 1;
const PT_POS = 2;

const OPTIONS: ChartOptions = {
  aspectRatio: 2.25,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

interface ChartResult {
  progress: {
    percent: number;
    value: BN;
    total: BN;
  };
  labels: string[];
  values: number[][];
}

interface ChartResultExt extends ChartResult {
  changeX: number;
  currentY: number;
  endConfirm: BN | null;
  points: BN[];
  since: BN;
}

interface ChartProps extends ChartResult {
  colors: string[];
  options: typeof OPTIONS;
}

function createTitleCallback (t: (key: string, options?: { replace: Record<string, unknown> }) => string, bestNumber: BN, blockInterval: BN, extraFn: (blockNumber: BN) => string): (items: TooltipItem<keyof ChartTypeRegistry>[]) => string | string[] {
  return ([{ label }]: TooltipItem<keyof ChartTypeRegistry>[]): string | string[] => {
    try {
      const blockNumber = bnToBn(label.replace(/,/g, ''));
      const extraTitle = extraFn(blockNumber);

      if (blockNumber.gt(bestNumber)) {
        const blocks = blockNumber.sub(bestNumber);
        const when = new Date(Date.now() + blocks.mul(blockInterval).toNumber()).toLocaleString();
        const calc = calcBlockTime(blockInterval, blocks, t);
        const result = [`#${label}`, t('{{when}} (est.)', { replace: { when } }), calc[1]];

        if (extraTitle) {
          result.push(extraTitle);
        }

        return result;
      }

      if (extraTitle) {
        return [`#${label}`, extraTitle];
      }
    } catch {
      // ignore
    }

    return `#${label}`;
  };
}

function getChartResult (totalEligible: BN, isConvictionVote: boolean, info: PalletReferendaReferendumInfoConvictionVotingTally | PalletReferendaReferendumInfoRankedCollectiveTally, track: PalletReferendaTrackDetails, trackGraph: CurveGraph): ChartResultExt[] | null {
  if (totalEligible && isConvictionVote && info.isOngoing) {
    const ongoing = info.asOngoing;

    if (ongoing.deciding.isSome) {
      const { approval, support, x } = trackGraph;
      const { deciding, tally } = ongoing;
      const { confirming, since } = deciding.unwrap();
      const endConfirm = confirming.unwrapOr(null);
      const currentSupport = isConvictionVote
        ? (tally as PalletConvictionVotingTally).support
        : (tally as PalletRankedCollectiveTally).bareAyes;
      const labels: string[] = [];
      const values: number[][][] = [[[], [], []], [[], [], []]];
      const supc = totalEligible.isZero()
        ? 0
        : currentSupport.mul(BN_THOUSAND).div(totalEligible).toNumber() / 10;
      const appc = tally.ayes.isZero()
        ? 0
        : tally.ayes.mul(BN_THOUSAND).div(tally.ayes.add(tally.nays)).toNumber() / 10;
      let appx = -1;
      let supx = -1;
      const points: BN[] = [];

      for (let i = 0; i < approval.length; i++) {
        labels.push(formatNumber(since.add(x[i])));
        points.push(x[i]);

        const appr = approval[i].div(BN_MILLION).toNumber() / 10;
        const appn = appc < appr;

        values[0][PT_CUR][i] = appr;
        values[0][appn ? PT_NEG : PT_POS][i] = appc;
        appx = (appn || appx !== -1) ? appx : i;

        const supr = support[i].div(BN_MILLION).toNumber() / 10;
        const supn = supc < supr;

        values[1][PT_CUR][i] = supr;
        values[1][supn ? PT_NEG : PT_POS][i] = supc;
        supx = (supn || supx !== -1) ? supx : i;
      }

      // Bringing it to a higher precision.
      // Otherwise, graphs with short periods (on dev chains) are invalid.
      const stepWithPrecision = x[x.length - 1].sub(x[0]).muln(100).divn(x.length);
      const lastIndex = x.length - 1;
      const lastBlock = endConfirm?.add(track.minEnactmentPeriod);

      // if the confirmation end is later than shown on our graph, we extend it
      if (lastBlock?.gt(since.add(x[lastIndex]))) {
        let currentBlockWithPrecision = x[lastIndex].add(since).muln(100).add(stepWithPrecision);
        let currentBlock = currentBlockWithPrecision.divn(100);

        do {
          labels.push(formatNumber(currentBlock));
          points.push(currentBlock.sub(since));

          // adjust approvals (no curve adjustment)
          // values[0][0].push(values[0][0][lastIndex]);
          values[0][1].push(values[0][1][lastIndex]);
          values[0][2].push(values[0][2][lastIndex]);

          // // adjust support
          // values[1][0].push(values[1][0][lastIndex]);
          values[1][1].push(values[1][1][lastIndex]);
          values[1][2].push(values[1][2][lastIndex]);

          currentBlockWithPrecision = currentBlockWithPrecision.add(stepWithPrecision);
          currentBlock = currentBlockWithPrecision.divn(100);
        } while (currentBlock.lt(lastBlock));
      }

      return [
        { changeX: appx, currentY: appc, endConfirm, labels, points, progress: { percent: appc, total: ongoing.tally.ayes.add(ongoing.tally.nays), value: ongoing.tally.ayes }, since, values: values[0] },
        { changeX: supx, currentY: supc, endConfirm, labels, points, progress: { percent: supc, total: totalEligible, value: currentSupport }, since, values: values[1] }
      ];
    }
  }

  return null;
}

function getChartProps (bestNumber: BN, blockInterval: BN, chartProps: ChartResultExt[], refId: BN, track: PalletReferendaTrackDetails, t: (key: string, options?: { replace: Record<string, unknown> }) => string): ChartProps[] {
  const changeXMax = chartProps.reduce((max, { changeX }) =>
    max === -1 || changeX === -1
      ? -1
      : Math.max(max, changeX),
  0);

  return chartProps.map(({ changeX, currentY, endConfirm, labels, points, progress, since, values }, index): ChartProps => {
    const maxX = labels.length;
    const maxY = index === 0
      ? 100
      : 50;

    const blockToX = (value: BN) =>
      Math.max(0, Math.min(maxX, maxX * (
        value.sub(since).toNumber() / points[points.length - 1].toNumber()
      )));

    const swapX = changeX === -1
      ? -1
      : maxX * (changeX / points.length);
    const enactX = changeXMax !== -1 && bnMax(bestNumber, points[changeXMax].add(since));
    const confirmX = endConfirm
      ? [endConfirm.sub(track.confirmPeriod), endConfirm, endConfirm.add(track.minEnactmentPeriod)]
      : enactX
        ? [enactX, enactX.add(track.confirmPeriod), enactX.add(track.confirmPeriod).add(track.minEnactmentPeriod)]
        : null;
    const title = createTitleCallback(t, bestNumber, blockInterval, (blockNumber) =>
      confirmX && blockNumber.gte(confirmX[0])
        ? blockNumber.lte(confirmX[1])
          ? t('Confirmation period')
          : blockNumber.lte(confirmX[2])
            ? t('Enactment period')
            : ''
        : ''
    );

    return {
      colors: VAL_COLORS,
      labels,
      options: objectSpread({
        plugins: {
          annotation: {
            annotations: objectSpread(
              {
                past: {
                  backgroundColor: BOX_COLORS.past,
                  borderWidth: 0,
                  type: 'box',
                  xMax: blockToX(bestNumber),
                  xMin: 0,
                  yMax: maxY,
                  yMin: 0
                }
              },
              confirmX
                ? {
                  conf: {
                    backgroundColor: BOX_COLORS.conf,
                    borderWidth: 0,
                    type: 'box',
                    xMax: blockToX(confirmX[1]),
                    xMin: blockToX(confirmX[0]),
                    yMax: maxY,
                    yMin: 0
                  },
                  enac: {
                    backgroundColor: BOX_COLORS.enac,
                    borderWidth: 0,
                    type: 'box',
                    xMax: blockToX(confirmX[2]),
                    xMin: blockToX(confirmX[1]),
                    yMax: maxY,
                    yMin: 0
                  }
                }
                : {},
              {
                fail: {
                  backgroundColor: BOX_COLORS.fail,
                  borderWidth: 0,
                  type: 'box',
                  xMax: swapX === -1
                    ? maxX
                    : swapX,
                  xMin: 0,
                  yMax: currentY,
                  yMin: 0
                }
              },
              swapX !== -1
                ? {
                  pass: {
                    backgroundColor: BOX_COLORS.pass,
                    borderWidth: 0,
                    type: 'box',
                    xMax: maxX,
                    xMin: swapX,
                    yMax: currentY,
                    yMin: 0
                  }
                }
                : {}
            )
          },
          crosshair: {
            sync: {
              group: refId.toNumber()
            }
          },
          tooltip: {
            callbacks: {
              title
            }
          }
        }
      }, OPTIONS),
      progress,
      values
    };
  });
}

function extractInfo (info: PalletReferendaReferendumInfoConvictionVotingTally | PalletReferendaReferendumInfoRankedCollectiveTally, track?: PalletReferendaTrackDetails): { confirmEnd: BN | null, enactAt: { at: boolean, blocks: BN, end: BN | null } | null, nextAlarm: null | BN, submittedIn: null | BN } {
  let confirmEnd: BN | null = null;
  let enactAt: { at: boolean, blocks: BN, end: BN | null } | null = null;
  let nextAlarm: BN | null = null;
  let submittedIn: BN | null = null;

  if (info.isOngoing) {
    const { alarm, deciding, enactment, submitted } = info.asOngoing;

    enactAt = {
      at: enactment.isAt,
      blocks: enactment.isAt
        ? enactment.asAt
        : enactment.asAfter,
      end: null
    };
    nextAlarm = alarm.unwrapOr([null])[0];
    submittedIn = submitted;

    if (deciding.isSome) {
      const { confirming } = deciding.unwrap();

      if (confirming.isSome) {
        // we are confirming with the specific end block
        confirmEnd = confirming.unwrap();

        if (track) {
          // add our track data
          const fastEnd = confirmEnd.add(track.minEnactmentPeriod);

          enactAt.end = enactment.isAt
            ? bnMax(fastEnd, enactment.asAt)
            : fastEnd.add(enactment.asAfter);
        }
      }
    }
  }

  return { confirmEnd, enactAt, nextAlarm, submittedIn };
}

function Referendum (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bestNumber = useBestNumber();
  const blockInterval = useBlockInterval();
  const { activeIssuance, className = '', palletReferenda, value: { id, info, isConvictionVote, track, trackGraph } } = props;
  const [isExpanded, toggleExpanded] = useToggle(false);

  const Component = useMemo(
    () => COMPONENTS[info.type] || Tuple,
    [info]
  );

  const chartResult = useMemo(
    () => activeIssuance && track && trackGraph &&
      getChartResult(activeIssuance, isConvictionVote, info, track, trackGraph),
    [activeIssuance, info, isConvictionVote, track, trackGraph]
  );

  const chartProps = useMemo(
    () => bestNumber && chartResult && isExpanded && track &&
      getChartProps(bestNumber, blockInterval, chartResult, id, track, t),
    [bestNumber, blockInterval, chartResult, id, isExpanded, t, track]
  );

  const { confirmEnd, enactAt, nextAlarm, submittedIn } = useMemo(
    () => extractInfo(info, track),
    [info, track]
  );

  const chartLegend = useMemo(
    () => [
      [
        t('minimum approval'),
        t('current approval (failing)'),
        t('current approval (passing)')
      ],
      [
        t('minimum support'),
        t('current support (failing)'),
        t('current support (passing)')
      ]
    ],
    [t]
  );

  return (
    <>
      <StyledTr className={`${className} isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}>
        <Table.Column.Id value={id} />
        <Component {...props} />
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleExpanded}
        />
      </StyledTr>
      <StyledTr className={`${className} ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'}`}>
        <td />
        <td
          className='columar'
          colSpan={6}
        >
          {chartProps && (
            <Columar>
              <Columar.Column>
                <Chart.Line
                  legends={chartLegend[0]}
                  title={t('approval / {{percent}}%', { replace: { percent: chartProps[0].progress.percent.toFixed(1) } })}
                  {...chartProps[0]}
                />
              </Columar.Column>
              <Columar.Column>
                <Chart.Line
                  legends={chartLegend[1]}
                  title={t('support / {{percent}}%', { replace: { percent: chartProps[1].progress.percent.toFixed(1) } })}
                  {...chartProps[1]}
                />
              </Columar.Column>
            </Columar>
          )}
          <Columar size='tiny'>
            <Columar.Column>
              {submittedIn && (
                <>
                  <h5>{t('Submitted at')}</h5>
                  #{formatNumber(submittedIn)}
                </>
              )}
              {nextAlarm && (
                <>
                  <h5>{t('Next alarm')}</h5>
                  #{formatNumber(nextAlarm)}
                </>
              )}
            </Columar.Column>
            <Columar.Column>
              {enactAt && (
                <>
                  <h5>{enactAt.at ? t('Enact at') : t('Enact after')}</h5>
                  {enactAt.at && '#'}{t('{{blocks}} blocks', { replace: { blocks: formatNumber(enactAt.blocks) } })}
                </>
              )}
              {confirmEnd && (
                <>
                  <h5>{t('Confirm end')}</h5>
                  #{formatNumber(confirmEnd)}
                </>
              )}
              {enactAt?.end && (
                <>
                  <h5>{t('Enact end')}</h5>
                  #{formatNumber(enactAt.end)}
                </>
              )}
            </Columar.Column>
          </Columar>
          <Columar
            is100
            size='tiny'
          >
            <Columar.Column>
              <LinkExternal
                data={id}
                type={palletReferenda}
                withTitle
              />
            </Columar.Column>
          </Columar>
        </td>
        <td />
      </StyledTr>
    </>
  );
}

const StyledTr = styled.tr`
  .shortHash {
    max-width: var(--width-shorthash);
    min-width: 3em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: var(--width-shorthash);
  }
`;

export default React.memo(Referendum);
