// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface UploadRes {
  Hash: string,
  Size: string,
  Name: string
}

export interface SaveFile extends UploadRes {
  UpEndpoint: string,
  PinEndpoint: string,
}
