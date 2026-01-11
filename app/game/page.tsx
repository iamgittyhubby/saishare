"use client";

import { useEffect, useMemo, useState } from "react";

const PHRASES = [
  "it depends",
  "we will see",
  "for now",
  "in the end",
  "it makes sense",
  "sooner or later",
  "time will tell",
  "it is what it is",
  "nothing really changes",
  "that’s how it goes",
  "at some point",
  "we’ll figure it out",
  "one thing at a time",
  "this will pass",
  "it felt right",
  "it didn’t matter",
  "it came naturally",
  "things happen",
  "that was enough",
  "nothing lasts forever",
  "it could be worse",
  "it worked out",
  "that’s the point",
  "it made sense then",
  "that’s all there is",
  "there’s no rush",
  "what matters most",
  "it went nowhere",
  "it didn’t last",
  "that’s all for now",
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function GamePage() {
  const phrase = useMemo(() => {
    return PHRASES[Math.floor(Math.random() * PHRASES.length)];
  }, []);

  const target = phrase.toUpperCase();
  const uniqueLetters = useMemo(
    () => new Set(target.replace(/[^A-Z]/g, "").split("")),
    [target]
  );

  const [lives, setLives] = useState(6);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [solveValue, setSolveValue] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function loseLife() {
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setGameOver(true);
        setWon(false);
      }
      return next;
    });
  }

  function checkWin(next: Set<string>) {
    for (const l of uniqueLetters) {
      if (!next.has(l)) return false;
    }
    return true;
  }

  function handleLetter(letter: string) {
    if (gameOver || used.has(letter)) return;

    const nextUsed = new Set(used);
    nextUsed.add(letter);
    setUsed(nextUsed);

    if (uniqueLetters.has(letter)) {
      const nextRevealed = new Set(revealed);
      nextRevealed.add(letter);
      setRevealed(nextRevealed);

      if (checkWin(nextRevealed)) {
        setGameOver(true);
        setWon(true);
      }
    } else {
      loseLife();
    }
  }

  function handleSolve() {
    if (gameOver) return;
    if (!solveValue.trim()) return;

    if (normalize(solveValue) === normalize(phrase)) {
      setGameOver(true);
      setWon(true);
      setRevealed(new Set(uniqueLetters));
    } else {
      setSolveValue("");
      loseLife();
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (gameOver) return;
      const active = document.activeElement?.tagName?.toLowerCase();
      if (active === "input") return;

      const k = e.key.toUpperCase();
      if (/^[A-Z]$/.test(k)) handleLetter(k);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameOver, used, revealed, uniqueLetters]);

  return (
    <main className="page" style={{ paddingTop: "12vh" }}>
      <div style={{ position: "relative", width: "100%", maxWidth: 540 }}>
        {/* Lives */}
        <div
          style={{
            position: "fixed",
            left: "calc(50% + 270px + 28px)",
            top: "12vh",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: i >= lives ? "#d4d4d4" : "#1a1a1a",
              }}
            />
          ))}
        </div>

        {/* Hint */}
        <div
          style={{
            textAlign: "center",
            color: "#777",
            marginBottom: "1.25rem",
          }}
        >
          Common phrase
        </div>

        {/* Phrase */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          {phrase.split(" ").map((word, wi) => (
            <span key={wi} style={{ margin: "0 0.6em", display: "inline-block" }}>
              {word.split("").map((ch, ci) => {
                const up = ch.toUpperCase();
                const show = !/[A-Z]/.test(up) || revealed.has(up) || gameOver;
                return (
                  <span
                    key={ci}
                    style={{
                      fontSize: "1.75rem",
                      letterSpacing: "0.08em",
                      minWidth: "0.9em",
                      display: "inline-block",
                    }}
                  >
                    {show ? ch : "_"}
                  </span>
                );
              })}
            </span>
          ))}
        </div>

        {/* Alphabet */}
        {!gameOver && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.2em",
              marginBottom: "3rem",
            }}
          >
            {ALPHABET.map((l) => (
              <button
                key={l}
                disabled={used.has(l)}
                onClick={() => handleLetter(l)}
                style={{
                  font: "inherit",
                  color: "inherit",
                  width: "2em",
                  height: "2em",
                  background: "transparent",
                  border: "none",
                  cursor: used.has(l) ? "default" : "pointer",
                  opacity: used.has(l) && uniqueLetters.has(l) ? 0.3 : 1,
                  textDecoration:
                    used.has(l) && !uniqueLetters.has(l)
                      ? "line-through"
                      : "none",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Solve */}
        {!gameOver && (
          <div style={{ textAlign: "center" }}>
            <input
              value={solveValue}
              onChange={(e) => setSolveValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSolve()}
              placeholder="Solve"
              style={{
                font: "inherit",
                color: "inherit",
                border: "none",
                borderBottom: "1px solid #d4d4d4",
                background: "transparent",
                textAlign: "center",
                fontStyle: "italic",
                outline: "none",
                width: 240,
                padding: "0.5em 0",
              }}
            />
          </div>
        )}

        {/* End */}
        {gameOver && (
          <div style={{ textAlign: "center", marginTop: "3rem", color: "#666" }}>
            {won ? (
              <>
                Solved.
                <br />
                <a href="/game" style={{ color: "#999", textDecoration: "none" }}>
                  Try another
                </a>
              </>
            ) : (
              <>
                The phrase was:{" "}
                <span style={{ fontStyle: "italic", color: "inherit" }}>
                  {phrase}
                </span>
                <br />
                <a href="/game" style={{ color: "#999", textDecoration: "none" }}>
                  Try another
                </a>
              </>
            )}
          </div>
        )}

        {/* Essay */}
        <div style={{ marginTop: "6rem" }}>
          <h2>Why I built this</h2>
          <p>
            I built this game for two reasons. First, I wanted to challenge myself to
            build a game. Second, I wanted to build something fun.
          </p>
          <p>
            Growing up, I loved word games like Hangman, Scribble, and Wheel of Fortune.
            They were simple, but they held your attention. With that in mind, I set out
            to build something that combined elements of all three.
          </p>

          <h2>How I built it</h2>
          <p>
            I started with the end in mind. Before writing any code, I was clear about
            how the game should feel: simple, quiet, and slightly uncomfortable.
          </p>
          <p>
            I used AI as part of the process, but not as the source of the idea. I used
            ChatGPT as a brainstorming partner to help organize my thinking. Once the
            idea was clear, I used Claude to build a quick visual demo so I could see how
            the game might look and feel. After that, I came back to ChatGPT to help
            implement the game step by step.
          </p>

          <h2>Key takeaways</h2>
          <p>
            <strong>1. Start simple.</strong> When you try to build something, it’s easy
            to add more than you need. Going back to the core and removing unnecessary
            pieces made the game stronger.
          </p>
          <p>
            <strong>2. Don’t lose momentum.</strong> The moment you have an idea is when
            your energy is highest. Building quickly while that excitement is still
            there helps carry the project forward.
          </p>
          <p>
            <strong>3. Be clear about your vision.</strong> I like to work backwards,
            starting with the end experience in mind. When the goal is clear, decisions
            along the way become easier.
          </p>
          <p>
            <strong>4. AI is a tool, not a replacement.</strong> AI works best when it
            helps execute a clear vision. It doesn’t replace judgment. It amplifies it.
            The direction still has to come from you.
          </p>
        </div>
      </div>
    </main>
  );
}