// Copyright 2017-2020 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson, CodecArg, Constructor, Registry } from '@polkadot/types/types';
import { InkConstructorSpec, InkMessageSpec } from '@polkadot/types/interfaces';
import { AbiConstructor, AbiMessage, AbiMessageParam } from './types';

import { Compact, createClass, encodeTypeDef } from '@polkadot/types';
import { assert, isObject, isUndefined, stringCamelCase } from '@polkadot/util';

import ContractRegistry from './ContractRegistry';

function createArgClass (registry: Registry, args: AbiMessageParam[], baseDef: Record<string, string>): Constructor {
  return createClass(
    registry,
    JSON.stringify(
      args.reduce((base: Record<string, any>, { name, type }): Record<string, any> => {
        base[name] = type.displayName || encodeTypeDef(type);

        return base;
      }, baseDef)
    )
  );
}

function extendBase (fn: AbiMessage, add: Partial<AbiMessage> = {}): AbiMessage {
  return Object.entries(add).reduce((fn: AbiMessage, [key, value]): AbiMessage => {
    // do some magic
    fn[key as 'args'] = value as AbiMessageParam[];

    return fn;
  }, fn);
}

export default class Abi extends ContractRegistry {
  public readonly constructors: AbiConstructor[];

  public readonly messages: AbiMessage[];

  constructor (registry: Registry, json: AnyJson) {
    super(registry, json);

    this.constructors = this.project.spec.constructors.map((spec: InkConstructorSpec, index) =>
      this._createBase(spec, {
        index,
        isConstructor: true
      })
    );
    this.messages = this.project.spec.messages.map((spec: InkMessageSpec, index): AbiMessage => {
      const typeSpec = spec.returnType.unwrapOr(null);

      return this._createBase(spec, {
        index,
        isMutating: spec.mutates.isTrue,
        isPayable: spec.payable.isTrue,
        returnType: typeSpec
          ? this.typeDefAt(typeSpec.type, { displayName: typeSpec.displayName.map((s) => s.toString()).join('::') || undefined })
          : null
      });
    });
  }

  private _createBase (spec: InkMessageSpec | InkConstructorSpec, add: Partial<AbiMessage> = {}): AbiMessage {
    const identifier = spec.name.toString();
    const args = spec.args.map(({ name, type }): AbiMessageParam => {
      assert(isObject(type), `Invalid type at index ${type.toString()}`);

      return {
        name: stringCamelCase(name.toString()),
        type: this.typeDefAt(type.type)
      };
    });

    const Clazz = createArgClass(this.registry, args, isUndefined(spec.selector) ? {} : { __selector: 'u32' });
    const baseStruct: { [index: string]: any } = { __selector: this.registry.createType('u32', spec.selector) };

    const fn = ((...params: CodecArg[]): Uint8Array => {
      assert(params.length === args.length, `Expected ${args.length} arguments to contract message '${identifier}', found ${params.length}`);

      return Compact.addLengthPrefix(new Clazz(this.registry, args.reduce((mapped, { name }, index): Record<string, CodecArg> => {
        mapped[name] = params[index];

        return mapped;
      }, { ...baseStruct })).toU8a());
    }) as AbiMessage;

    return extendBase(fn, {
      ...add,
      args,
      docs: spec.docs.map((doc) => doc.toString()),
      identifier
    });
  }
}
