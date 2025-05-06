// src\graphql\test\test.module.ts
import { Module } from '@nestjs/common';

import { TestResolver } from './test.resolver';

@Module({
  imports: [],
  providers: [TestResolver],
})
export class TestModule {}
