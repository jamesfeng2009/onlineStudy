import type { FastifyPluginCallback, FastifyRequest, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";

export interface JwtUserPayload {
  userId: string;
  version: number;
}

declare module "fastify" {
  interface FastifyRequest {
    user: JwtUserPayload;
  }
}

const jwtPlugin: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Unauthorized" });
      return;
    }
  });
  done();
};

export default fastifyPlugin(jwtPlugin);
