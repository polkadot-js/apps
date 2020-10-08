// Copyright 2017-2020 @canvas-ui/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InkProject, MtField, MtLookupTypeId, MtType, MtTypeDefArray, MtTypeDefComposite, MtTypeDefVariant, MtTypeDefSlice, MtTypeDefTuple, MtVariant } from '@polkadot/types/interfaces';
import { AnyJson, Registry, TypeDef, TypeDefInfo } from '@polkadot/types/types';

import { assert, isUndefined } from '@polkadot/util';
import { withTypeString } from '@polkadot/types';
import { u32 as U32 } from '@polkadot/types/primitive';

// convert the offset into project-specific, index-1
export function getRegistryOffset (id: MtLookupTypeId): number {
  return id.toNumber() - 1;
}

function isPrimitiveInkType (inkType: MtType) {
  const inkEnvTypes = inkType.path
    .map((segment) => segment.toString())
    .slice(0, inkType.path.length - 1)
    .join('::');

  return inkEnvTypes === 'ink_env::types';
}

export default class InkRegistry {
  public typeDefs: TypeDef[] = [];

  public registry: Registry;

  public project: InkProject;

  public json: AnyJson;

  constructor (registry: Registry, json: AnyJson) {
    this.registry = registry;
    this.json = json;
    this.project = registry.createType('InkProject', json);

    // Generate TypeDefs for each provided registry type
    this.project.types.forEach((_, index): void => this.setTypeDef(new U32(this.registry, index + 1)));
  }

  public getInkType (id: MtLookupTypeId): MtType {
    const offset = getRegistryOffset(id);
    const type = this.project.types[offset];

    assert(!isUndefined(type), `getInkType:: Unable to find ${id.toNumber()} in type values`);

    return this.registry.createType('MtType', type);
  }

  public getInkTypes (ids: MtLookupTypeId[]): MtType[] {
    return ids.map((id): MtType => this.getInkType(id));
  }

  public hasTypeDefAt (id: MtLookupTypeId): boolean {
    return !!this.typeDefs[getRegistryOffset(id)];
  }

  public typeDefAt (id: MtLookupTypeId, extra: Pick<TypeDef, never> = {}): TypeDef {
    if (!this.hasTypeDefAt(id)) {
      this.setTypeDef(id);
    }

    return {
      ...this.typeDefs[getRegistryOffset(id)],
      ...extra
    };
  }

  public typeDefsAt (ids: MtLookupTypeId[]): TypeDef[] {
    return ids.map((id) => this.typeDefAt(id));
  }

  public setTypeDef (id: MtLookupTypeId): void {
    this.typeDefs[getRegistryOffset(id)] = this.resolveType(this.getInkType(id), id) as TypeDef;
  }

  private resolveType (inkType: MtType, id: MtLookupTypeId): Pick<TypeDef, never> {
    const { path } = inkType;
    let typeDef;

    if (isPrimitiveInkType(inkType) || inkType.def.isPrimitive) {
      typeDef = this.resolvePrimitive(inkType);
    } else if (inkType.def.isComposite) {
      typeDef = this.resolveComposite(inkType.def.asComposite);
    } else if (inkType.def.isVariant) {
      typeDef = this.resolveVariant(inkType.def.asVariant, id);
    } else if (inkType.def.isArray) {
      typeDef = this.resolveArray(inkType.def.asArray);
    } else if (inkType.def.isSequence) {
      typeDef = this.resolveSequence(inkType.def.asSequence, id);
    } else if (inkType.def.isSlice) {
      typeDef = this.resolveSlice(inkType.def.asSlice, id);
    } else if (inkType.def.isTuple) {
      typeDef = this.resolveTuple(inkType.def.asTuple);
    } else {
      // console.error(inkType);
      throw new Error(`Invalid ink! type at index ${id.toString()}`);
    }

    const displayName = path.pop()?.toString();

    const result = withTypeString({
      ...(displayName ? { displayName } : {}),
      ...(path.length > 1 ? { namespace: path
        .map((segment) => segment.toString())
        .join('::') } : {}),
      ...(inkType.params.length > 0 ? { params: this.typeDefsAt(inkType.params) } : {}),
      ...typeDef
    });

    return result;
  }

  private resolveComposite ({ fields }: MtTypeDefComposite): Pick<TypeDef, never> {
    return this.resolveFields(fields);
  }

