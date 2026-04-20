import { useTemporaryFlag } from "@/shared/hooks/useTemporaryFlag";

export function useCopyToClipboard(resetMs = 2000) {
  const { active: copied, trigger: setCopied, reset: clearCopied } = useTemporaryFlag(resetMs);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied();
    } catch {
      clearCopied();
    }
  }

  return { copied, copy };
}
