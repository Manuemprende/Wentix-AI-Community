import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

interface OrbiMascotProps {
  userContext?: any;
}

export default function OrbiMascot({ userContext }: OrbiMascotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState<"idle" | "thinking" | "happy">("idle");
  const [messages, setMessages] = useState<{ role: "orbi" | "user"; content: string }[]>([
    {
      role: "orbi",
      content: "¡Hola! Soy **ORBI**, tu asistente holográfico flotante en Wentix AI. 🌌\n\n¿Quieres saber cuál es el stack gratuito óptimo para tu negocio, optimizar algún prompt o ver cómo crear automatizaciones en minutos? Dime qué te trae por aquí."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Handle expression switching during loading state
  useEffect(() => {
    if (isLoading) {
      setExpression("thinking");
    } else {
      const timer = setTimeout(() => setExpression("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setExpression("thinking");

    try {
      const response = await fetch("/api/gemini/orbi-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          userContext
        })
      });

      if (!response.ok) {
        throw new Error("Respuesta fallida");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "orbi", content: data.text }]);
      setExpression("happy");
    } catch (err: any) {
      console.error("Error communicating with ORBI:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "orbi",
          content: "⚠️ **Ups, parece que mi sistema de telepatía espacial falló temporariamente.**\n\n¿Podrías reintentar enviar el comando en unos segundos?"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Mascot Trigger */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <div className="mb-2 mr-2 bg-black/80 text-[10px] text-cyan-400 font-mono px-2 py-1 rounded border border-cyan-800/50 glow-cyan animate-pulse">
            SISTEMA ONLINE - ORBI v1.0
          </div>
        )}
        
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setExpression("happy");
          }}
          className="relative group p-1.5 bg-black rounded-full border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:scale-105 active:scale-95 cursor-pointer"
          style={{ width: "66px", height: "66px" }}
          id="orbi-mascot-trigger"
        >
          {/* Hologram Light rays under Mascot */}
          <div className="absolute inset-x-0 bottom-[-20px] mx-auto w-8 h-12 bg-gradient-to-t from-transparent via-cyan-500/20 to-transparent blur-md opacity-75 pointer-events-none rounded-full group-hover:scale-125 transition-transform" />

          {/* Glowing Rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/20 blur-md group-hover:duration-500 animate-pulse-glow" />

          {/* Orbi Core Visual */}
          <div className="relative w-full h-full rounded-full bg-linear-to-b from-neutral-900 to-black flex flex-col items-center justify-center overflow-hidden border border-white/5">
            {/* Mascot Face & Eyes */}
            <div className={`transition-all duration-500 flex flex-col items-center ${expression === "thinking" ? "animate-spin-slow" : "animate-float"}`}>
              {/* LED Eye line */}
              <div className="flex gap-2.5 mb-1 justify-center items-center">
                <span className={`h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] transition-all duration-300 ${
                  expression === "thinking" ? "w-4 h-1 bg-purple-400 shadow-[0_0_8px_#9d4edd]" : 
                  expression === "happy" ? "w-2.5 h-2.5 -translate-y-0.5 rotate-45 border-t-2 border-r-2 border-cyan-300 bg-transparent shadow-none rounded-none" : "w-1.5"
                }`} />
                <span className={`h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] transition-all duration-300 ${
                  expression === "thinking" ? "w-4 h-1 bg-purple-400 shadow-[0_0_8px_#9d4edd]" : 
                  expression === "happy" ? "w-2.5 h-2.5 -translate-y-0.5 -rotate-45 border-t-2 border-l-2 border-cyan-300 bg-transparent shadow-none rounded-none" : "w-1.5"
                }`} />
              </div>
              
              {/* Minimal Hologram smile */}
              <div className={`h-0.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_rgba(0,240,255,0.7)] transition-all duration-300 ${
                expression === "thinking" ? "w-2" : expression === "happy" ? "w-3 h-1 rounded-b-full bg-cyan-400 border-none" : "w-1.5"
              }`} />
            </div>

            {/* Glowing active bar */}
            <div className={`absolute bottom-1 w-4 h-1 rounded-full ${isLoading ? "bg-purple-500 shadow-[0_0_5px_#9d4edd]" : "bg-cyan-500 shadow-[0_0_5px_#00f0ff] animate-pulse"}`} />
          </div>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-[400px] max-w-[calc(100vw-32px)] h-[540px] z-50 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] focus-within:border-cyan-500/30 transition-all duration-300">
          
          {/* Header */}
          <div className="px-4 py-3 bg-neutral-900/50 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 -ml-3.5" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold font-display text-white tracking-wider flex items-center gap-1">
                  ORBI Assistant <Sparkles className="w-3 h-3 text-cyan-400" />
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">Status: Hyperspace Sync OK</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick recommendations context bar */}
          <div className="bg-cyan-950/20 border-b border-cyan-900/20 px-3 py-1.5 flex gap-2 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setInput("Sugerir stack gratis para ecommerce")}
              className="text-[10px] text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/30 whitespace-nowrap cursor-pointer transition-colors"
            >
              🛍️ Stack Ecommerce
            </button>
            <button 
              onClick={() => setInput("Dame un prompt para posicionar mi video")}
              className="text-[10px] text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/30 whitespace-nowrap cursor-pointer transition-colors"
            >
              📱 Guiones Virales
            </button>
            <button 
              onClick={() => setInput("¿Cómo configuro mi scraper automático?")}
              className="text-[10px] text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/30 whitespace-nowrap cursor-pointer transition-colors"
            >
              🔄 Automatizaciones
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center shrink-0 border border-cyan-800/50">
                    <Bot className="w-4 h-4 text-cyan-400 shadow-sm" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed break-words whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-cyan-600 text-white rounded-br-none shadow-[0_4px_15px_rgba(0,180,255,0.15)]"
                      : "bg-neutral-900 text-neutral-300 rounded-bl-none border border-white/5"
                  }`}
                >
                  {/* Basic robust Markdown renderer styling custom text */}
                  {msg.content.split("\n\n").map((paragraph, pIdx) => {
                    return (
                      <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
                        {paragraph.split("\n").map((line, lIdx) => {
                          if (line.startsWith("* ") || line.startsWith("- ")) {
                            return (
                              <span key={lIdx} className="block pl-3 relative mt-1">
                                <span className="absolute left-0 text-cyan-450">•</span>
                                {renderFormattedText(line.substring(2))}
                              </span>
                            );
                          }
                          return (
                            <span key={lIdx} className="block">
                              {renderFormattedText(line)}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-950 flex items-center justify-center shrink-0 border border-purple-800/50 animate-pulse">
                  <Bot className="w-4 h-4 text-purple-400" />
                </div>
                <div className="bg-neutral-900 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-neutral-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                  <span>ORBI está procesando tu prompt espacial...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-3 bg-neutral-950/80 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a ORBI..."
              className="flex-1 bg-white/5 hover:bg-white/[0.08] focus:bg-neutral-900 border border-white/5 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-800 text-black disabled:text-neutral-500 rounded-xl transition-all font-bold focus:outline-none flex items-center justify-center cursor-pointer active:scale-95"
              style={{ width: "36px", height: "36px" }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// Simple bold parsing helper to avoid styling breakages
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.substring(2, part.length - 2)}
        </strong>
      );
    }
    return part;
  });
}
