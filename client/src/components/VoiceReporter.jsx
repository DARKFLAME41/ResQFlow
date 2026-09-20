import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle } from 'lucide-react';

export const VoiceReporter = ({ onVoiceTranscript, initialTranscript = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialTranscript);
  const [errorMsg, setErrorMsg] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setErrorMsg('Browser Speech-to-Text API is unavailable. Please type your emergency description or select a demo voice phrase.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (onVoiceTranscript) onVoiceTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access denied. Please allow microphone permissions or use text mode below.');
        } else {
          setErrorMsg(`Voice input warning (${event.error}). You can type your voice message directly below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setErrorMsg('Failed to initialize microphone. Please type your emergency report below.');
    }
  };


  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-rose-500 animate-pulse" />
          <h3 className="font-bold text-slate-100 text-sm">Voice Emergency Reporting</h3>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          Speech-to-Text AI
        </span>
      </div>

      {/* Main Mic Action Button */}
      <div className="flex flex-col items-center justify-center py-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <button
          type="button"
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform shadow-2xl ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-900/50 scale-110'
              : 'bg-rose-950/80 hover:bg-rose-600 text-rose-400 hover:text-white border-2 border-rose-600/40 hover:scale-105'
          }`}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <p className="mt-3 text-xs font-bold text-slate-300">
          {isListening ? '🎙️ Listening... Speak naturally now' : 'Click to 🎙️ Speak Emergency'}
        </p>
      </div>

      {/* Permission Fallback Error Notice */}
      {errorMsg && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg flex items-start space-x-2 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Transcript Textbox with editability */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          Transcribed Speech Output (Editable):
        </label>
        <textarea
          rows={3}
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            if (onVoiceTranscript) onVoiceTranscript(e.target.value);
          }}
          placeholder="Your spoken message will transcribe here automatically. You can also type or edit details..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
      </div>

    </div>
  );
};

export default VoiceReporter;
