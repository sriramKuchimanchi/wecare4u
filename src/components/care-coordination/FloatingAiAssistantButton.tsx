import { Sparkles } from '@/config/icons';
import { useAiAssistantStore } from '@/store';

export const FloatingAiAssistantButton = () => {
  const toggleOpen = useAiAssistantStore((s) => s.toggleOpen);

  return (
    <div className="fixed bottom-20 right-20 z-40 md:bottom-6 md:right-24">
      <button
        type="button"
        onClick={toggleOpen}
        className="group relative flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-elevated transition-all hover:scale-105 active:scale-95 md:h-14 md:px-5"
        aria-label="AI Care Assistant"
        title="AI Care Assistant"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
          <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
        </span>
        <span className="hidden text-xs font-bold sm:inline-block md:text-sm">AI Assistant</span>
      </button>
    </div>
  );
};

export default FloatingAiAssistantButton;
