// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type DeriveSubscription = {
  subscribe (cb: (result: any) => any): Promise<number>,
  unsubscribe (subsciptionId: number): Promise<any>
};
