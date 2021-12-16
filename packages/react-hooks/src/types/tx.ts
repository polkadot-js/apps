// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Call } from '@polkadot/types/interfaces';
import type { IExtrinsic } from '@polkadot/types/types';

export type CallParam = any;

export type CallParams = [] | CallParam[];

export interface CallOptions <T> {
  defaultValue?: T;
  paramMap?: (params: any) => CallParams;
  transform?: (value: any) => T;
  withParams?: boolean;
  withParamsTransform?: boolean;
}

export type TxDef = [string, unknown[] | ((...params: unknown[]) => SubmittableExtrinsic<'promise'>)];

export type TxDefs = SubmittableExtrinsic<'promise'> | IExtrinsic | Call | TxDef | null;

export type TxSource<T extends TxDefs> = [T, boolean];

export interface ExtrinsicAndSenders {
  extrinsic: SubmittableExtrinsic<'promise'> | null;
  isSubmittable: boolean;
  sendTx: () => void;
  sendUnsigned: () => void;
}

export interface TxProps {
  accountId?: string | null;
  onChangeAccountId?: (_: string | null) => void;
  onSuccess?: () => void;
  onFailed?: () => void;
  onStart?: () => void;
  onUpdate?: () => void;
}

export interface TxState extends ExtrinsicAndSenders {
  isSending: boolean;
  accountId?: string | null;
  onChangeAccountId: (_: string | null) => void;
}
