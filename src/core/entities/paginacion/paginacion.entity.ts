export class Paginacion<T> {
  constructor(
    public data: T[],
    public page: number,
    public limit: number,
    public total: number,
    public totalPages: number,
    public hasNextPage: boolean,
    public hasPrevPage: boolean,
  ) {}
}