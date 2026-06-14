import type { FastifyPluginCallback, FastifyRequest, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";

const jwtPlugin: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({ error: "Unauthorized" });
      return;
    }
  });
  done();
};

export default fastifyPlugin(jwtPlugin);
