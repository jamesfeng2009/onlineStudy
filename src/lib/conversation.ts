/**
 * Conversation engine — a tiny keyword-driven dialogue state machine.
 *
 * Why not call an LLM at runtime?
 *   - Latency: each turn would take 1-3s, breaking the "real-time"
 *     feel of a conversation.
 *   - Cost: a free educational app shouldn't bill per turn.
 *   - Determinism: for language *teaching* we want predictable
 *     branches the learner can study, not open-ended chat.
 *
 * Instead we pre-author a graph of DialogueTurns (offline, or via
 * Gemini batch generation). At runtime the engine just:
 *   1. Reads the user's spoken/typed reply.
 *   2. Lowercases + matches against each branch's keyword list.
 *   3. Picks the first matching branch (or the fallback).
 *   4. Returns the next NPC prompt to be spoken via TTS.
 *
 * This is deliberately dumb — it's a language drill, not a chatbot.
 * The teaching value comes from the *structure* of the authored
 * graph (common scenarios, expected responses, recovery lines).
 */

import type { DialogueScene, DialogueTurn } from "../types";

export interface ConversationState {
  scene: DialogueScene;
  /** Id of the turn we're currently waiting for the user to answer. */
  currentTurnId: string;
  /** Whether the conversation has reached a terminal node. */
  isDone: boolean;
}

/** Begin a fresh conversation on the given scene. Returns the state
 *  plus the opening line the NPC should "say" first. */
export function startConversation(scene: DialogueScene): {
  state: ConversationState;
  npcLine: string;
} {
  return {
    state: {
      scene,
      currentTurnId: scene.startTurnId,
      isDone: false,
    },
    npcLine: scene.opening,
  };
}

/** Look up the current turn (or null if state is invalid). */
export function currentTurn(state: ConversationState): DialogueTurn | null {
  return state.scene.turns[state.currentTurnId] ?? null;
}

/** Normalize user input: lowercase + collapse whitespace + strip
 *  common punctuation so keyword substring matching is robust.
 *  For CJK there's no case, but this still strips full-width punctuation
 *  and Latin punctuation that creeps in. */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[，。！？、；：""''（）【】《》,.!?;:"'()[\]{}<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Advance the conversation given the user's reply.
 *
 * Returns:
 *   - `npcLine`: what the NPC says next (TTS reads this)
 *   - `nextState`: updated state (or same state with isDone if terminal)
 *   - `matched`: true if a keyword branch matched, false if fallback
 *
 * If the scene is already done, returns the terminal line again.
 */
export function runConversationTurn(
  state: ConversationState,
  userReply: string,
): { npcLine: string; nextState: ConversationState; matched: boolean } {
  if (state.isDone) {
    const t = currentTurn(state);
    return { npcLine: t?.prompt ?? "", nextState: state, matched: true };
  }

  const turn = currentTurn(state);
  if (!turn) {
    return { npcLine: "", nextState: { ...state, isDone: true }, matched: false };
  }

  const reply = normalize(userReply);

  // Find the first branch whose keywords appear in the reply.
  let chosen: DialogueTurn | undefined;
  let matched = false;
  for (const branch of turn.branches) {
    if (branch.keywords.length === 0) {
      // Empty keyword list = always-match wildcard. Use sparingly —
      // usually as the LAST branch to catch "anything else".
      chosen = state.scene.turns[branch.nextTurnId];
      matched = true;
      break;
    }
    if (branch.keywords.some((kw) => reply.includes(normalize(kw)))) {
      chosen = state.scene.turns[branch.nextTurnId];
      matched = true;
      break;
    }
  }

  if (!chosen) {
    // Fallback: re-prompt the current turn (loop) or jump to fallback.
    const fb = state.scene.turns[turn.fallbackBranchId];
    chosen = fb ?? turn; // if fallback missing, stay on this turn
  }

  const isTerminal = !!(chosen?.isTerminal);
  const nextState: ConversationState = {
    scene: state.scene,
    currentTurnId: chosen?.id ?? state.currentTurnId,
    isDone: isTerminal,
  };

  return {
    npcLine: chosen?.prompt ?? "",
    nextState,
    matched,
  };
}

/** Reset the conversation to its opening line (keep the same scene). */
export function resetConversation(state: ConversationState): {
  state: ConversationState;
  npcLine: string;
} {
  return startConversation(state.scene);
}
