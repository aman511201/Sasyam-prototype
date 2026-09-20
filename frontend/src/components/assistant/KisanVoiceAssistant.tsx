
import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Globe,
  Radio,
  Copy,
  Check,
  AlertCircle,
  Square,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  SUPPORTED_LANGUAGES,
  VOICE_SAMPLE_QUERIES,
  generateKisanResponse,
  cleanTextForSpeech,
  getBrowserSpeechRecognition,
  type AgriResponse,
  type SpeechRecognitionInstanceLike,
  type SpeechRecognitionEventLike,
  type SpeechRecognitionErrorEventLike,
} from "@/services/kisanAssistantService";

interface VoiceHistoryItem {
  id: string;
  query: string;
  response: AgriResponse;
  timestamp: string;
  langCode: string;
}

interface KisanVoiceAssistantProps {
  onSwitchToChat?: (initialText?: string) => void;
}

export function KisanVoiceAssistant({ onSwitchToChat }: KisanVoiceAssistantProps) {
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]); // Default Hindi (hi-IN)
  const [listeningState, setListeningState] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [activeResult, setActiveResult] = useState<{ query: string; data: AgriResponse } | null>(null);
  const [history, setHistory] = useState<VoiceHistoryItem[]>([]);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechRate, setSpeechRate] = useState<number>(0.92); // Farmer friendly slow/clear pace
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [hasWebSpeech, setHasWebSpeech] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Recognition ref
  const recognitionRef = useRef<SpeechRecognitionInstanceLike | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition = getBrowserSpeechRecognition();
    if (!SpeechRecognition) {
      setHasWebSpeech(false);
    }
  }, []);

  // Cleanup speech on unmount
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
    if (listeningState === "speaking") {
      setListeningState("idle");
    }
  };

  const speakText = (text: string, langCode: string) => {
    if (isMuted || !autoSpeak) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    setListeningState("speaking");

    const clean = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = langCode;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Pick best voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase()));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      setListeningState("idle");
    };
    utterance.onerror = () => {
      setListeningState("idle");
    };

    activeUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleProcessQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    stopSpeaking();
    setListeningState("processing");
    setMicError(null);

    setTimeout(() => {
      const response = generateKisanResponse(queryText, selectedLang.code);
      setActiveResult({ query: queryText, data: response });

      const historyEntry: VoiceHistoryItem = {
        id: Date.now().toString(),
        query: queryText,
        response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        langCode: selectedLang.code,
      };

      setHistory((prev) => [historyEntry, ...prev.slice(0, 7)]);
      setListeningState("idle");

      // Read response aloud
      if (autoSpeak && !isMuted) {
        speakText(response.voiceText, selectedLang.code);
      }
    }, 850);
  };

  const startListening = () => {
    setMicError(null);
    stopSpeaking();

    const SpeechRecognition = getBrowserSpeechRecognition();

    if (!SpeechRecognition) {
      setMicError("Web Speech API not supported on this browser. Try Chrome/Edge or use the sample voice buttons below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang.code;

      recognition.onstart = () => {
        setListeningState("listening");
        setLiveTranscript("");
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        const currentText = final || interim;
        setLiveTranscript(currentText);

        if (final) {
          recognition.stop();
          handleProcessQuery(final);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicError("Microphone permission was denied. Please allow microphone access in browser settings, or tap any sample query below.");
        } else if (event.error === "no-speech") {
          setMicError("No speech detected. Please speak clearly into your microphone.");
        } else {
          setMicError(`Voice error: ${event.error}. You can also use one-click voice queries below.`);
        }
        setListeningState("idle");
      };

      recognition.onend = () => {
        if (listeningState === "listening") {
          setListeningState("idle");
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      console.error("Failed to start speech recognition:", err);
      setMicError("Could not start microphone. You can test immediately with the quick queries below.");
      setListeningState("idle");
    }
  };

  const handleMicToggle = () => {
    if (listeningState === "listening") {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setListeningState("idle");
    } else if (listeningState === "speaking") {
      stopSpeaking();
    } else {
      startListening();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner & Language Selection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 p-5 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <Radio size={24} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400">
              <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Kisan Voice Assistant (किसान आवाज़ सहायक)</h2>
              <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                {hasWebSpeech ? "Live Speech API" : "Interactive Audio"}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Hands-free voice agronomy advisory powered by ICAR crop models and APMC mandi telemetry.
            </p>
          </div>
        </div>

        {/* Vernacular Language Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-700/60 bg-emerald-900/60 px-3 py-1.5 text-xs text-emerald-100">
            <Globe size={14} className="text-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-300">भाषा / Lang:</span>
            <select
              value={selectedLang.code}
              onChange={(e) => {
                const found = SUPPORTED_LANGUAGES.find((l) => l.code === e.target.value);
                if (found) {
                  setSelectedLang(found);
                  stopSpeaking();
                }
              }}
              className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {onSwitchToChat && (
            <button
              onClick={() => onSwitchToChat()}
              className="rounded-xl border border-emerald-700/60 bg-white/10 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-white/20 transition shrink-0"
            >
              💬 Switch to Chat
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Voice Orb Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Central Voice Controller Card */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-emerald-50/30 p-6 sm:p-8 text-center shadow-sm relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Status Label */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                listeningState === "listening"
                  ? "bg-rose-100 text-rose-700 border border-rose-300 animate-pulse"
                  : listeningState === "processing"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : listeningState === "speaking"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {listeningState === "listening" && (
                <>
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping"></span>
                  Listening... बोलिए हम सुन रहे हैं
                </>
              )}
              {listeningState === "processing" && (
                <>
                  <Sparkles size={13} className="text-amber-600 animate-spin" />
                  Analyzing Agri Advisory...
                </>
              )}
              {listeningState === "speaking" && (
                <>
                  <Volume2 size={13} className="text-emerald-600 animate-bounce" />
                  Kisan Advisor Speaking... (उत्तर बोल रहे हैं)
                </>
              )}
              {listeningState === "idle" && (
                <>
                  <Mic size={13} className="text-slate-500" />
                  Ready • Tap Mic to Speak (माइक दबाएं)
                </>
              )}
            </span>
          </div>

          {/* Central Pulsing Mic Orb */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Animated Sound Ripple Rings */}
            {listeningState === "listening" && (
              <>
                <div className="absolute h-44 w-44 rounded-full bg-rose-400/20 animate-ping"></div>
                <div className="absolute h-36 w-36 rounded-full bg-rose-500/30 animate-pulse"></div>
              </>
            )}

            {listeningState === "speaking" && (
              <>
                <div className="absolute h-44 w-44 rounded-full bg-emerald-400/25 animate-ping"></div>
                <div className="absolute h-36 w-36 rounded-full bg-emerald-500/30 animate-pulse"></div>
              </>
            )}

            <button
              onClick={handleMicToggle}
              className={`relative z-10 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
                listeningState === "listening"
                  ? "bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-rose-500/40 ring-8 ring-rose-200"
                  : listeningState === "speaking"
                  ? "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/40 ring-8 ring-emerald-200"
                  : listeningState === "processing"
                  ? "bg-gradient-to-tr from-amber-500 to-yellow-600 text-white shadow-amber-500/40 ring-8 ring-amber-200"
                  : "bg-gradient-to-tr from-emerald-600 to-emerald-700 text-white shadow-emerald-700/30 hover:from-emerald-500 hover:to-emerald-600 ring-8 ring-emerald-100"
              }`}
              title={
                listeningState === "listening"
                  ? "Click to stop listening"
                  : listeningState === "speaking"
                  ? "Click to stop speaking"
                  : "Click to speak in your language"
              }
            >
              {listeningState === "listening" ? (
                <MicOff size={42} className="animate-pulse" />
              ) : listeningState === "speaking" ? (
                <Square size={38} className="fill-white" />
              ) : listeningState === "processing" ? (
                <Sparkles size={40} className="animate-spin" />
              ) : (
                <Mic size={42} />
              )}
            </button>
          </div>

          {/* Equalizer Sound Wave Animation */}
          {(listeningState === "listening" || listeningState === "speaking") && (
            <div className="flex items-center gap-1.5 h-8 my-2">
              {[0.4, 0.8, 1.2, 0.6, 1.0, 0.7, 1.3, 0.5, 0.9, 0.6, 1.1, 0.4].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    listeningState === "listening" ? "bg-rose-500" : "bg-emerald-600"
                  }`}
                  style={{
                    height: `${Math.max(8, h * 24)}px`,
                    animation: `pulse 0.6s infinite alternate ease-in-out ${i * 0.08}s`,
                  }}
                ></span>
              ))}
            </div>
          )}

          {/* Live Transcript / Prompt hint */}
          <div className="mt-2 min-h-[52px] max-w-lg w-full flex items-center justify-center">
            {liveTranscript ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-900 shadow-sm animate-fade-in">
                "{liveTranscript}"
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {selectedLang.greeting}
              </p>
            )}
          </div>

          {/* Mic Error Alert */}
          {micError && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 text-left max-w-md">
              <AlertCircle size={16} className="shrink-0 text-amber-600" />
              <span>{micError}</span>
            </div>
          )}

          {/* Audio Controls Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200/80 w-full text-xs text-slate-600">
            {/* Auto Read Aloud Toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border transition ${
                autoSpeak
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold"
                  : "bg-slate-100 border-slate-200 text-slate-500"
              }`}
            >
              {autoSpeak ? <Volume2 size={14} /> : <VolumeX size={14} />}
              Auto Voice Output: {autoSpeak ? "ON" : "OFF"}
            </button>

            {/* Mute / Unmute Toggle */}
            <button
              onClick={() => {
                if (!isMuted) stopSpeaking();
                setIsMuted(!isMuted);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border transition ${
                isMuted
                  ? "bg-rose-50 border-rose-200 text-rose-700 font-semibold"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {isMuted ? "Muted" : "Sound Enabled"}
            </button>

            {/* Speech Speed */}
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1">
              <span className="text-[11px] text-slate-500 px-1 font-medium">Speed:</span>
              {[
                { label: "0.85x", val: 0.85 },
                { label: "1.0x", val: 1.0 },
                { label: "1.2x", val: 1.2 },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSpeechRate(item.val)}
                  className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
                    speechRate === item.val
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Stop / Cancel Audio button if speaking */}
            {listeningState === "speaking" && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-rose-700 font-semibold hover:bg-rose-100 transition"
              >
                <Square size={13} className="fill-rose-700" />
                Stop Audio
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Quick Voice Prompts & Active Response */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Quick Voice Questions Chips */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Sparkles size={15} className="text-emerald-600" />
                Quick Spoken Queries (त्वरित प्रश्न)
              </div>
              <span className="text-[10px] text-slate-400">Click to ask aloud</span>
            </div>

            <div className="mt-3 space-y-2">
              {VOICE_SAMPLE_QUERIES.map((sample, i) => {
                const queryText = selectedLang.code.startsWith("hi") ? sample.hi : sample.en;
                return (
                  <button
                    key={i}
                    onClick={() => handleProcessQuery(queryText)}
                    className="w-full text-left rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 hover:border-emerald-300 hover:bg-emerald-50/70 transition group flex items-start gap-2.5"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition mt-0.5">
                      <Mic size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                        {sample.category}
                      </span>
                      <p className="text-xs text-slate-700 font-medium group-hover:text-emerald-950 transition line-clamp-2">
                        {queryText}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ICAR Certification Card */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/60 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <CheckCircle2 size={15} className="text-emerald-600" />
              ICAR & e-NAM Verified Voice Intelligence
            </div>
            <p className="mt-1.5 text-xs text-emerald-800/80 leading-relaxed">
              Provides real-time agronomy advisories in native Indian accents with bilingual speech models tuned for rural farmers.
            </p>
          </div>
        </div>
      </div>

      {/* Active Spoken Response Card (if any query processed) */}
      {activeResult && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-sm animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm">
                🎙️
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Your Spoken Question:
                </p>
                <p className="text-sm font-bold text-slate-900">"{activeResult.query}"</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => speakText(activeResult.data.voiceText, selectedLang.code)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-200 transition"
              >
                <Volume2 size={14} />
                Listen Again (दोबारा सुनें)
              </button>

              <button
                onClick={() => copyToClipboard(activeResult.data.text, "active")}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition"
              >
                {copiedId === "active" ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                {copiedId === "active" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Advisory Details */}
          <div className="mt-4 text-sm text-slate-800 whitespace-pre-line leading-relaxed">
            {activeResult.data.text}
          </div>

          {/* Action Link & Tags */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {activeResult.data.tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            {activeResult.data.actionLink && (
              <Link
                to={activeResult.data.actionLink.url}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
              >
                {activeResult.data.actionLink.text}
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Voice Session History */}
      {history.length > 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recent Voice Queries (हाल के पूछे गए प्रश्न)</h3>
            <span className="text-xs text-slate-400">{history.length} spoken queries</span>
          </div>

          <div className="mt-3 divide-y divide-slate-100 space-y-3">
            {history.slice(1).map((item) => (
              <div key={item.id} className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Q: "{item.query}"</span>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                    {item.response.voiceText}
                  </p>
                </div>

                <button
                  onClick={() => speakText(item.response.voiceText, item.langCode)}
                  className="flex items-center gap-1.5 shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <Volume2 size={13} />
                  Listen (सुनें)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
