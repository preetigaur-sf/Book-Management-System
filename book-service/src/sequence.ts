import {MiddlewareSequence, RequestContext} from '@loopback/rest';
import {Client} from '@opensearch-project/opensearch';

const opensearchClient = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'admin',
    password: 'Vision@09#use11r',
  },
  ssl: {
    rejectUnauthorized: false,
  },
});

export class MySequence extends MiddlewareSequence {
  async handle(context: RequestContext) {
    const start = Date.now();

    try {
      await super.handle(context);
    } finally {
      const duration = Date.now() - start;

      const logData = {
        timestamp: new Date().toISOString(),
        method: context.request.method,
        url: context.request.url,
        statusCode: context.response.statusCode,
        duration,
      };

      // Console Log
      console.log(JSON.stringify(logData));

      // OpenSearch Log
      try {
        await opensearchClient.index({
          index: 'book-service-logs',
          body: logData,
        });

        await opensearchClient.indices.refresh({
          index: 'book-service-logs',
        });
      } catch (error) {
        console.error(
          'OpenSearch Error:',
          error instanceof Error ? error.message : error,
        );
      }
    }
  }
}