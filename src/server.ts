import Fastify from 'fastify';

//create a fastify instance
const server = Fastify({
    logger: true,
});

// define simple route
server.get('/', async (request, reply) => {
   // 'request' and 'reply' are fully-typed by fastify
   
   return { message: "hello world" };
   
   // fastify automatically converts objects to json
});

server.get('/health', async (requestAnimationFrame, reply) => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString()
    };
});

// start server
const start = async () => {
    try {
        //type inference.  ts knows 'start' returns a promise
        await server.listen({port: 3000, host: '0.0.0.0'});
        console.log('server running at https://localhost:3000');

    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();

