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
        <div>{"THE WRONG BIENNALE"}</div>
        <div>{"1 NOV 2025 — 31 MAR 2026"}</div>
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

  const formattedText = renderFormattedHTML(text); 

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(formattedText.slice(0, i)); 
      i++;
      if (i > formattedText.length) {
        clearInterval(interval);
        setIsTyping(false);
        onTypingEnd?.();
      }
    }, 30);
    return () => clearInterval(interval);
  }, [formattedText, onTypingEnd]);

  return (
    <div id={`part-${index}`} className="essay-part fade-in">
      <span
        className="line"
        dangerouslySetInnerHTML={{ __html: displayedText }}
      />
      {isTyping && <span className="cursor">█</span>}
    </div>
  );
}


function FrozenParagraph({ text, index }) {
  return (
    <div
      id={`part-${index}`}
      className="essay-part fade-in"
      dangerouslySetInnerHTML={{ __html: renderFormattedHTML(text) }}
    />
  );
}

function renderFormattedHTML(text) {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/__\*\*(.+?)\*\*__/g, "<span class='zigzag'><strong>$1</strong></span>")
    .replace(/__\*(.+?)\*__/g, "<span class='zigzag'><em>$1</em></span>")
    .replace(/__(.+?)__/g, "<span class='zigzag'>$1</span>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br><br>");
}

