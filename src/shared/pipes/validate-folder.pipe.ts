import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ALLOWED_FOLDERS, AllowedFolder } from "../types/folder.type";




export class ValidateFolderPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): AllowedFolder {
        if (!ALLOWED_FOLDERS.includes(value)) {
          throw new BadRequestException(
            `Folder no válido. Los valores permitidos son: ${ALLOWED_FOLDERS.join(', ')}`
          );
        }
        return value;
      }
}