  private resolveVariant ({ variants }: MtTypeDefVariant, id: MtLookupTypeId): Pick<TypeDef, never> {
    const { params, path } = this.getInkType(id);
    const specialVariant = path[0].toString();

    switch (specialVariant) {
      case 'Option':
        return this.resolveOption(params);

      case 'Result':
        return this.resolveResult(params);

      default: {
        return {
          info: TypeDefInfo.Enum,
          sub: this.resolveVariantSub(variants)
        };
      }
    }
  }

  private resolveOption ([param]: MtLookupTypeId[]): Pick<TypeDef, never> {
    return {
      info: TypeDefInfo.Option,
      sub: this.typeDefAt(param)
    };
  }

  private resolveResult (params: MtLookupTypeId[]): Pick<TypeDef, never> {
    return {
      info: TypeDefInfo.Result,
      sub: params.map((param, index) => ({
        name: ['Ok', 'Error'][index],
        ...this.typeDefAt(param)
      }))
    };
  }

  private resolveVariantSub (variants: MtVariant[]): Pick<TypeDef, any>[] {
    const isAllUnitVariants = variants.reduce(
      (result, { fields }) => result && fields.length === 0,
      true
    );

    if (isAllUnitVariants) {
      return variants.map(
        ({ discriminant, name }) => {
          return {
            ...(
              discriminant.isSome
                ? { ext: { discriminant: discriminant.unwrap().toNumber() } }
                : {}
            ),
            info: TypeDefInfo.Plain,
            name: name.toString(),
            type: 'Null'
          };
        }
      );
    }

    return variants.map(
      ({ fields, name }) => {
        return {
          ...this.resolveFields(fields),
          name: name.toString()
        };
      }
    );
  }

  private resolveFields (fields: MtField[]): Pick<TypeDef, any> {
    const [isStruct, isTuple] = fields.reduce(
      ([isAllNamed, isAllUnnamed], { name }) => ([
        isAllNamed && name.isSome,
        isAllUnnamed && name.isNone
      ]),
      [true, true]
    );

    let info;

    if (isStruct) {
      info = TypeDefInfo.Struct;
    }

    if (isTuple) {
      info = TypeDefInfo.Tuple;
    }

    if (!info) {
      throw new Error('Invalid fields type detected');
    }

    const sub = fields.map(({ name, type }) => {
      return {
        ...this.typeDefAt(type),
        ...(name.isSome ? { name: name.unwrap().toString() } : {})
      };
    });

    if (isTuple && sub.length === 1) {
      return sub[0];
    }

    return {
      info,
      sub
    };
  }

  private resolveArray ({ len: length, type }: MtTypeDefArray): Pick<TypeDef, never> {
    assert(!length || length.toNumber() <= 256, 'InkRegistry: Only support for [Type; <length>], where length <= 256');

    return {
      info: TypeDefInfo.VecFixed,
      length: length.toNumber(),
      sub: this.typeDefAt(type)
    };
  }

  private resolveSequence ({ type }: MtTypeDefSlice, id: MtLookupTypeId): Pick<TypeDef, never> {
    assert(!!type, `InkRegistry: Invalid sequence type found at id ${id.toString()}`);

    return {
      info: TypeDefInfo.Vec,
      sub: this.typeDefAt(type)
    };
  }

  private resolveSlice ({ type }: MtTypeDefSlice, id: MtLookupTypeId): Pick<TypeDef, never> {
    assert(!!type, `InkRegistry: Invalid slice type found at id ${id.toString()}`);

    return {
      info: TypeDefInfo.Vec,
      sub: this.typeDefAt(type)
    };
  }

  private resolveTuple (ids: MtTypeDefTuple): Pick<TypeDef, never> {
    if (ids.length === 1) {
      return this.typeDefAt(ids[0]);
    }

    return {
      info: TypeDefInfo.Tuple,
      sub: ids.map((id) => this.typeDefAt(id))
    };
  }

  private resolvePrimitive (inkType: MtType): Pick<TypeDef, never> {
    if (inkType.def.isPrimitive) {
      return {
        info: TypeDefInfo.Plain,
        type: inkType.def.asPrimitive.type.toLowerCase()
      };
    }

    if (inkType.path.length > 1) {
      return {
        info: TypeDefInfo.Plain,
        type: inkType.path[inkType.path.length - 1].toString()
      };
    }

    throw new Error('Invalid primitive type');
  }
}
