import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, ArrowLeft } from '@/config/icons';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAiAssistantStore } from '@/store';
import aiAssistantService from '@/services/ai-assistant.service';
import { SmartActionCards } from '@/components/care-coordination/SmartActionCards';
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

export const AiAssistantPage = () => {
  const navigate = useNavigate();
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
        text: 'Sorry, I am having trouble processing your query right now. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <Button variant="outline" size="sm" onClick={resetChat} className="gap-1.5">
          <RefreshCw className="h-4 w-4" /> Reset Chat
        </Button>
      </div>

      <PageHeader
        title="24×7 AI Care Assistant"
        description="Smart care recommendations, instant action cards, and healthcare guidance"
      />

      {/* Main Chat Box Container */}
      <Card className="flex flex-1 flex-col overflow-hidden border-border bg-card shadow-sm">
        {/* Messages Feed */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'assistant' && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                </span>
              )}
              <div className={`flex max-w-[85%] flex-col rounded-2xl p-4 ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-card border border-border text-foreground rounded-tl-none shadow-xs'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.actions && msg.actions.length > 0 && (
                  <SmartActionCards actions={msg.actions} />
                )}
                <span className={`mt-1.5 self-end text-2xs ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              {msg.sender === 'user' && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <User className="h-5 w-5" />
                </span>
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="border-t border-border bg-surface p-3">
          <p className="mb-2 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Action Suggestions</p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-foreground font-medium transition-all hover:border-primary hover:bg-primary/5"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-2 border-t border-border bg-surface p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Assistant anything (e.g. 'I need a doctor for my father')..."
            className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <Button size="lg" onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="bg-primary text-primary-foreground font-bold">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AiAssistantPage;
