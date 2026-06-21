import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';

async function bootstrap() {
  // Create Fastify app with NestJS
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // Security: Helmet for security headers
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  // CORS configuration
  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
      const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
      if (isLocalhost || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        cb(null, true);
      } else {
        if (origin.endsWith('.vercel.app')) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      }
    },
    credentials: true,
  });

  // Global validation pipe - validates all DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
      },
    }),
  );

  // API prefix (e.g., /api)
  const apiPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Wenda Tourism API')
    .setDescription(
      'Complete REST API for Wenda Tourism Platform - Discover Angola\'s beautiful destinations',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in controllers
    )
    .addTag('Auth', 'Authentication endpoints (login, register, OAuth)')
    .addTag('Users', 'User profile and preferences management')
    .addTag('Categories', 'Destination categories')
    .addTag('Destinations', 'Tourist destinations CRUD and search')
    .addTag('Reviews', 'Destination reviews and ratings')
    .addTag('Favorites', 'User favorite destinations')
    .addTag('Trips', 'Trip planning and itinerary management')
    .addTag('Health', 'Health check and monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Wenda API Documentation',
    customfavIcon: 'https://wenda.ao/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
    ],
  });

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`
  🚀 Application is running!
  
  📝 API Docs: http://localhost:${port}/docs
  🔌 API URL: http://localhost:${port}/${apiPrefix}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  
  ✨ Ready to serve requests!
  `);
}

bootstrap();
