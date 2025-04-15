import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from './auth/interface/auth.interface';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options:{
      url: '0.0.0.0:50051',
      package: AUTH_PACKAGE_NAME,
      protoPath: join('src', 'proto', 'auth.proto')
    }
  });

  await app.startAllMicroservices()
  await app.listen(3001)
  console.log('gRPC Auth Service is running on HTTP:3000 and gRPC:50051');
}
bootstrap();
