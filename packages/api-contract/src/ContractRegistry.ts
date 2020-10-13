// Copyright 2017-2020 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InkProject, MtField, MtLookupTypeId, MtType, MtTypeDefArray, MtTypeDefVariant, MtTypeDefSequence, MtTypeDefTuple, MtVariant } from '@polkadot/types/interfaces';
import { AnyJson, TypeDef, TypeDefInfo } from '@polkadot/types/types';

import { assert, isObject, isUndefined } from '@polkadot/util';
import { TypeRegistry, withTypeString } from '@polkadot/types';

// convert the offset into project-specific, index-1
export function getRegistryOffset (id: MtLookupTypeId): number {
  return id.toNumber() - 1;
}

function isNativeInkType (inkType: MtType) {
  if (!inkType.path[0]) {
    return true;
  }

  const prefix = inkType.path[0].toString();

  return ['ink_env', 'ink_storage', 'Option', 'Result'].includes(prefix);
}

export default class ContractRegistry {
  public typeDefs: TypeDef[] = [];

  public registry: TypeRegistry;

  public project: InkProject;

  public json: AnyJson;

  constructor (registry: TypeRegistry, json: AnyJson) {
    assert(isObject(json) && !Array.isArray(json) && json.metadataVersion && isObject(json.spec) && !Array.isArray(json.spec) && Array.isArray(json.spec.constructors) && Array.isArray(json.spec.messages), 'Invalid JSON ABI structure supplied, expected a recent metadata version');

    this.registry = registry;
    this.json = json;
    this.project = registry.createType('InkProject', json);

    // Generate TypeDefs for each provided registry type
    this.project.types.forEach((_, index) => this.setTypeDef(this.registry.createType('MtLookupTypeId', index + 1)));
  }

  public getAbiType (id: MtLookupTypeId): MtType {
    const offset = getRegistryOffset(id);
    const type = this.project.types[offset];

    assert(!isUndefined(type), `getAbiType:: Unable to find ${id.toNumber()} in type values`);

    return this.registry.createType('MtType', type);
  }

  public typeDefAt (id: MtLookupTypeId, extra: Pick<TypeDef, never> = {}): TypeDef {
    if (!this.typeDefs[getRegistryOffset(id)]) {
      this.setTypeDef(id);
    }

    return {
      ...this.typeDefs[getRegistryOffset(id)],
      ...extra
    };
  }

  public setTypeDef (id: MtLookupTypeId): void {
    const inkType = this.getAbiType(id);
    const typeDef = this.extractType(inkType, id) as TypeDef;

    this.typeDefs[getRegistryOffset(id)] = typeDef;

    // we have a displayName for non-primitives and non-results
    if (!isNativeInkType(inkType) && typeDef.displayName) {
      this.registry.register({ [typeDef.displayName]: typeDef.type });
    }
  }

  private extractType (inkType: MtType, id: MtLookupTypeId): Pick<TypeDef, never> {
    const path = [...inkType.path];
    let typeDef;

    if (inkType.path.join('::').startsWith('ink_env::types::') || inkType.def.isPrimitive) {
      typeDef = this.extractPrimitive(inkType);
    } else if (inkType.def.isComposite) {
      typeDef = this.extractFields(inkType.def.asComposite.fields);
    } else if (inkType.def.isVariant) {
      typeDef = this.extractVariant(inkType.def.asVariant, id);
    } else if (inkType.def.isArray) {
      typeDef = this.extractArray(inkType.def.asArray);
    } else if (inkType.def.isSequence) {
      typeDef = this.extractSequence(inkType.def.asSequence, id);
    } else if (inkType.def.isTuple) {
      typeDef = this.extractTuple(inkType.def.asTuple);
    } else {
      throw new Error(`Invalid ink! type at index ${id.toString()}`);
    }

    const displayName = path.pop()?.toString();

    return withTypeString({
      ...(displayName
        ? { displayName }
        : {}
      ),
      ...(path.length > 1
        ? { namespace: path.map((segment) => segment.toString()).join('::') }
        : {}
      ),
      ...(inkType.params.length > 0
        ? { params: inkType.params.map((id) => this.typeDefAt(id)) }
        : {}
      ),
      ...typeDef
    });
  }

