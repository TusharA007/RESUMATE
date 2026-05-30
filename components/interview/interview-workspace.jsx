'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Mic, SkipForward, Square, TimerReset } from 'lucide-react';
import { interviewCategories } from '@/lib/mock-ai';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Card } from '@/components/ui/card';
import { CareerAssistantRealtimeAdapter } from '@/src/realtime/interviewRuntime';

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const durations = ['5 min', '10 min', '15 min', '30 min', '1 hour', 'Custom'];
const languages = ['English', 'Hindi'];
const voiceStyles = ['Professional', 'Friendly', 'Strict HR'];

export default function InterviewWorkspace() {
  const [started, setStarted] = useState(false);
  const [config, setConfig] = useState({ category: 'HR Interview', difficulty: 'Intermediate', duration: '10 min', language: 'English', voiceStyle: 'Professional' });
  const [question, setQuestion] = useState('');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [progress, setProgress] = useState(18);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [interviewError, setInterviewError] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [screenEnabled, setScreenEnabled] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const cameraVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const adapterRef = useRef(null);
  const speech = useSpeechRecognition({ lang: config.language === 'Hindi' ? 'hi-IN' : 'en-US', onText: setTranscript });

  useEffect(() => {
    adapterRef.current = new CareerAssistantRealtimeAdapter({
      onEvent: ({ type, payload }) => {
        if (type === 'media.camera.ready') {
          setCameraStream(payload.stream);
          setCameraEnabled(true);
          setMediaError('');
        }
        if (type === 'media.screen.ready') {
          setScreenStream(payload.stream);
          setScreenEnabled(true);
          setMediaError('');
        }
      }
    });

    return () => {
      adapterRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (cameraVideoRef.current && cameraStream) {
      cameraVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  async function startInterview() {
    try {
      setLoadingQuestion(true);
      setInterviewError('');
      const data = await getQuestion();
      setQuestion(data.question);
      setStarted(true);
      speak(data.question);
    } catch (error) {
      setInterviewError(error.message);
    } finally {
      setLoadingQuestion(false);
    }
  }

  async function skipQuestion() {
    try {
      setLoadingQuestion(true);
      setInterviewError('');
      const data = await getQuestion(transcript);
      setQuestion(data.question);
      speech.reset();
      setProgress((value) => Math.min(100, value + 14));
      speak(data.question);
    } catch (error) {
      setInterviewError(error.message);
    } finally {
      setLoadingQuestion(false);
    }
  }

  async function endInterview() {
    try {
      setLoadingFeedback(true);
      setInterviewError('');
      const response = await fetch('/api/interview/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config, transcript, durationSeconds: 600 }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not generate interview feedback.');
      setFeedback(data);
      setProgress(100);
      speech.stop();
    } catch (error) {
      setInterviewError(error.message);
    } finally {
      setLoadingFeedback(false);
    }
  }

  async function getQuestion(previousAnswer = '') {
    const response = await fetch('/api/interview/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, previousAnswer })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not load the next interview question.');
    return data;
  }

  function speak(text) {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      setMediaError('Browser does not support AI voice output. Use Chrome or Edge and allow audio playback.');
      return;
    }

    setMediaError('');
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.language === 'Hindi' ? 'hi-IN' : 'en-US';
    utterance.volume = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
    window.setTimeout(() => {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    }, 250);
  }

  async function enableCamera() {
    try {
      setMediaError('');
      await adapterRef.current?.enableCamera();
    } catch (error) {
      setMediaError(`Camera access failed: ${error?.message ?? 'request denied'}`);
    }
  }

  async function shareScreen() {
    try {
      setMediaError('');
      await adapterRef.current?.shareScreen();
    } catch (error) {
      setMediaError(`Screen share failed: ${error?.message ?? 'request denied'}`);
    }
  }

  function replayQuestion() {
    if (question) {
      speak(question);
    }
  }

  const scoreItems = useMemo(() => feedback ? Object.entries(feedback.scores) : [], [feedback]);

  if (!started) {
    return (
      <Card className="p-6">
        <h1 className="text-3xl font-black text-white">Configure AI Voice Interview</h1>
        <p className="mt-2 text-slate-400">Choose any role type, including HR, CA, finance, government, communication, or technical interviews.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Select label="Category" value={config.category} options={interviewCategories} onChange={(category) => setConfig({ ...config, category })} />
          <Select label="Difficulty" value={config.difficulty} options={difficulties} onChange={(difficulty) => setConfig({ ...config, difficulty })} />
          <Select label="Duration" value={config.duration} options={durations} onChange={(duration) => setConfig({ ...config, duration })} />
          <Select label="Language" value={config.language} options={languages} onChange={(language) => setConfig({ ...config, language })} />
          <Select label="Voice style" value={config.voiceStyle} options={voiceStyles} onChange={(voiceStyle) => setConfig({ ...config, voiceStyle })} />
        </div>
        <button className="mt-8 min-h-12 rounded-2xl bg-[linear-gradient(135deg,#2f8cff,#8b31f4)] px-6 font-black text-white disabled:opacity-60" onClick={startInterview} disabled={loadingQuestion}>{loadingQuestion ? 'Loading...' : 'Start Interview'}</button>
        {interviewError ? <p className="mt-4 text-sm text-rose-300">{interviewError}</p> : null}
      </Card>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr_0.8fr]">
      <Card className="grid place-items-center p-6 text-center">
        <AIOrb />
        <h1 className="mt-4 text-2xl font-black text-white">AI Interviewer</h1>
        <p className="mt-2 text-slate-400">{config.category} · {config.difficulty}</p>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-bold text-cyan-200"><TimerReset size={16} /> {config.duration}</span>
          <button className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 font-bold text-red-200 disabled:opacity-60" onClick={endInterview} disabled={loadingFeedback}>{loadingFeedback ? 'Saving...' : 'End Interview'}</button>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[linear-gradient(90deg,#4f46e5,#06b6d4)]" style={{ width: `${progress}%` }} /></div>
        <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-xl font-black text-white">{question}</div>
        <Waveform active={speech.listening} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button className="min-h-11 rounded-xl bg-white/[0.06] font-bold text-white" onClick={speech.listening ? speech.stop : speech.start}>{speech.listening ? <Square className="mx-auto" /> : <Mic className="mx-auto" />}</button>
          <button className="min-h-11 rounded-xl bg-white/[0.06] font-bold text-white" onClick={replayQuestion}>Play Question</button>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white">Practice Camera & Screen</h3>
              <p className="mt-1 text-sm text-slate-400">Use your camera or screen while you answer questions.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button className="min-h-11 rounded-xl bg-[linear-gradient(135deg,#2f8cff,#8b31f4)] px-4 font-bold text-white" onClick={enableCamera}>Enable Camera</button>
            <button className="min-h-11 rounded-xl bg-[linear-gradient(135deg,#0ea5e9,#22c55e)] px-4 font-bold text-white" onClick={shareScreen}>Share Screen</button>
          </div>
          {mediaError ? <p className="mt-3 text-sm text-rose-300">{mediaError}</p> : null}
          <div className="mt-4 grid gap-3">
            {cameraEnabled ? <video ref={cameraVideoRef} autoPlay muted playsInline className="h-40 w-full rounded-2xl border border-white/10 bg-black object-cover" /> : null}
            {screenEnabled ? <video ref={screenVideoRef} autoPlay muted playsInline className="h-40 w-full rounded-2xl border border-white/10 bg-black object-cover" /> : null}
          </div>
        </div>
        <textarea className="mt-4 min-h-40 w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-slate-100 outline-none" value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder="Real-time transcript..." />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <button className="min-h-11 rounded-xl bg-white/[0.06] font-bold text-white" onClick={speech.listening ? speech.stop : speech.start}>{speech.listening ? <Square className="mx-auto" /> : <Mic className="mx-auto" />}</button>
          <button className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 font-bold text-white disabled:opacity-60" onClick={skipQuestion} disabled={loadingQuestion}><SkipForward size={16} /> {loadingQuestion ? 'Loading...' : 'Skip'}</button>
          <button className="min-h-11 rounded-xl bg-[linear-gradient(135deg,#2f8cff,#8b31f4)] font-bold text-white disabled:opacity-60" onClick={endInterview} disabled={loadingFeedback}>{loadingFeedback ? 'Generating...' : 'Get Feedback'}</button>
        </div>
        {speech.error ? <p className="mt-3 text-sm text-rose-300">{speech.error}</p> : null}
        {interviewError ? <p className="mt-3 text-sm text-rose-300">{interviewError}</p> : null}
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-black text-white">AI Feedback</h2>
        {feedback ? (
          <div className="mt-5 grid gap-4">
            {scoreItems.map(([label, value]) => <Metric label={label} value={value} key={label} />)}
            <p className="rounded-2xl bg-white/[0.04] p-4 text-sm text-slate-300">{feedback.summary}</p>
          </div>
        ) : <p className="mt-4 text-slate-400">Scores appear after ending the interview.</p>}
      </Card>
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-300">
      {label}
      <select className="min-h-12 rounded-2xl border border-white/10 bg-[#07111f] px-4 text-white outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function AIOrb() {
  return <motion.div className="grid h-36 w-36 place-items-center rounded-full bg-[radial-gradient(circle,#8b5cf6,#312e81_62%,#020617)] shadow-[0_0_60px_rgba(124,58,237,0.75)]" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: 3, duration: 2.5, repeatType: 'loop' }}><BrainCircuit className="text-white" size={44} /></motion.div>;
}

function Waveform({ active }) {
  return <div className="mt-5 flex h-20 items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04]">{Array.from({ length: 36 }).map((_, i) => <motion.span className="w-1 rounded-full bg-cyan-300" animate={{ height: active ? [10, 42 + (i % 6) * 5, 14] : 12 }} transition={active ? { repeat: Infinity, duration: 1.1, delay: i * 0.025 } : { duration: 0.3 }} key={i} />)}</div>;
}

function Metric({ label, value }) {
  return <div><div className="mb-2 flex justify-between text-sm capitalize"><span className="text-slate-300">{label}</span><b className="text-cyan-200">{value}%</b></div><div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-[linear-gradient(90deg,#4f46e5,#06b6d4)]" style={{ width: `${value}%` }} /></div></div>;
}
