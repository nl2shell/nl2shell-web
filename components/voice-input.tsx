"use client";

import { useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { AudioVisualizer } from "@/components/audio-visualizer";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    start,
    stop,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscriptRef.current(transcript);
    }
  }, [transcript]);

  if (!isSupported) {
    return (
      <p className="text-xs text-muted-foreground">
        Voice input requires Chrome or Edge.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="lg"
        onClick={isListening ? stop : start}
        disabled={disabled}
        className="relative"
        aria-pressed={isListening}
        aria-label={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? (
          <>
            <MicOff className="mr-2 size-4" />
            Stop
          </>
        ) : (
          <>
            <Mic className="mr-2 size-4" />
            Speak
          </>
        )}
      </Button>

      {isListening && <AudioVisualizer />}

      {interimTranscript && (
        <span className="text-sm text-muted-foreground italic animate-pulse" aria-live="polite">
          {interimTranscript}
        </span>
      )}
    </div>
  );
}

