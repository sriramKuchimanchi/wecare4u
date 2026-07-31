import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, X, Loader2, RefreshCw } from '@/config/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAiAssistantStore } from '@/store';
import aiAssistantService from '@/services/ai-assistant.service';
import { SmartActionCards } from './SmartActionCards';
import { formatTime } from '@/utils/date';

const promptSuggestions = [
  "I need a doctor.",
  "My father has chest pain.",
  "I need an ambulance.",
  "My mother missed her medicine.",
  "I need a caregiver.",
  "I need an electrician.",
  "I need a plumber.",
  "I'm looking for a nearby hospital.",
];

export const AiAssistantDrawer = () => {
  const isOpen = useAiAssistantStore((s) => s.isOpen);
  const setOpen = useAiAssistantStore((s) => s.setOpen);
  const messages = useAiAssistantStore((s) => s.messages);
  const addMessage = useAiAssistantStore((s) => s.addMessage);
  const isTyping = useAiAssistantStore((s) => s.isTyping);
  const setTyping = useAiAssistantStore((s) => s.setTyping);
  const resetChat = useAiAssistantStore((s) => s.resetChat);

  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMsg);
    setInput('');
    setTyping(true);

    try {
      const res = await aiAssistantService.processPrompt(query);
      if (res.success && res.data) {
        addMessage(res.data);
      }
    } catch {
      addMessage({
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I am having trouble connecting right now. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setTyping(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex h-full w-full max-w-md flex-col p-0 sm:w-[440px]">
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border bg-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="flex flex-col text-left">
              <SheetTitle className="text-base font-bold text-white">AI Care Coordinator</SheetTitle>
              <span className="text-2xs text-primary-foreground/80">Available 24×7 · Multi-language</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={resetChat} title="Reset Chat">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Message Area */}
        <div className="flex flex-1 flex-col overflow-y-auto bg-background p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'assistant' && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </span>
              )}
              <div className={`flex max-w-[82%] flex-col rounded-2xl p-3.5 ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-card border border-border text-foreground rounded-tl-none shadow-xs'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.actions && msg.actions.length > 0 && (
                  <SmartActionCards actions={msg.actions} onActionClick={() => setOpen(false)} />
                )}
                <span className={`mt-1 self-end text-2xs ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              {msg.sender === 'user' && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <User className="h-4 w-4" />
                </span>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>AI Coordinator is typing…</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions Carousel */}
        <div className="border-t border-border bg-surface p-3">
          <p className="mb-2 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Prompts</p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground transition-colors hover:border-primary hover:bg-primary/5"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 border-t border-border bg-surface p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your healthcare request or query..."
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <Button size="icon" onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AiAssistantDrawer;
