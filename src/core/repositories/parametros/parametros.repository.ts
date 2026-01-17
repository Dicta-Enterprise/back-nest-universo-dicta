import { PrismaEntity, PrismaFilter } from '../../types/prisma-types';

export const IParametrosRepository = Symbol('IParametrosRepository');

export interface IParametrosRepository {
  findManyFromCollection(
    collection: string,
    filter: PrismaFilter,
    fields: string[]
  ): Promise<PrismaEntity[]>;
}
