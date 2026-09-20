import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  Square,
  Radio,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Link, useSearchParams } from "react-router-dom";
import { KisanVoiceAssistant } from "@/components/assistant/KisanVoiceAssistant";
import {
  generateKisanResponse,
  cleanTextForSpeech,
  getBrowserSpeechRecognition,
  type SpeechRecognitionInstanceLike,
  type SpeechRecognitionEventLike,
  type SpeechRecognitionErrorEventLike,
} from "@/services/kisanAssistantService";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  tags?: string[];
  actionLink?: { text: string; url: string };
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "assistant",
    text: "Namaste Ramesh ji! 🙏 I am your **Sasyam AI Kisan Advisor** powered by ICAR crop models and local weather data. How can I assist you with your crops, soil, market pricing, or disease diagnosis today?\n\n💡 *Tip: You can now ask questions by voice in Hindi, English, Punjabi and more using our **Kisan Voice Assistant**!*",
    timestamp: "10:30 AM",
    tags: ["ICAR Guidelines", "Voice & Text", "APMC Sync"],
  },
];

const samplePrompts = [
  {
    category: "Disease",
    text: "My tomato leaves show dark concentric rings with yellow margins. What treatment do you recommend?",
  },
  {
    category: "Decision",
    text: "I harvested 50 quintals of potatoes. Should I sell now in mandi or keep in cold storage?",
  },
  {
    category: "Fertilizer",
    text: "What is the recommended NPK and zinc application for Basmati Rice during tillering?",
  },
  {
    category: "Market",
    text: "What is the current tomato price trend in Azadpur and Jaipur mandis?",
  },
  {
    category: "हिन्दी प्रश्न",
    text: "धान की फसल में यूरिया और जिंक कब और कितना डालना चाहिए?",
  },
  {
    category: "मौसम/स्प्रे",
    text: "अगले 48 घंटे में मौसम कैसा रहेगा? क्या आज कीटनाशक छिड़क सकते हैं?",
  },
];

