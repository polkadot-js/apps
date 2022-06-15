// Copyright 2017-2022 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface UploadRes {
  Hash: string,
  Size: string,
  Name: string,
  items?: UploadRes[],
}

export interface DirFile extends File {
  webkitRelativePath: string,
}

export interface SaveFile extends UploadRes {
  UpEndpoint: string,
  PinEndpoint: string,
}

export interface FileInfo {
  file?: File,
  files?: DirFile[],
  dir?: string,
}
