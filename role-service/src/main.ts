import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ROLE_PACKAGE_NAME } from './role/interface/role.interface';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: ROLE_PACKAGE_NAME,
      protoPath: join(__dirname, '../src/proto/role.proto'),
      url: '0.0.0.0:50053'
    }
  })
  await app.startAllMicroservices()
  await app.listen(3003)
  console.log('3003 and 50053')
}
bootstrap();
