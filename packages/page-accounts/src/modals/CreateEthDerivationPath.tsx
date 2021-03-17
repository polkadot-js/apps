// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from "react";
import { Checkbox, Dropdown, Input, InputNumber, MarkError, MarkWarning, Modal } from "@polkadot/react-components";

import { useTranslation } from "../translate";
// import { AVAIL_INDEXES } from "./Ledger";
import { DeriveValidationOutput, PairType } from "../types";
import BN from 'bn.js';

interface Props {
  className?: string;
  onChange: (string: string) => void;
  seedType: string;
  derivePath: string;
  deriveValidation: DeriveValidationOutput | undefined;
  seed: string;
  addressFromSeed: (seed: string, derivePath: string, pairType: PairType) => string;
}

export const ETH_DEFAULT_PATH = "m/44'/60'/0'/0/0";
// const derivePathList = new Array(20).fill(0).map((_, i) => {
//   return `m/44'/60'/0'/0/${i}`;
// });
// console.log("derivePathList", derivePathList);

function CreateEthDerivationPath({
  className,
  onChange,
  seedType,
  derivePath,
  deriveValidation,
  seed,
  addressFromSeed
}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [addIndex, setAddIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(5);
  const [addressList, setAddressList] = useState(
    
    new Array(maxIndex).fill(0).map((_, i) => ({
        text: t("Address index {{index}} - {{address}}", { replace: { index: i, address: addressFromSeed(seed, `m/44'/60'/0'/0/${i}` , "ethereum") } }),
        value:i,
        key:i
      }))
  );
  const [useCustomPath, setUseCustomPath] = useState(false);
  //   console.log("derivePathList", derivePathList);
  //   const addressList =
  //     derivePathList.map(deri => {
  //       return addressFromSeed(seed, deri, "ethereum");
  //     })

  const errorIndex = useRef<Record<string, string>>({
    INVALID_DERIVATION_PATH: t<string>("This is an invalid derivation path."),
    PASSWORD_IGNORED: t<string>("Password are ignored for hex seed"),
    SOFT_NOT_ALLOWED: t<string>("Soft derivation paths are not allowed on ed25519"),
    WARNING_SLASH_PASSWORD: t<string>(
      'Your password contains at least one "/" character. Disregard this warning if it is intended.'
    )
  });

  //   const addOps = useRef(
  //     new Array(maxIndex).fill(0).map((value, i) => ({
  //       text: t("Address index {{index}} - {{address}}", { replace: { index: value, address: `m/44'/60'/0'/0/${i}` } }),
  //       value
  //     }))
  //   );

  useEffect((): void => {
    setAddressList(
      new Array(maxIndex).fill(0).map((_, i) => ({
        text: t("Address index {{index}} - {{address}}", { replace: { index: i, address: addressFromSeed(seed, `m/44'/60'/0'/0/${i}` , "ethereum") } }),
        value:i,
        key:i
      }))
    );
  }, [maxIndex,seed]);

  const _toggleCustomPath = () => {
    setUseCustomPath(!useCustomPath);
  };

  const onChangeMaxIndex = (e:BN) => {
    setMaxIndex(Number(e));
  };

  useEffect((): void => {
    onChange(`m/44'/60'/0'/0/${addIndex}`);
  }, [addIndex, onChange]);

  return (
    <Modal.Columns
      className={className}
      hint={
        seedType === "raw"
          ? t<string>("The derivation path is only relevant when deriving keys from a mnemonic.")
          : t<string>("The derivation path allows you to create different accounts from the same base mnemonic.")
      }
    >
      {seedType === "bip" ? (
        <>
          <Dropdown
            help={t("The address index (derivation on account) to use")}
            label={t("address index")}
            onChange={setAddIndex}
            options={addressList}
            value={addIndex}
          />
          {/* <Dropdown
            help={t("Choose the number of address to display")}
            label={t("Max index")}
            onChange={setMaxIndex}
            options={addressList}
            value={addIndex}
          /> */}
          <InputNumber
            help={t<string>("Choose the number of address to display")}
            label={t<string>("Max index")}
            onChange={onChangeMaxIndex}
            // placeholder={ETH_DEFAULT_PATH}
            isDecimal={false}
            value={new BN(maxIndex)}
          />
          <div className="saveToggle">
            <Checkbox
              label={<>{t<string>("Use custom derivation path")}</>}
              onChange={_toggleCustomPath}
              value={useCustomPath}
            />
          </div>
          {useCustomPath ? (
            <Input
              help={t<string>(
                'You can set a custom derivation path for this account using the following syntax "m/<purpose>/<coin_type>/<account>/<change>/<address_index>'
              )}
              isError={!!deriveValidation?.error}
              label={t<string>("secret derivation path")}
              onChange={onChange}
              placeholder={ETH_DEFAULT_PATH}
              tabIndex={-1}
              value={derivePath}
            />
          ) : null}
        </>
      ) : (
        <MarkWarning content={t<string>("The derivation path is only relevant when deriving keys from a mnemonic.")} />
      )}

      {deriveValidation?.error && (
        <MarkError content={errorIndex.current[deriveValidation.error] || deriveValidation.error} />
      )}
      {deriveValidation?.warning && <MarkWarning content={errorIndex.current[deriveValidation.warning]} />}
    </Modal.Columns>
  );
}

export default React.memo(CreateEthDerivationPath);
