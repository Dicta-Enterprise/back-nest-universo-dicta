// import { Injectable, LoggerService } from '@nestjs/common';
// import { createLogger, format, transports } from 'winston';

// @Injectable()
// export class AppLogger implements LoggerService {
//   private logger;

//   constructor() {
//     this.logger = createLogger({
//       level: 'info',
//       format: format.combine(
//         format.timestamp(),
//         format.json()
//       ),
//       transports: [
//         new transports.Console(),
//         new transports.File({ 
//           filename: `logs/app-${dayjs().format('YYYY-MM-DD')}.log` 
//         }),
//       ],
//     });
//   }

//   log(message: string, context?: string) {
//     this.logger.info(message, { context });
//   }

//   error(message: string, trace: string, context?: string) {
//     this.logger.error(message, { trace, context });
//   }

//   warn(message: string, context?: string) {
//     this.logger.warn(message, { context });
//   }

//   debug(message: string, context?: string) {
//     this.logger.debug(message, { context });
//   }
// }