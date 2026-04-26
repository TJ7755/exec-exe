export const OPENROUTER_MODEL_ID = "minimax/minimax-m2.5:free";
export const OPENROUTER_KEY_STORAGE = "exec_exe_openrouter_api_key";
export const OPENROUTER_ENABLED_STORAGE = "exec_exe_openrouter_enabled";

export const GEMINI_KEY_STORAGE = "exec_exe_gemini_api_key";
export const GEMINI_MODEL_ID = "gemini-2.0-flash-exp";

export const LLM_REQUEST_TIMEOUT_MS = 8000;
export const LLM_CHARACTER_COOLDOWN_MS = 3000;

export enum LLMProvider {
  GEMINI = "gemini",
  OPENROUTER = "openrouter",
}

