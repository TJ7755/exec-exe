import { GEMINI_KEY_STORAGE, OPENROUTER_KEY_STORAGE, LLMProvider } from "../../utils/constants";

export const getGeminiKey = (): string | null => {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE);
  } catch (error) {
    console.error("Failed to retrieve Gemini key", error);
    return null;
  }
};

export const getOpenRouterKey = (): string | null => {
  try {
    return localStorage.getItem(OPENROUTER_KEY_STORAGE);
  } catch (error) {
    console.error("Failed to retrieve OpenRouter key", error);
    return null;
  }
};

export const setGeminiKey = (key: string): void => {
  try {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  } catch (error) {
    console.error("Failed to store Gemini key", error);
  }
};

export const setOpenRouterKey = (key: string): void => {
  try {
    localStorage.setItem(OPENROUTER_KEY_STORAGE, key.trim());
  } catch (error) {
    console.error("Failed to store OpenRouter key", error);
  }
};

export const clearGeminiKey = (): void => {
  try {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  } catch (error) {
    console.error("Failed to clear Gemini key", error);
  }
};

export const clearOpenRouterKey = (): void => {
  try {
    localStorage.removeItem(OPENROUTER_KEY_STORAGE);
  } catch (error) {
    console.error("Failed to clear OpenRouter key", error);
  }
};

export const getAvailableProviders = (): LLMProvider[] => {
  const providers: LLMProvider[] = [];
  if (getGeminiKey()) {
    providers.push(LLMProvider.GEMINI);
  }
  if (getOpenRouterKey()) {
    providers.push(LLMProvider.OPENROUTER);
  }
  return providers;
};

export const hasAnyProvider = (): boolean => {
  return getAvailableProviders().length > 0;
};
