import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logoUrl from "/logo.png";
import MenuOverlay from "../../components/menuoverlay";
import { essayParts } from "./LhpgPageContent";
import "./LhpgPage.css";

export default function LhpgPage() {
  const navigate = useNavigate();

  return (
    <div className="sk-page">
      <button className="sk-brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="sk-menu">
        <MenuOverlay />
      </div>

      <div className="sk-stage" style={{ height: `auto` }}>
        <EssayTypewriter />
      </div>

      <div className="sk-bl">
        <div>{"THE WRONG BIANELLE"}</div>
        <div>{"1 NOV 2025 — XX XX 2026"}</div>
      </div>

      <div className="sk-br">
        <div>{"lhpg"}</div>
        <div>
          {
            "Diary of a self-proclaimed Schizo-approximating person or just another casual conversation with her muses"
          }
        </div>
      </div>
    </div>
  );
}

// ---------------- TYPEWRITER COMPONENT ----------------

function EssayTypewriter() {
  const [visibleParts, setVisibleParts] = useState([0]);
  const [doneParts, setDoneParts] = useState([]);
  const observerRef = useRef(null);
  const endRef = useRef(null);

  const handleTypingEnd = useCallback((index) => {
    setDoneParts((prev) => (prev.includes(index) ? prev : [...prev, index]));
  }, []);

  useEffect(() => {
  if (!endRef.current) return;
  if (observerRef.current) observerRef.current.disconnect();

  let timer = null;
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && doneParts.includes(visibleParts.at(-1))) {
        timer = setTimeout(() => {
          setVisibleParts((prev) => {
            if (prev.length < essayParts.length) {
              return [...prev, prev.length];
            }
            return prev;
          });
        }, 5000);
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(endRef.current);
  observerRef.current = observer;

  return () => {
    observer.disconnect();
    if (timer) clearTimeout(timer);
  };
}, [doneParts, visibleParts]);

  return (
    <div className="essay-container">
      {visibleParts.map((i) =>
        doneParts.includes(i) ? (
          <FrozenParagraph key={i} text={essayParts[i]} index={i} />
        ) : (
          <TypewriterParagraph
            key={i}
            text={essayParts[i]}
            index={i}
            onTypingEnd={() => handleTypingEnd(i)}
          />
        )
      )}

      <div ref={endRef} style={{ height: "2px", marginTop: "100px" }} />
    </div>
  );
}

function TypewriterParagraph({ text, index, onTypingEnd }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsTyping(false);
        onTypingEnd?.();
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text, onTypingEnd]);

  return (
    <div id={`part-${index}`} className="essay-part fade-in">
      {renderFormattedText(displayedText)}
      {isTyping && <span className="cursor">█</span>}
    </div>
  );
}

function FrozenParagraph({ text, index }) {
  return (
    <div id={`part-${index}`} className="essay-part fade-in">
      {renderFormattedText(text)}
    </div>
  );
}

function renderFormattedText(text) {
  const lines = text.split("\n");
  const formatText = (line) =>
    line
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/__\*\*(.+?)\*\*__/g, "<u><strong>$1</strong></u>")
      .replace(/__\*(.+?)\*__/g, "<u><em>$1</em></u>")
      .replace(/__(.+?)__/g, "<u>$1</u>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

  return lines.map((line, i) => (
    <p
      key={i}
      className="line"
      dangerouslySetInnerHTML={{ __html: formatText(line) }}
    />
  ));
}

