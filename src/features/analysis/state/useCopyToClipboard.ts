import { useTemporaryFlag } from "@/shared/hooks/useTemporaryFlag";

export function useCopyToClipboard(resetMs = 2000) {
  const { active: copied, trigger: setCopied } = useTemporaryFlag(resetMs);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied();
    } catch {
      // leave copied as false
    }
  }

  return { copied, copy };
}
