-- 为 word_bank_translations 添加复合索引，加速按母语查询单词释义的性能
CREATE INDEX "word_bank_translations_baseLanguageCode_wordBankId_idx" ON "word_bank_translations"("baseLanguageCode", "wordBankId");
