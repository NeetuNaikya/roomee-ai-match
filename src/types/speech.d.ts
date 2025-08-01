// TypeScript global types for browser SpeechRecognition API
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onaudioend: ((ev: Event) => any) | null;
  onaudiostart: ((ev: Event) => any) | null;
  onend: ((ev: Event) => any) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((ev: Event) => any) | null;
  onresult: ((ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((ev: Event) => any) | null;
  onsoundstart: ((ev: Event) => any) | null;
  onspeechend: ((ev: Event) => any) | null;
  onspeechstart: ((ev: Event) => any) | null;
  onstart: ((ev: Event) => any) | null;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};
declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
