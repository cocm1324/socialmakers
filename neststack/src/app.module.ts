import { Module } from '@nestjs/common';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageModule } from './image/image.module';
import { UserModule } from './user/user.module';
import { PageModule } from './page/page.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
	imports: [
		ImageModule, 
		UserModule, 
		PageModule, 
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'assets', 'image'),
			serveRoot: 'static/image'
		})
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
