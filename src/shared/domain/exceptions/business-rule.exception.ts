export class BussinesRuleException extends Error {
  constructor(
    public readonly message: string,
    public readonly errorCode: number,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'BusinessRuleException';
  }
}
