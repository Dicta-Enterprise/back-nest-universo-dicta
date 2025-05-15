export const createFakeMulterFileAdapter = (
  buffer: Buffer,
  originalname: string,
  mimetype: string,
): Express.Multer.File => {
  return {
    buffer,
    originalname,
    mimetype,
    fieldname: 'file',
    size: buffer.length,
    destination: 'fake-destination',
    filename: 'fake-filename',
    path: 'fake-path',
    stream: null,
    encoding: '7bit',
  };
};
