import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma";

const coursesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: {
      language?: string;
      levelGroup?: string;
      vipOnly?: string;
    };
  }>("/courses", async (request, reply) => {
    const { language, levelGroup, vipOnly } = request.query;

    const where: Record<string, unknown> = {};
    if (language) where.languageCode = language;
    if (levelGroup) where.levelGroup = levelGroup;
    if (vipOnly !== undefined) {
      where.vipOnly = vipOnly === "true" || vipOnly === "1";
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: [{ courseOrder: "asc" }, { title: "asc" }],
    });

    return reply.send(
      courses.map((c) => ({
        id: c.id,
        language: c.languageCode,
        title: c.title,
        level: c.level,
        levelGroup: c.levelGroup,
        description: c.description,
        lessons: c.lessons,
        minutes: c.minutes,
        cover: c.cover,
        tags: c.tags as string[],
        vipOnly: c.vipOnly,
      }))
    );
  });

  fastify.get<{ Params: { id: string } }>("/courses/:id", async (request, reply) => {
    const course = await prisma.course.findUnique({ where: { id: request.params.id } });
    if (!course) {
      return reply.status(404).send({ error: "课程不存在" });
    }
    return reply.send({
      id: course.id,
      language: course.languageCode,
      title: course.title,
      level: course.level,
      levelGroup: course.levelGroup,
      description: course.description,
      lessons: course.lessons,
      minutes: course.minutes,
      cover: course.cover,
      tags: course.tags as string[],
      vipOnly: course.vipOnly,
    });
  });
};

export default coursesRoutes;
