import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sharp = require('sharp');

@Injectable()
export class ImageProcessingService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async processFromFiles(principalFile: Express.Multer.File, secundariaFile: Express.Multer.File) {
    try {
      const bufferP = principalFile.buffer;
      const bufferS = secundariaFile.buffer;

      const [pcP, pcS, tabP, tabS, mobP, mobS] = await Promise.all([
        this.resize(bufferP, 1920, 1080), this.resize(bufferS, 600, 250),
        this.resize(bufferP, 1280, 720),  this.resize(bufferS, 400, 166),
        this.resize(bufferP, 640, 360),    this.resize(bufferS, 300, 125),
      ]);

      const uploadToCloudinary = (buffer: Buffer, fileName: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'cursos', public_id: `${Date.now()}-${fileName}`, format: 'webp' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          uploadStream.end(buffer);
        });
      };

      return {
        pc:      { principal: await uploadToCloudinary(pcP, 'pcP'),  secundaria: await uploadToCloudinary(pcS, 'pcS') },
        tablet:  { principal: await uploadToCloudinary(tabP, 'tabP'), secundaria: await uploadToCloudinary(tabS, 'tabS') },
        mobile:  { principal: await uploadToCloudinary(mobP, 'mobP'), secundaria: await uploadToCloudinary(mobS, 'mobS') },
      };

    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Fallo al procesar imágenes: ${msg}`);
    }
  }

  private async resize(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return await sharp(buffer)
      .resize(width, height, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();
  }
}