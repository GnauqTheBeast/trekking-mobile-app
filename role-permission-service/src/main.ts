import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ROLE_PERMISSION_PACKAGE_NAME } from './role-permission/interface/role-permission.interface';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: ROLE_PERMISSION_PACKAGE_NAME,
      protoPath: join(__dirname, '../src/proto/role-permission.proto'),
      url: '0.0.0.0:50054'
    }
  })
  app.startAllMicroservices()
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
