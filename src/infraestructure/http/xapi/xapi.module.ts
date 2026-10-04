import { Module } from '@nestjs/common';
import { XapiController } from './xapi.controller';
import { XapiService } from 'src/core/services/xapi/xapi.service';

@Module({
  controllers: [XapiController],
  providers: [XapiService],
})
export class XapiModule {}