  private extractVariant ({ variants }: MtTypeDefVariant, id: MtLookupTypeId): Pick<TypeDef, never> {
    const { params, path } = this.getAbiType(id);
    const specialVariant = path[0].toString();

    if (specialVariant === 'Option') {
      return {
        info: TypeDefInfo.Option,
        sub: this.typeDefAt(params[0])
      };
    } else if (specialVariant === 'Result') {
      return {
        info: TypeDefInfo.Result,
        sub: params.map((param, index) => ({
          name: ['Ok', 'Error'][index],
          ...this.typeDefAt(param)
        }))
      };
    }

    return {
      info: TypeDefInfo.Enum,
      sub: this.extractVariantSub(variants)
    };
  }

  private extractVariantSub (variants: MtVariant[]): Pick<TypeDef, any>[] {
    const isAllUnitVariants = variants.every(({ fields }) => fields.length === 0);

    if (isAllUnitVariants) {
      return variants.map(({ discriminant, name }) => ({
        ...(
          discriminant.isSome
            ? { ext: { discriminant: discriminant.unwrap().toNumber() } }
            : {}
        ),
        info: TypeDefInfo.Plain,
        name: name.toString(),
        type: 'Null'
      }));
    }

    return variants.map(({ fields, name }) => ({
      ...this.extractFields(fields),
      name: name.toString()
    }));
  }

  private extractFields (fields: MtField[]): Pick<TypeDef, any> {
    const [isStruct, isTuple] = fields.reduce(([isAllNamed, isAllUnnamed], { name }) => ([
      isAllNamed && name.isSome,
      isAllUnnamed && name.isNone
    ]),
    [true, true]);

    let info;

    // check for tuple first (no fields may be available)
    if (isTuple) {
      info = TypeDefInfo.Tuple;
    } else if (isStruct) {
      info = TypeDefInfo.Struct;
    } else {
      throw new Error('Invalid fields type detected, expected either Tuple or Struct');
    }

    const sub = fields.map(({ name, type }) => {
      return {
        ...this.typeDefAt(type),
        ...(name.isSome ? { name: name.unwrap().toString() } : {})
      };
    });

    return isTuple && sub.length === 1
      ? sub[0]
      : { info, sub };
  }

  private extractArray ({ len: length, type }: MtTypeDefArray): Pick<TypeDef, never> {
    assert(!length || length.toNumber() <= 256, 'ContractRegistry: Only support for [Type; <length>], where length > 256');

    return {
      info: TypeDefInfo.VecFixed,
      length: length.toNumber(),
      sub: this.typeDefAt(type)
    };
  }

  private extractSequence ({ type }: MtTypeDefSequence, id: MtLookupTypeId): Pick<TypeDef, never> {
    assert(!!type, `ContractRegistry: Invalid sequence type found at id ${id.toString()}`);

    return {
      info: TypeDefInfo.Vec,
      sub: this.typeDefAt(type)
    };
  }

  private extractTuple (ids: MtTypeDefTuple): Pick<TypeDef, never> {
    return ids.length === 1
      ? this.typeDefAt(ids[0])
      : {
        info: TypeDefInfo.Tuple,
        sub: ids.map((id) => this.typeDefAt(id))
      };
  }

  private extractPrimitive (inkType: MtType): Pick<TypeDef, never> {
    if (inkType.def.isPrimitive) {
      return {
        info: TypeDefInfo.Plain,
        type: inkType.def.asPrimitive.type.toLowerCase()
      };
    } else if (inkType.path.length > 1) {
      return {
        info: TypeDefInfo.Plain,
        type: inkType.path[inkType.path.length - 1].toString()
      };
    }

    throw new Error('Invalid primitive type');
  }
}
