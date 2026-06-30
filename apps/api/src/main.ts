import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { setupApp } from "@/app.setup";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? "0.0.0.0");
}

void bootstrap();
