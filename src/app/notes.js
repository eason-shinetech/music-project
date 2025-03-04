"use client";
import { useEffect, useState } from "react";
import pitchDetection from "./utils/pitchDetection";
import dynamic from "next/dynamic";
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const Canvas = dynamic(() => import("./canvas"), { ssr: !!false });
let audioContext, stream, pitch;
export default function Notes() {
  const [detectedNote, setDetectedNote] = useState("C");
  useEffect(() => {
    const setup = async () => {
      audioContext = new AudioContext();
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      startPitch(stream, audioContext);
    };
    setup();
  }, []);

  const startPitch = (stream, audioContext) => {
    // this uses audio context to detect the current pitch as defined by the model
    startAudioContext();
    if (audioContext) {
      console.log("pitchDetection");
      pitch = pitchDetection("./model/", audioContext, stream, () => {
        getPitch();
      });
    } else {
      console.log("AudioContext or microphone not available");
    }
  };

  const getPitch = () => {
    // get the pitch from the ml5 model
    pitch.getPitch((err, freq) => {
      if (err) {
        console.error("pitch.getPitch:", err);
        return;
      }
      if (freq) {
        const midi = freqToMidi(freq);
        const note = notes[midi % 12];
        console.log("note: ", note);
        setDetectedNote(note);
      }
      getPitch();
    });
  };

  return (
    <div>
      <p>Detected Note: {detectedNote}</p>
      <Canvas note={detectedNote} />
    </div>
  );
}

function startAudioContext() {
  if (audioContext) audioContext.resume();
  else {
    audioContext = new (window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext)();
  }
}

function freqToMidi(f) {
  const mathlog2 = Math.log(f / 440) / Math.log(2); // Base frequency should be 440Hz
  const m = 69 + Math.round(12 * mathlog2); // 69 = MIDI note number for A4 (440Hz)
  return m;
}
