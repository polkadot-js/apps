// Copyright 2017-2020 @canvas-ui/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson, CodecArg, Constructor, Registry } from '@polkadot/types/types';
import { InkConstructorSpec, InkMessageSpec, InkTypeSpec } from '@polkadot/types/interfaces';
import { InkConstructor, InkMessageBase, InkMessage, InkMessageParam, InkType } from './types';

import { Compact, createClass, encodeType } from '@polkadot/types';
import { assert, isObject, isUndefined, stringCamelCase } from '@polkadot/util';

import InkRegistry from './InkRegistry';

function createArgClass (registry: Registry, args: InkMessageParam[], baseDef: Record<string, string>): Constructor {
  return createClass(
    registry,
    JSON.stringify(
      args.reduce((base: Record<string, any>, { name, type }): Record<string, any> => {
        base[name] = type.displayName || encodeType(type);

        return base;
      }, baseDef)
    )
  );
}

export default class InkAbi extends InkRegistry {
  public readonly constructors: InkConstructor[];

  public readonly messages: InkMessage[];

  constructor (registry: Registry, json: AnyJson) {
    super(registry, json);
    [this.constructors, this.messages] = this._decodeProject();
  }

  private _createInkType (spec: InkTypeSpec): InkType {
    const displayName = spec.displayName.toString();

    return {
      displayName: displayName?.length > 0 ? displayName : undefined,
      type: this.typeDefAt(spec.id)
    };
  }

  private _createBase (identifier: string, spec: InkMessageSpec | InkConstructorSpec): InkMessageBase {
    const args = spec.args.map(({ name, type }): InkMessageParam => {
      assert(isObject(type), `Invalid type at index ${type.toString()}`);

      return {
        name: stringCamelCase(name.toString()),
        type: this.typeDefAt(type.id)
      };
    });

    const Clazz = createArgClass(this.registry, args, isUndefined(spec.selector) ? {} : { __selector: 'u32' });
    const baseStruct: { [index: string]: any } = { __selector: this.registry.createType('u32', spec.selector) };

    const fn = ((...params: CodecArg[]): Uint8Array => {
      assert(params.length === args.length, `Expected ${args.length} arguments to contract message '${identifier}', found ${params.length}`);

      const u8a = new Clazz(
        this.registry,
        args.reduce((mapped, { name }, index): Record<string, CodecArg> => {
          mapped[name] = params[index];

          return mapped;
        }, { ...baseStruct })
      ).toU8a();

      return Compact.addLengthPrefix(u8a);
    }) as InkMessage;

    fn.args = args;
    fn.identifier = identifier;
    fn.docs = spec.docs.map((doc) => doc.toString());

    return fn;
  }

  private _createConstructor (identifier: string, spec: InkConstructorSpec): InkConstructor {
    const fn = this._createBase(identifier, spec);

    fn.isConstructor = true;

    return fn;
  }

  private _createMessage (identifier: string, spec: InkMessageSpec): InkMessage {
    const fn = this._createBase(identifier, spec) as InkMessage;

    fn.isConstructor = false;
    fn.mutates = spec.mutates.valueOf();
    fn.payable = spec.payable.valueOf();
    fn.returnType = spec.returnType.isSome ? this._createInkType(spec.returnType.unwrap()) || null : null;

    return fn;
  }

  private _decodeProject (): [InkConstructor[], InkMessage[]] {
    const constructors = this.project.spec.constructors.map(
      (constructor): InkConstructor => {
        return this._createConstructor(constructor.name.toString(), constructor);
      }
    );

    const messages = this.project.spec.messages.map(
      (message): InkMessage => {
        return this._createMessage(message.name.toString(), message);
      }
    );

    return [constructors, messages];
  }
}
