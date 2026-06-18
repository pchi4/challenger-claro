import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { GlobalExceptionFilter } from "@/common/filters/global-exception.filter";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? "0.0.0.0");
}

void bootstrap();