function Assistant() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "voice" ? "voice" : "chat";
  const [mode, setMode] = useState<"chat" | "voice">(initialMode);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatListening, setIsChatListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstanceLike | null>(null);
  const idCounterRef = useRef(100);

  // Sync mode with URL param
  const handleSetMode = (newMode: "chat" | "voice") => {
    setMode(newMode);
    setSearchParams(newMode === "voice" ? { mode: "voice" } : {});
    stopSpeaking();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mode === "chat") {
      scrollToBottom();
    }
  }, [messages, isTyping, mode]);

  // Clean up speech synthesis and mic on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
  };

  const speakMessage = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingMsgId === id) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setSpeakingMsgId(id);

    const clean = cleanTextForSpeech(text);
    const isHindi = /[\u0900-\u097F]/.test(clean);
    const langCode = isHindi ? "hi-IN" : "en-IN";

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = langCode;
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase()));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  const toggleChatMic = () => {
    if (isChatListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsChatListening(false);
      return;
    }

    const SpeechRecognition = getBrowserSpeechRecognition();

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please switch to Kisan Voice Assistant or type your query.");
      return;
    }

    try {
      stopSpeaking();
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "hi-IN"; // Default to Hindi-English bilingual

      recognition.onstart = () => {
        setIsChatListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = (err: SpeechRecognitionErrorEventLike) => {
        console.warn("Chat mic error:", err.error);
        setIsChatListening(false);
      };

      recognition.onend = () => {
        setIsChatListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: unknown) {
      console.error(e);
      setIsChatListening(false);
    }
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    stopSpeaking();
    if (isChatListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsChatListening(false);
    }

    const nextId = `user-${idCounterRef.current++}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: Message = {
      id: nextId,
      sender: "user",
      text: text.trim(),
      timestamp: nowTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Generate response using kisanAssistantService
    setTimeout(() => {
      const isHindi = /[\u0900-\u097F]/.test(text);
      const res = generateKisanResponse(text, isHindi ? "hi-IN" : "en-IN");
      const botId = `bot-${idCounterRef.current++}`;
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const botMsg: Message = {
        id: botId,
        sender: "assistant",
        text: res.text,
        timestamp: botTime,
        tags: res.tags,
        actionLink: res.actionLink,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleResetChat = () => {
    stopSpeaking();
    setMessages(initialMessages);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-6xl mx-auto space-y-4">
      {/* Top Header with Mode Tabs */}
      <PageHeader
        title="Kisan AI & Voice Assistant"
        description="Ask questions via voice or text in हिन्दी, English, ਪੰਜਾਬੀ & regional languages about crop diseases, fertilizers, weather, market rates, and subsidies."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center rounded-xl bg-slate-200/70 p-1 border border-slate-300/60 shadow-xs">
              <button
                onClick={() => handleSetMode("chat")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  mode === "chat"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Bot size={15} />
                Text Chat
              </button>

              <button
                onClick={() => handleSetMode("voice")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  mode === "voice"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Mic size={15} />
                Kisan Voice Assistant
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            </div>

            <button
              onClick={handleResetChat}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              title="Reset conversation"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">New Session</span>
            </button>
          </div>
        }
      />

      {/* Mode 1: Dedicated Kisan Voice Assistant */}
      {mode === "voice" ? (
        <div className="flex-1 overflow-y-auto pb-4">
          <KisanVoiceAssistant
            onSwitchToChat={(initialText) => {
              handleSetMode("chat");
              if (initialText) {
                handleSend(initialText);
              }
            }}
          />
        </div>
      ) : (
        /* Mode 2: Interactive Text Chat with Voice-In and Voice-Out */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
          {/* Left Sidebar: Quick Prompts & Agri Tips */}
          <div className="hidden lg:flex flex-col gap-4 overflow-y-auto">
            {/* Quick Switch to Voice Card */}
            <div className="rounded-2xl border border-emerald-300/80 bg-gradient-to-br from-emerald-900 to-emerald-950 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
                  <Mic size={18} />
                </span>
                <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  New Feature
                </span>
              </div>
              <h4 className="mt-3 text-sm font-bold">Kisan Voice Assistant</h4>
              <p className="mt-1 text-xs text-emerald-200/80 leading-relaxed">
                Hands-free voice consultation in Hindi, English, Punjabi & Marathi. Speak directly to Sasyam AI.
              </p>
              <button
                onClick={() => handleSetMode("voice")}
                className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition shadow-sm"
              >
                <Radio size={14} className="text-emerald-700" />
                Launch Voice Assistant →
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-emerald-700">
                <Lightbulb size={16} />
                Suggested Agri Queries
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Click any query to ask the AI advisor instantly:
              </p>

              <div className="mt-3 space-y-2">
                {samplePrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.text)}
                    className="w-full text-left rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-900 transition"
                  >
                    <span className="inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 mb-1">
                      {item.category}
                    </span>
                    <p className="line-clamp-2 leading-relaxed">{item.text}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-950 p-4 text-white shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Sparkles size={16} />
                AI Model: AgriLLM v2.4
              </div>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Trained on ICAR crop production protocols, PlantVillage pathology dataset, and real-time e-NAM mandi indices.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300">
                <CheckCircle2 size={13} />
                Government PM-KISAN & KCC guidelines integrated
              </div>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="lg:col-span-3 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-0">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Sasyam Expert Advisor</h3>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] text-emerald-600 font-medium">Online</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Multilingual & Voice Enabled</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetMode("voice")}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-xs"
                >
                  <Mic size={14} className="text-emerald-700" />
                  Voice Mode
                </button>
                <span className="hidden sm:inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                  🌱 Punjab Agro-Zone
                </span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-xl rounded-2xl p-4 shadow-sm text-sm ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </div>

                    {msg.actionLink && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <Link
                          to={msg.actionLink.url}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          {msg.actionLink.text}
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    )}

                    {msg.tags && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {msg.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom row: Time + Read Aloud button for assistant */}
                    <div
                      className={`mt-2 flex items-center justify-between text-[10px] ${
                        msg.sender === "user" ? "text-emerald-100" : "text-slate-400"
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {msg.sender === "assistant" && (
                        <button
                          onClick={() => speakMessage(msg.id, msg.text)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold transition ${
                            speakingMsgId === msg.id
                              ? "bg-emerald-100 text-emerald-800"
                              : "hover:bg-slate-100 text-slate-600"
                          }`}
                          title={speakingMsgId === msg.id ? "Stop voice" : "Listen aloud (आवाज़ सुनें)"}
                        >
                          {speakingMsgId === msg.id ? (
                            <>
                              <Square size={11} className="fill-emerald-800" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={12} />
                              <span>Listen (सुनें)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm font-bold text-xs">
                      RK
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-3 shadow-sm text-xs text-slate-500 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span>Sasyam AI is analyzing crop database...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Mobile Suggestion Chips */}
            <div className="lg:hidden flex gap-2 overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-100">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.text)}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-emerald-50"
                >
                  {p.category}: {p.text.slice(0, 25)}...
                </button>
              ))}
            </div>

            {/* Live Listening Banner */}
            {isChatListening && (
              <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-700 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping"></span>
                  <span className="font-bold">Listening to your voice... बोलिए हम सुन रहे हैं</span>
                </div>
                <button
                  onClick={toggleChatMic}
                  className="font-bold text-rose-800 underline hover:text-rose-950"
                >
                  Done
                </button>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about crop diseases, fertilizer dosage, mandi rates or weather advisory..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-11 py-3 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition"
                  />

                  {/* Mic Button directly in chat input */}
                  <button
                    type="button"
                    onClick={toggleChatMic}
                    className={`absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-lg transition ${
                      isChatListening
                        ? "bg-rose-500 text-white animate-pulse"
                        : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                    title={isChatListening ? "Stop listening" : "Speak your query (बोलकर पूछें)"}
                  >
                    {isChatListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-700/20 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Sasyam AI integrates ICAR Agronomy advisories & e-NAM market indices.
                </span>
                <button
                  onClick={() => handleSetMode("voice")}
                  className="hidden sm:inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                >
                  <Mic size={12} />
                  Switch to Kisan Voice Assistant →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assistant;