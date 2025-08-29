import { IsNumber } from "class-validator";

export class Vector3Dto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  z: number;
}
