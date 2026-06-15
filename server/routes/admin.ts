import type { FastifyPluginAsync, FastifyReply } from "fastify";
import { Prisma, prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";
import { adminOnly } from "../lib/admin.js";

function badRequest(reply: FastifyReply, message: string) {
  return sendError(reply, "BAD_REQUEST", message);
}

function buildWhere(language?: string, level?: string): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  if (language) where.languageCode = language;
  if (level) where.level = level;
  return where;
}

function ensureArray(value: unknown): unknown[] | null {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return value;
  return null;
}

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", adminOnly);

  // ====== Languages ======
  fastify.get<{ Querystring: { language?: string; level?: string } }>("/admin/languages", async (request, reply) => {
    const { language } = request.query;
    const where: Record<string, unknown> = {};
    if (language) where.code = language;
    const languages = await prisma.language.findMany({ where, orderBy: { code: "asc" } });
    return sendSuccess(
      reply,
      languages.map((l) => ({
        id: l.code,
        code: l.code,
        name: l.name,
        native: l.native,
        flag: l.flag,
        tagline: l.tagline,
        levels: l.levels as string[],
        status: l.status,
      }))
    );
  });

  fastify.get<{ Params: { id: string } }>("/admin/languages/:id", async (request, reply) => {
    const language = await prisma.language.findUnique({ where: { code: request.params.id } });
    if (!language) return sendError(reply, "NOT_FOUND", "语言不存在");
    return sendSuccess(reply, {
      id: language.code,
      code: language.code,
      name: language.name,
      native: language.native,
      flag: language.flag,
      tagline: language.tagline,
      levels: language.levels as string[],
      status: language.status,
    });
  });

  fastify.post<{ Body: Record<string, unknown> }>("/admin/languages", async (request, reply) => {
    const { code, name, native, flag, tagline, levels, status } = request.body;
    if (!code || !name || !native || !flag || !tagline) {
      return badRequest(reply, "缺少必填字段: code, name, native, flag, tagline");
    }
    const levelsArray = ensureArray(levels);
    if (levels !== undefined && levelsArray === null) {
      return badRequest(reply, "levels 必须是数组");
    }
    const data: Prisma.LanguageCreateInput = {
      code: String(code),
      name: String(name),
      native: String(native),
      flag: String(flag),
      tagline: String(tagline),
      levels: (levelsArray ?? []) as Prisma.InputJsonValue,
      status: typeof status === "string" ? status : "active",
    };
    const language = await prisma.language.create({ data });
    return sendSuccess(reply, {
      id: language.code,
      code: language.code,
      name: language.name,
      native: language.native,
      flag: language.flag,
      tagline: language.tagline,
      levels: language.levels as string[],
      status: language.status,
    });
  });

  fastify.put<{ Params: { id: string }; Body: Record<string, unknown> }>("/admin/languages/:id", async (request, reply) => {
    const { name, native, flag, tagline, levels, status } = request.body;
    const update: Prisma.LanguageUpdateInput = {};
    if (typeof name === "string") update.name = name;
    if (typeof native === "string") update.native = native;
    if (typeof flag === "string") update.flag = flag;
    if (typeof tagline === "string") update.tagline = tagline;
    if (typeof status === "string") update.status = status;
    if (levels !== undefined) {
      const levelsArray = ensureArray(levels);
      if (levelsArray === null) return badRequest(reply, "levels 必须是数组");
      update.levels = levelsArray as Prisma.InputJsonValue;
    }
    if (Object.keys(update).length === 0) return badRequest(reply, "缺少可更新字段");
    const language = await prisma.language.update({ where: { code: request.params.id }, data: update });
    return sendSuccess(reply, {
      id: language.code,
      code: language.code,
      name: language.name,
      native: language.native,
      flag: language.flag,
      tagline: language.tagline,
      levels: language.levels as string[],
      status: language.status,
    });
  });

  fastify.delete<{ Params: { id: string } }>("/admin/languages/:id", async (request, reply) => {
    await prisma.language.delete({ where: { code: request.params.id } });
    return sendSuccess(reply, { id: request.params.id });
  });

  // ====== Courses ======
  fastify.get<{ Querystring: { language?: string; level?: string } }>("/admin/courses", async (request, reply) => {
    const courses = await prisma.course.findMany({
      where: buildWhere(request.query.language, request.query.level),
      orderBy: [{ courseOrder: "asc" }, { title: "asc" }],
    });
    return sendSuccess(
      reply,
      courses.map((c) => ({
        id: c.id,
        languageCode: c.languageCode,
        title: c.title,
        level: c.level,
        levelGroup: c.levelGroup,
        description: c.description,
        lessons: c.lessons,
        minutes: c.minutes,
        cover: c.cover,
        tags: c.tags as string[],
        vipOnly: c.vipOnly,
        courseOrder: c.courseOrder,
      }))
    );
  });

  fastify.get<{ Params: { id: string } }>("/admin/courses/:id", async (request, reply) => {
    const course = await prisma.course.findUnique({ where: { id: request.params.id } });
    if (!course) return sendError(reply, "NOT_FOUND", "课程不存在");
    return sendSuccess(reply, {
      id: course.id,
      languageCode: course.languageCode,
      title: course.title,
      level: course.level,
      levelGroup: course.levelGroup,
      description: course.description,
      lessons: course.lessons,
      minutes: course.minutes,
      cover: course.cover,
      tags: course.tags as string[],
      vipOnly: course.vipOnly,
      courseOrder: course.courseOrder,
    });
  });

  fastify.post<{ Body: Record<string, unknown> }>("/admin/courses", async (request, reply) => {
    const { languageCode, title, level, levelGroup, description, lessons, minutes, cover, tags, vipOnly, courseOrder } = request.body;
    if (!languageCode || !title || !level || !levelGroup || !description || lessons === undefined || minutes === undefined || !cover) {
      return badRequest(reply, "缺少必填字段");
    }
    const tagsArray = ensureArray(tags);
    if (tags !== undefined && tagsArray === null) return badRequest(reply, "tags 必须是数组");
    const data: Prisma.CourseCreateInput = {
      language: { connect: { code: String(languageCode) } },
      title: String(title),
      level: String(level),
      levelGroup: String(levelGroup),
      description: String(description),
      lessons: Number(lessons),
      minutes: Number(minutes),
      cover: String(cover),
      tags: (tagsArray ?? []) as Prisma.InputJsonValue,
      vipOnly: typeof vipOnly === "boolean" ? vipOnly : false,
      courseOrder: typeof courseOrder === "number" ? courseOrder : Number(courseOrder ?? 0),
    };
    const course = await prisma.course.create({ data });
    return sendSuccess(reply, {
      id: course.id,
      languageCode: course.languageCode,
      title: course.title,
      level: course.level,
      levelGroup: course.levelGroup,
      description: course.description,
      lessons: course.lessons,
      minutes: course.minutes,
      cover: course.cover,
      tags: course.tags as string[],
      vipOnly: course.vipOnly,
      courseOrder: course.courseOrder,
    });
  });

  fastify.put<{ Params: { id: string }; Body: Record<string, unknown> }>("/admin/courses/:id", async (request, reply) => {
    const { languageCode, title, level, levelGroup, description, lessons, minutes, cover, tags, vipOnly, courseOrder } = request.body;
    const update: Prisma.CourseUpdateInput = {};
    if (typeof languageCode === "string") update.language = { connect: { code: languageCode } };
    if (typeof title === "string") update.title = title;
    if (typeof level === "string") update.level = level;
    if (typeof levelGroup === "string") update.levelGroup = levelGroup;
    if (typeof description === "string") update.description = description;
    if (typeof cover === "string") update.cover = cover;
    if (typeof lessons === "number") update.lessons = lessons;
    if (typeof minutes === "number") update.minutes = minutes;
    if (typeof vipOnly === "boolean") update.vipOnly = vipOnly;
    if (typeof courseOrder === "number") update.courseOrder = courseOrder;
    if (tags !== undefined) {
      const tagsArray = ensureArray(tags);
      if (tagsArray === null) return badRequest(reply, "tags 必须是数组");
      update.tags = tagsArray as Prisma.InputJsonValue;
    }
    if (Object.keys(update).length === 0) return badRequest(reply, "缺少可更新字段");
    const course = await prisma.course.update({ where: { id: request.params.id }, data: update });
    return sendSuccess(reply, {
      id: course.id,
      languageCode: course.languageCode,
      title: course.title,
      level: course.level,
      levelGroup: course.levelGroup,
      description: course.description,
      lessons: course.lessons,
      minutes: course.minutes,
      cover: course.cover,
      tags: course.tags as string[],
      vipOnly: course.vipOnly,
      courseOrder: course.courseOrder,
    });
  });

  fastify.delete<{ Params: { id: string } }>("/admin/courses/:id", async (request, reply) => {
    await prisma.course.delete({ where: { id: request.params.id } });
    return sendSuccess(reply, { id: request.params.id });
  });

  // ====== Words ======
  fastify.get<{ Querystring: { language?: string; level?: string } }>("/admin/words", async (request, reply) => {
    const words = await prisma.wordBank.findMany({
      where: buildWhere(request.query.language, request.query.level),
      orderBy: [{ vocabOrder: "asc" }, { word: "asc" }],
      include: { translations: true },
    });
    return sendSuccess(
      reply,
      words.map((w) => {
        const tr = w.translations.find((x) => x.baseLanguageCode === "en") ?? w.translations[0];
        return {
          id: w.id,
          languageCode: w.languageCode,
          level: w.level,
          word: w.word,
          translation: tr?.translation ?? "",
          phonetic: w.phonetic,
          exampleSentence: w.exampleSentence,
          vocabOrder: w.vocabOrder,
        };
      })
    );
  });

  fastify.get<{ Params: { id: string } }>("/admin/words/:id", async (request, reply) => {
    const word = await prisma.wordBank.findUnique({ where: { id: request.params.id }, include: { translations: true } });
    if (!word) return sendError(reply, "NOT_FOUND", "单词不存在");
    const tr = word.translations.find((x) => x.baseLanguageCode === "en") ?? word.translations[0];
    return sendSuccess(reply, {
      id: word.id,
      languageCode: word.languageCode,
      level: word.level,
      word: word.word,
      translation: tr?.translation ?? "",
      phonetic: word.phonetic,
      exampleSentence: word.exampleSentence,
      vocabOrder: word.vocabOrder,
    });
  });

  fastify.post<{ Body: Record<string, unknown> }>("/admin/words", async (request, reply) => {
    const { languageCode, level, word, translation, phonetic, exampleSentence, vocabOrder } = request.body;
    if (!languageCode || !level || !word || !translation || !exampleSentence) {
      return badRequest(reply, "缺少必填字段");
    }
    const created = await prisma.wordBank.create({
      data: {
        language: { connect: { code: String(languageCode) } },
        level: String(level),
        word: String(word),
        phonetic: typeof phonetic === "string" ? phonetic : null,
        exampleSentence: String(exampleSentence),
        vocabOrder: typeof vocabOrder === "number" ? vocabOrder : Number(vocabOrder ?? 0),
        translations: {
          create: {
            baseLanguageCode: "en",
            translation: String(translation),
          },
        },
      },
      include: { translations: true },
    });
    const tr = created.translations.find((x) => x.baseLanguageCode === "en") ?? created.translations[0];
    return sendSuccess(reply, {
      id: created.id,
      languageCode: created.languageCode,
      level: created.level,
      word: created.word,
      translation: tr?.translation ?? "",
      phonetic: created.phonetic,
      exampleSentence: created.exampleSentence,
      vocabOrder: created.vocabOrder,
    });
  });

  fastify.put<{ Params: { id: string }; Body: Record<string, unknown> }>("/admin/words/:id", async (request, reply) => {
    const { languageCode, level, word, translation, phonetic, exampleSentence, vocabOrder } = request.body;
    const update: Prisma.WordBankUpdateInput = {};
    if (typeof languageCode === "string") update.language = { connect: { code: languageCode } };
    if (typeof level === "string") update.level = level;
    if (typeof word === "string") update.word = word;
    if (typeof phonetic === "string") update.phonetic = phonetic;
    if (typeof exampleSentence === "string") update.exampleSentence = exampleSentence;
    if (typeof vocabOrder === "number") update.vocabOrder = vocabOrder;
    if (Object.keys(update).length === 0 && typeof translation !== "string") return badRequest(reply, "缺少可更新字段");
    const updated = await prisma.wordBank.update({ where: { id: request.params.id }, data: update, include: { translations: true } });
    if (typeof translation === "string") {
      const existing = updated.translations.find((x) => x.baseLanguageCode === "en");
      if (existing) {
        await prisma.wordBankTranslation.update({ where: { id: existing.id }, data: { translation } });
      } else {
        await prisma.wordBankTranslation.create({ data: { wordBankId: updated.id, baseLanguageCode: "en", translation } });
      }
    }
    const tr = updated.translations.find((x) => x.baseLanguageCode === "en") ?? updated.translations[0];
    return sendSuccess(reply, {
      id: updated.id,
      languageCode: updated.languageCode,
      level: updated.level,
      word: updated.word,
      translation: tr?.translation ?? "",
      phonetic: updated.phonetic,
      exampleSentence: updated.exampleSentence,
      vocabOrder: updated.vocabOrder,
    });
  });

  fastify.delete<{ Params: { id: string } }>("/admin/words/:id", async (request, reply) => {
    await prisma.wordBank.delete({ where: { id: request.params.id } });
    return sendSuccess(reply, { id: request.params.id });
  });

  // ====== Quizzes ======
  fastify.get<{ Querystring: { language?: string; level?: string } }>("/admin/quizzes", async (request, reply) => {
    const quizzes = await prisma.quiz.findMany({
      where: buildWhere(request.query.language, request.query.level),
      orderBy: [{ quizOrder: "asc" }, { createdAt: "asc" }],
      include: { translations: true },
    });
    return sendSuccess(
      reply,
      quizzes.map((q) => {
        const tr = q.translations.find((x) => x.baseLanguageCode === "en") ?? q.translations[0];
        return {
          id: q.id,
          languageCode: q.languageCode,
          level: q.level,
          question: tr?.question ?? "",
          options: q.options as string[],
          answer: q.answer,
          explain: tr?.explain ?? "",
          quizOrder: q.quizOrder,
        };
      })
    );
  });

  fastify.get<{ Params: { id: string } }>("/admin/quizzes/:id", async (request, reply) => {
    const quiz = await prisma.quiz.findUnique({ where: { id: request.params.id }, include: { translations: true } });
    if (!quiz) return sendError(reply, "NOT_FOUND", "题目不存在");
    const tr = quiz.translations.find((x) => x.baseLanguageCode === "en") ?? quiz.translations[0];
    return sendSuccess(reply, {
      id: quiz.id,
      languageCode: quiz.languageCode,
      level: quiz.level,
      question: tr?.question ?? "",
      options: quiz.options as string[],
      answer: quiz.answer,
      explain: tr?.explain ?? "",
      quizOrder: quiz.quizOrder,
    });
  });

  fastify.post<{ Body: Record<string, unknown> }>("/admin/quizzes", async (request, reply) => {
    const { languageCode, level, question, options, answer, explain, quizOrder } = request.body;
    if (!languageCode || !level || !question || !explain || answer === undefined) {
      return badRequest(reply, "缺少必填字段");
    }
    const optionsArray = ensureArray(options);
    if (optionsArray === null) return badRequest(reply, "options 必须是数组");
    const quiz = await prisma.quiz.create({
      data: {
        language: { connect: { code: String(languageCode) } },
        level: String(level),
        options: optionsArray as Prisma.InputJsonValue,
        answer: Number(answer),
        quizOrder: typeof quizOrder === "number" ? quizOrder : Number(quizOrder ?? 0),
        translations: {
          create: {
            baseLanguageCode: "en",
            question: String(question),
            explain: String(explain),
          },
        },
      },
      include: { translations: true },
    });
    const tr = quiz.translations.find((x) => x.baseLanguageCode === "en") ?? quiz.translations[0];
    return sendSuccess(reply, {
      id: quiz.id,
      languageCode: quiz.languageCode,
      level: quiz.level,
      question: tr?.question ?? "",
      options: quiz.options as string[],
      answer: quiz.answer,
      explain: tr?.explain ?? "",
      quizOrder: quiz.quizOrder,
    });
  });

  fastify.put<{ Params: { id: string }; Body: Record<string, unknown> }>("/admin/quizzes/:id", async (request, reply) => {
    const { languageCode, level, question, options, answer, explain, quizOrder } = request.body;
    const update: Prisma.QuizUpdateInput = {};
    if (typeof languageCode === "string") update.language = { connect: { code: languageCode } };
    if (typeof level === "string") update.level = level;
    if (typeof answer === "number") update.answer = answer;
    if (typeof quizOrder === "number") update.quizOrder = quizOrder;
    if (options !== undefined) {
      const optionsArray = ensureArray(options);
      if (optionsArray === null) return badRequest(reply, "options 必须是数组");
      update.options = optionsArray as Prisma.InputJsonValue;
    }
    const hasTranslation = typeof question === "string" || typeof explain === "string";
    if (Object.keys(update).length === 0 && !hasTranslation) return badRequest(reply, "缺少可更新字段");
    const quiz = await prisma.quiz.update({ where: { id: request.params.id }, data: update, include: { translations: true } });
    if (hasTranslation) {
      const existing = quiz.translations.find((x) => x.baseLanguageCode === "en");
      if (existing) {
        await prisma.quizTranslation.update({
          where: { id: existing.id },
          data: { question: typeof question === "string" ? question : existing.question, explain: typeof explain === "string" ? explain : existing.explain },
        });
      } else {
        await prisma.quizTranslation.create({
          data: {
            quizId: quiz.id,
            baseLanguageCode: "en",
            question: typeof question === "string" ? question : "",
            explain: typeof explain === "string" ? explain : "",
          },
        });
      }
    }
    const tr = quiz.translations.find((x) => x.baseLanguageCode === "en") ?? quiz.translations[0];
    return sendSuccess(reply, {
      id: quiz.id,
      languageCode: quiz.languageCode,
      level: quiz.level,
      question: tr?.question ?? "",
      options: quiz.options as string[],
      answer: quiz.answer,
      explain: tr?.explain ?? "",
      quizOrder: quiz.quizOrder,
    });
  });

  fastify.delete<{ Params: { id: string } }>("/admin/quizzes/:id", async (request, reply) => {
    await prisma.quiz.delete({ where: { id: request.params.id } });
    return sendSuccess(reply, { id: request.params.id });
  });

  // ====== Listening ======
  fastify.get<{ Querystring: { language?: string; level?: string } }>("/admin/listening", async (request, reply) => {
    const items = await prisma.listening.findMany({
      where: buildWhere(request.query.language, request.query.level),
      orderBy: [{ listenOrder: "asc" }, { title: "asc" }],
    });
    return sendSuccess(
      reply,
      items.map((item) => ({
        id: item.id,
        languageCode: item.languageCode,
        level: item.level,
        title: item.title,
        script: item.script,
        blanks: item.blanks as { index: number; answer: string }[],
        listenOrder: item.listenOrder,
      }))
    );
  });

  fastify.get<{ Params: { id: string } }>("/admin/listening/:id", async (request, reply) => {
    const item = await prisma.listening.findUnique({ where: { id: request.params.id } });
    if (!item) return sendError(reply, "NOT_FOUND", "听力材料不存在");
    return sendSuccess(reply, {
      id: item.id,
      languageCode: item.languageCode,
      level: item.level,
      title: item.title,
      script: item.script,
      blanks: item.blanks as { index: number; answer: string }[],
      listenOrder: item.listenOrder,
    });
  });

  fastify.post<{ Body: Record<string, unknown> }>("/admin/listening", async (request, reply) => {
    const { languageCode, level, title, script, blanks, listenOrder } = request.body;
    if (!languageCode || !level || !title || !script) {
      return badRequest(reply, "缺少必填字段");
    }
    const blanksArray = ensureArray(blanks);
    if (blanks !== undefined && blanksArray === null) return badRequest(reply, "blanks 必须是数组");
    const data: Prisma.ListeningCreateInput = {
      language: { connect: { code: String(languageCode) } },
      level: String(level),
      title: String(title),
      script: String(script),
      blanks: (blanksArray ?? []) as Prisma.InputJsonValue,
      listenOrder: typeof listenOrder === "number" ? listenOrder : Number(listenOrder ?? 0),
    };
    const item = await prisma.listening.create({ data });
    return sendSuccess(reply, {
      id: item.id,
      languageCode: item.languageCode,
      level: item.level,
      title: item.title,
      script: item.script,
      blanks: item.blanks as { index: number; answer: string }[],
      listenOrder: item.listenOrder,
    });
  });

  fastify.put<{ Params: { id: string }; Body: Record<string, unknown> }>("/admin/listening/:id", async (request, reply) => {
    const { languageCode, level, title, script, blanks, listenOrder } = request.body;
    const update: Prisma.ListeningUpdateInput = {};
    if (typeof languageCode === "string") update.language = { connect: { code: languageCode } };
    if (typeof level === "string") update.level = level;
    if (typeof title === "string") update.title = title;
    if (typeof script === "string") update.script = script;
    if (typeof listenOrder === "number") update.listenOrder = listenOrder;
    if (blanks !== undefined) {
      const blanksArray = ensureArray(blanks);
      if (blanksArray === null) return badRequest(reply, "blanks 必须是数组");
      update.blanks = blanksArray as Prisma.InputJsonValue;
    }
    if (Object.keys(update).length === 0) return badRequest(reply, "缺少可更新字段");
    const item = await prisma.listening.update({ where: { id: request.params.id }, data: update });
    return sendSuccess(reply, {
      id: item.id,
      languageCode: item.languageCode,
      level: item.level,
      title: item.title,
      script: item.script,
      blanks: item.blanks as { index: number; answer: string }[],
      listenOrder: item.listenOrder,
    });
  });

  fastify.delete<{ Params: { id: string } }>("/admin/listening/:id", async (request, reply) => {
    await prisma.listening.delete({ where: { id: request.params.id } });
    return sendSuccess(reply, { id: request.params.id });
  });

  // ====== Speaking ======
  fastify.get<{ Querystring: { language?: string; level?: string } }>("/admin/speaking", async (request, reply) => {
    const items = await prisma.speaking.findMany({
      where: buildWhere(request.query.language, request.query.level),
      orderBy: [{ speakOrder: "asc" }, { phrase: "asc" }],
    });
    return sendSuccess(
      reply,
      items.map((s) => ({
        id: s.id,
        languageCode: s.languageCode,
        level: s.level,
        phrase: s.phrase,
        translation: s.translation,
        phonetic: s.phonetic,
        speakOrder: s.speakOrder,
      }))
    );
  });

  fastify.get<{ Params: { id: string } }>("/admin/speaking/:id", async (request, reply) => {
    const item = await prisma.speaking.findUnique({ where: { id: request.params.id } });
    if (!item) return sendError(reply, "NOT_FOUND", "口语句子不存在");
    return sendSuccess(reply, {
      id: item.id,
      languageCode: item.languageCode,
      level: item.level,
      phrase: item.phrase,
      translation: item.translation,
      phonetic: item.phonetic,
      speakOrder: item.speakOrder,
    });
  });

  fastify.post<{ Body: Record<string, unknown> }>("/admin/speaking", async (request, reply) => {
    const { languageCode, level, phrase, translation, phonetic, speakOrder } = request.body;
    if (!languageCode || !level || !phrase || !translation) {
      return badRequest(reply, "缺少必填字段");
    }
    const data: Prisma.SpeakingCreateInput = {
      language: { connect: { code: String(languageCode) } },
      level: String(level),
      phrase: String(phrase),
      translation: String(translation),
      phonetic: typeof phonetic === "string" ? phonetic : null,
      speakOrder: typeof speakOrder === "number" ? speakOrder : Number(speakOrder ?? 0),
    };
    const item = await prisma.speaking.create({ data });
    return sendSuccess(reply, {
      id: item.id,
      languageCode: item.languageCode,
      level: item.level,
      phrase: item.phrase,
      translation: item.translation,
      phonetic: item.phonetic,
      speakOrder: item.speakOrder,
    });
  });

  fastify.put<{ Params: { id: string }; Body: Record<string, unknown> }>("/admin/speaking/:id", async (request, reply) => {
    const { languageCode, level, phrase, translation, phonetic, speakOrder } = request.body;
    const update: Prisma.SpeakingUpdateInput = {};
    if (typeof languageCode === "string") update.language = { connect: { code: languageCode } };
    if (typeof level === "string") update.level = level;
    if (typeof phrase === "string") update.phrase = phrase;
    if (typeof translation === "string") update.translation = translation;
    if (typeof phonetic === "string") update.phonetic = phonetic;
    if (typeof speakOrder === "number") update.speakOrder = speakOrder;
    if (Object.keys(update).length === 0) return badRequest(reply, "缺少可更新字段");
    const item = await prisma.speaking.update({ where: { id: request.params.id }, data: update });
    return sendSuccess(reply, {
      id: item.id,
      languageCode: item.languageCode,
      level: item.level,
      phrase: item.phrase,
      translation: item.translation,
      phonetic: item.phonetic,
      speakOrder: item.speakOrder,
    });
  });

  fastify.delete<{ Params: { id: string } }>("/admin/speaking/:id", async (request, reply) => {
    await prisma.speaking.delete({ where: { id: request.params.id } });
    return sendSuccess(reply, { id: request.params.id });
  });
};

export default adminRoutes;
