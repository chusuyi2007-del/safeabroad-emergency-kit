"use client";

import { useState } from "react";
import { Mic, Square } from "lucide-react";

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  0: SpeechRecognitionResultItem;
  isFinal: boolean;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

export function VoiceInputButton({
  onText,
  language = "zh-CN",
  compact = false
}: {
  onText: (text: string) => void;
  language?: string;
  compact?: boolean;
}) {
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null);
  const [listening, setListening] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  function start() {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setUnsupported(true);
      return;
    }

    const next = new Recognition();
    next.lang = language;
    next.interimResults = false;
    next.continuous = false;
    next.onresult = (event) => {
      let text = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        text += event.results[index][0].transcript;
      }
      if (text.trim()) onText(text.trim());
    };
    next.onend = () => {
      setListening(false);
      setRecognition(null);
    };
    next.onerror = () => {
      setListening(false);
      setRecognition(null);
    };

    setRecognition(next);
    setListening(true);
    next.start();
  }

  function stop() {
    recognition?.stop();
    setListening(false);
  }

  if (unsupported) {
    return <p className="mt-2 text-xs text-gray-500">当前浏览器不支持语音输入。</p>;
  }

  return (
    <button
      className={`mt-2 inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-calm hover:bg-mist ${
        compact ? "min-h-9" : "min-h-10"
      }`}
      onClick={listening ? stop : start}
      type="button"
    >
      {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {listening ? "停止录音" : "语音输入"}
    </button>
  );
}
