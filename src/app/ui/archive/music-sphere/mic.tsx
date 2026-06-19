import { useState, useEffect, useRef } from "react";

export default function useMicrophone() {
  const [ready, setReady] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pcmDataRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        audioContextRef.current = new AudioContext();
        const mediaStreamSource = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 128;
        mediaStreamSource.connect(analyserRef.current);
        pcmDataRef.current = new Float32Array(analyserRef.current.fftSize);
        setReady(true);
        startListening();
      })
      .catch((error) => console.error("Microphone access denied:", error));

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const startListening = () => {
    const updateVolume = () => {
      if (!analyserRef.current || !pcmDataRef.current) return;
      analyserRef.current.getFloatTimeDomainData(pcmDataRef.current);
      let sumSquares = 0;
      for (const amplitude of pcmDataRef.current) {
        sumSquares += amplitude * amplitude;
      }
      setVolume(Math.sqrt(sumSquares / pcmDataRef.current.length));
      requestAnimationFrame(updateVolume);
    };
    requestAnimationFrame(updateVolume);
  };

  return { ready, volume };
}
