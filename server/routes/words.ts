import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma";

const wordsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: { language?: string; level?: string };
  }>("/words", async (request, reply) => {
    const { language, level } = request.query;

    const where: Record<string, unknown> = {};
    if (language) where.languageCode = language;
    if (level) where.level = level;

    const words = await prisma.wordBank.findMany({
      where,
      orderBy: [{ vocabOrder: "asc" }, { word: "asc" }],
    });

    return reply.send(
      words.map((w) => ({
        id: w.id,
        language: w.languageCode,
        level: w.level,
        word: w.word,
        translation: w.translation,
        phonetic: w.phonetic,
        exampleSentence: w.exampleSentence,
      }))
    );
  });
};

export default wordsRoutes;
