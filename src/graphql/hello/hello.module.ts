import { Module } from '@nestjs/common';

import { HelloResolver } from './hello.resolver';

@Module({
  imports: [],
  providers: [HelloResolver],
})
export class HelloModule {}
