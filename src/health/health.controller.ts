import { Controller, Get } from '@nestjs/common'
import {
  DNSHealthIndicator, HealthCheck, HealthCheckService, MongooseHealthIndicator,
} from '@nestjs/terminus'

import { TypegooseHealthIndicator } from './typegoose.indicator'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
    private mongo: TypegooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.dns.pingCheck('google', 'https://google.com'),
      () => this.mongo.pingCheck('mongodb', { timeout: 1500 }),
    ])
  }
}
