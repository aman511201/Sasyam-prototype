import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Link } from "react-router-dom";

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
    text: "Namaste Ramesh ji! 🙏 I am your **Sasyam AI Kisan Advisor** powered by ICAR crop models and local weather data. How can I assist you with your crops, soil, market pricing, or disease diagnosis today?",
    timestamp: "10:30 AM",
    tags: ["ICAR Guidelines", "APMC Sync", "Multilingual"],
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
];

function Assistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate smart AI response based on query
    setTimeout(() => {
      let botResponse = "";
      let actionLink: { text: string; url: string } | undefined;
      const lower = text.toLowerCase();

      if (lower.includes("tomato") || lower.includes("concentric") || lower.includes("blight") || lower.includes("disease")) {
        botResponse = `🔍 **Diagnosis: Likely Tomato Early Blight (*Alternaria solani*)**

**Key Recommended Steps:**
1. **Immediate Spray (Chemical):** Apply **Mancozeb 75% WP** @ 2g/litre of water OR **Azoxystrobin 23% SC** @ 1ml/litre.
2. **Organic/Biological Treatment:** Spray *Trichoderma harzianum* @ 5g/litre or Neem Oil 10,000 ppm @ 3ml/litre in morning hours.
3. **Farm Hygiene:** Remove and safely destroy heavily infected lower leaves to prevent spore propagation.
4. **Irrigation:** Avoid overhead sprinkler irrigation; switch to drip irrigation to keep foliage dry.

💡 *Tip: You can also upload a clear leaf photo in our **AI Disease Detection** module for instantaneous visual confirmation.*`;
        actionLink = { text: "Scan Leaf in AI Disease Detection", url: "/app/disease-detection" };
      } else if (lower.includes("cold storage") || lower.includes("sell") || lower.includes("decision") || lower.includes("potato")) {
        botResponse = `📊 **Market & Storage Decision Advisory for Potato:**

- **Current Local Mandi Price:** ₹1,450 / quintal.
- **Estimated Mandi Price in 30-45 Days:** ₹1,950 - ₹2,100 / quintal.
- **Cold Storage Cost:** Approx ₹110 / quintal / month.
- **Projected Net Gain:** **+₹390 / quintal** after storage & transit cost deduction.

**AI Recommendation:** 
✅ **Store 70% of produce** in cold storage and sell 30% immediately to maintain operational cash flow.`;
        actionLink = { text: "Run Multi-Channel Decision Engine", url: "/app/decision-engine" };
      } else if (lower.includes("fertilizer") || lower.includes("npk") || lower.includes("rice")) {
        botResponse = `🌾 **Basmati Rice Tillering Stage Nutrient Plan (Per Acre):**

1. **Urea:** 30 kg (Top dressing at 21-25 days after transplanting).
2. **Zinc Sulphate (21%):** 10 kg (if not applied at basal stage to prevent Khaira disease).
3. **Bio-fertilizer:** Apply *Azospirillum* & Phosphate Solubilizing Bacteria (PSB) with farmyard manure.
4. **Water Level:** Maintain 2-3 cm standing water during tillering, avoid continuous deep flooding.`;
      } else {
        botResponse = `🌱 **Sasyam AI Analysis:**

Based on your query:
- **Best Practice:** Ensure balanced micronutrient application and soil moisture monitoring.
- **Weather Condition:** Normal temperatures expected this week in your district.
- **Next Step:** You can monitor real-time crop parameters in the **My Crops** section or check mandi rate movements in **Market Intelligence**.`;
        actionLink = { text: "View Market Intelligence", url: "/app/market" };
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionLink,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-6xl mx-auto">
      <PageHeader
        title="Kisan AI Agriculture Assistant"
        description="Ask questions in English, Hindi or Punjabi about crop diseases, fertilizers, weather, market strategies, and government subsidies."
        action={
          <button
            onClick={handleResetChat}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw size={14} />
            New Advisory Session
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Left Sidebar: Quick Prompts & Agri Tips */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-emerald-700">
              <Lightbulb size={16} />
              Suggested Agri Queries
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Click any question to ask the AI advisor instantly:
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
        <div className="lg:col-span-3 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
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
                <p className="text-[11px] text-slate-500">Multilingual Agri Specialist</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
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

                  <div
                    className={`mt-1.5 text-[10px] ${
                      msg.sender === "user" ? "text-emerald-100 text-right" : "text-slate-400 text-left"
                    }`}
                  >
                    {msg.timestamp}
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

          {/* Chat Input Bar */}
          <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about crop diseases, fertilizer dosage, mandi rates or weather advisory..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition"
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-700/20 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Sasyam AI integrates ICAR Agronomy advisories & e-NAM market indices. Always verify with field agronomists for high-scale chemical usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assistant;