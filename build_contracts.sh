#!/usr/bin/env bash
# Copyright 2017-2021 @canvas-ui/api authors & contributors
# SPDX-License-Identifier: Apache-2.0

function build_contract () {
  (echo "** Building example contract $1",cargo +nightly contract build,cargo +nightly contract generate-metadata
)
}

function build_and_copy_contract () {
  parent="$(dirname "$PWD")"
  (
    cd "$parent/ink/examples/$1"

    echo "** Building example contract $1"
    cargo +nightly contract build
    cargo +nightly contract generate-metadata
  )

  echo "** Copying example contract $1 to project"
  cp "$parent/ink/examples/$1/target/metadata.json" "$parent/canvas-ui/packages/api-contract/test/contracts/$1.json"
  cp "$parent/ink/examples/$1/target/$1.wasm" "$parent/canvas-ui/packages/api-contract/test/contracts/$1.wasm"
}

build_and_copy_contract "delegator"
build_and_copy_contract "dns"
build_and_copy_contract "erc20"
build_and_copy_contract "erc721"
build_and_copy_contract "flipper"
build_and_copy_contract "incrementer"
build_and_copy_contract "multisig_plain"
build_and_copy_contract "trait-flipper"
