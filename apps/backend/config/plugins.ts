import type { Core } from '@strapi/strapi';

const config = ({ env: _env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'My App API',
        description: 'API documentation',
      },
      'x-strapi-config': {
        plugins: ['users-permissions'],
      },
    },
  },
});

export default config;
