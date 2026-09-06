import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatResponse, Product } from '../types';
import { sendChatMessage } from '../services/api';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Trash2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
  Layers
} from 'lucide-react';

interface ChatCopilotProps {
  products: Product[];
  initialMessage?: string;
  hasGeminiKey: boolean;
  onOpenApiKeyModal: () => void;
}

export const ChatCopilot: React.FC<ChatCopilotProps> = ({
  products,
  initialMessage,
  hasGeminiKey,
  onOpenApiKeyModal
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `### 🤖 Welcome to your Retail Promotion & Inventory AI Copilot!

I have continuous access to your store's live catalog (${products.length} active SKUs), inventory stock levels, sales history, and margin targets.

**What I can do for you:**
1. **Analyze Inventory Alignment**: Identify overstocked deadstock items vs high-velocity stockout dangers.
2. **Recommend Optimal Discounts**: Advise exactly how much discount to apply and forecast customer demand lift.
3. **Protect Margins**: Prevent accidental promotions on low-stock winners.
4. **Draft Strategic Campaigns**: Craft targeted weekend bundles, flash sales, and cohort-specific offers.

Feel free to ask any question or click a prompt below!`
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([
    "Which products have the highest stockout risk?",
    "Suggest a clearance strategy for overstocked apparel.",
    "What discounts should I run this weekend for maximum profit?",
    "Why shouldn't I discount high-velocity running shoes?"
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialMessage && initialMessage.trim() !== '') {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: messageText };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(messageText, messages);
      setMessages([...newHistory, { role: 'assistant', content: response.reply }]);
      if (response.suggested_actions && response.suggested_actions.length > 0) {
        setSuggestedActions(response.suggested_actions);
      }
    } catch (err: any) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: `⚠️ Failed to get AI response: ${err.message || 'Unknown network error'}. Please try again.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation reset. How can I assist you with your retail inventory and promotion planning today?`
      }
    ]);
  };

  // Simple Markdown renderer for crisp UI presentation
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return <h3 key={idx} className="text-base font-bold text-sky-300 mt-3 mb-1">{line.replace('### ', '')}</h3>;
          }
          if (line.startsWith('#### ')) {
            return <h4 key={idx} className="text-sm font-semibold text-slate-200 mt-2 mb-1">{line.replace('#### ', '')}</h4>;
          }
          if (line.startsWith('- ') || line.startsWith('• ')) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-1 text-slate-300">
                <span className="text-sky-400 mt-1.5">•</span>
                <span>{renderInlineFormatting(line.substring(2))}</span>
              </div>
            );
          }
          if (line.match(/^\d+\.\s/)) {
            const num = line.match(/^\d+\./)?.[0];
            const text = line.replace(/^\d+\.\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 ml-1 text-slate-300">
                <span className="font-bold text-sky-400">{num}</span>
                <span>{renderInlineFormatting(text)}</span>
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1.5" />;
          }
          return <p key={idx} className="text-slate-300">{renderInlineFormatting(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineFormatting = (text: string) => {
    // Basic bold parsing: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[850px] bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">PromoAlign AI Copilot</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {hasGeminiKey ? 'Gemini 2.5 Flash' : 'Retail Engine Online'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Context-aware retail strategy, inventory alignment, and discount decision assistant</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!hasGeminiKey && (
            <button
              onClick={onOpenApiKeyModal}
              className="text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect Gemini API</span>
            </button>
          )}
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-sky-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-sky-600 text-white shadow-md shadow-sky-500/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                  isUser
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                }`}
              >
                {isUser ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  renderFormattedContent(msg.content)
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-slate-300 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Analyzing live inventory, elasticity, and margins...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Row */}
      {suggestedActions.length > 0 && !loading && (
        <div className="px-6 py-2.5 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            Suggested:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action)}
                className="text-xs bg-slate-800/90 hover:bg-sky-600 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-700 hover:border-sky-500 transition-all flex items-center gap-1 shrink-0"
              >
                <span>{action}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI Copilot anything about promotions, inventory, stockout risks, margins..."
            rows={1}
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`absolute right-2 p-2 rounded-lg transition-all ${
              input.trim() && !loading
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 bg-slate-800/50 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
