'use client';

import { useRef, useState } from 'react';

export function useSpeechRecognition({ lang = 'en-US', onText } = {}) {
  const recognitionRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);
  const finalTranscriptRef = useRef('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');

  function start() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (listening) return;

    shouldKeepListeningRef.current = true;
    setError('');

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalTranscriptRef.current = `${finalTranscriptRef.current} ${transcript}`.trim();
        } else {
          interimTranscript += transcript;
        }
      }

      onText?.(`${finalTranscriptRef.current} ${interimTranscript}`.trim());
    };
    recognition.onend = () => {
      if (shouldKeepListeningRef.current) {
        try {
          recognition.start();
          setListening(true);
        } catch {
          shouldKeepListeningRef.current = false;
          setListening(false);
        }
      } else {
        setListening(false);
      }
    };
    recognition.onerror = (event) => {
      setError(`Microphone error: ${event?.error || 'listening stopped'}`);
      shouldKeepListeningRef.current = false;
      setListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function stop() {
    shouldKeepListeningRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
  }

  function reset() {
    finalTranscriptRef.current = '';
    onText?.('');
  }

  return { listening, error, start, stop, reset };
}
