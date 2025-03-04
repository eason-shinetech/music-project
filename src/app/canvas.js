"use client";

import p5 from "p5";
import { useEffect, useRef, useState } from "react";

export default function Canvas(note) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState([0, 255, 0]);
  const canvasWidth = 800;
  const canvasHeight = 400;

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(canvasWidth, canvasHeight);
        p.clear();
      };
      p.draw = () => {
        p.clear();
        let notePos = 0;
        if (note) {
          notePos = mapNote(note.note);
        }
        p.fill(color);
        p.ellipse(notePos + 75, canvasHeight / 2, 100, 100);
      };
    };
    const mapNote = (currentNode) => {
      const spacing = canvasWidth / 13;
      const notePositions = {
        C: 0 * spacing,
        "C#": 1 * spacing,
        D: 2 * spacing,
        "D#": 3 * spacing,
        E: 4 * spacing,
        F: 5 * spacing,
        "F#": 6 * spacing,
        G: 7 * spacing,
        "G#": 8 * spacing,
        A: 9 * spacing,
        "A#": 10 * spacing,
        B: 11 * spacing,
      };
      return notePositions[currentNode] || 0;
    };
    const canvas = new p5(sketch, canvasRef.current);
    return () => {
      canvas.remove();
    };
  }, [note, color]);

  useEffect(() => {
    if (note) {
      if (["C", "E", "G"].includes(note.note)) {
        setColor([204, 66, 239]);
      } else if (["C#", "E#", "G#"].includes(note.note)) {
        setColor([0, 255, 255]);
      } else if (["D", "F", "A"].includes(note.note)) {
        setColor([0, 0, 204]);
      } else if (["D#", "F#", "A#"].includes(note.note)) {
        setColor([255, 153, 255]);
      }
    }
  }, [note]);

  return <div ref={canvasRef}></div>;
}
