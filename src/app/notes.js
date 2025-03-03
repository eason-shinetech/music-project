"use client";
import { useState } from "react";
import Canvas from "./canvas";
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export default function Notes() {
  const [detectedNote, setDetectedNote] = useState("C");
  return (
    <div>
      <p>Detected Note: {detectedNote}</p>
      <Canvas note={{ note: detectedNote }} />
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
