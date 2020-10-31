// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: "AccountId",
  LookupSource: "AccountId",
  TaskId: "Hash",
  Duration: "u64",
  Ciphertext: "Vec<u8>",
  User: {
    account_id: "AccountId",
    public_key: "Vec<u8>"
  },
  Enclave: {
    account_id: "AccountId",
    public_key: "Vec<u8>",
    attestation: "Vec<u8>"
  },
  Worker: {
    account_id: "AccountId",
    enclave: "Enclave"
  },
  TaskStatus: "Vec<u8>",
  Privacy: "Vec<u8>",
  TaskSpec: {
    pod_spec: "Vec<u8>",
    volume_spec: "Vec<u8>",
    privacy: "Privacy"
  },
  Task: {
    task_id: "TaskId",
    status: "TaskStatus",
    owner: "AccountId",
    lease: "Duration",
    task_spec: "TaskSpec",
    worker: "Option<AccountId>",
    worker_url: "Option<Ciphertext>"
  }
};
