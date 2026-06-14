import type { FastifyPluginCallback, FastifyRequest, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";

const jwtPlugin: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await (request as any).jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Unauthorized" });
      return;
    }
  });
  done();
};

export default fastifyPlugin(jwtPlugin);
