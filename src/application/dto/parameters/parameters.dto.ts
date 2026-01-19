export class ParameterItemDto {
  id: string | number;
  value: string;
  code: string; 

  constructor(id: string | number, value: string, code: string = '') {
    this.id = id;
    this.value = value;
    this.code = code; 
  }
}