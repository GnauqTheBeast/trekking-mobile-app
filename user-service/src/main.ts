import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as googleProtoFiles from 'google-proto-files';
import { USER_PACKAGE_NAME } from './interface-proto/user.interface';

async function bootstrap() {


  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: USER_PACKAGE_NAME,
      protoPath: join(__dirname, '../src/proto/user.proto'),
      url: '0.0.0.0:50052',
      loader:{
        includeDirs: [googleProtoFiles.getProtoPath()],
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      }
    }
  })

  await app.startAllMicroservices()
  await app.listen(3002)
  console.log('gRPC TestService running on 3002 and gRPC:50052');
}
bootstrap();
