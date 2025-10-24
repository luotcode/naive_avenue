import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./menuoverlay.css";

export default function MenuOverlay() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const ref = useRef(null);

  useEffect(() => setOpen(false), [loc.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="menu-wrap" ref={ref}>
    <button
        className={`menu-btn ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
    >
        MENU
    </button>

    <div className={`menu-panel ${open ? "show" : ""}`} role="menu">
        <button className="menu-item" role="menuitem" onClick={() => nav("/")}>
        HOME
        </button>
        <button
        className="menu-item"
        role="menuitem"
        onClick={() => nav("/about")}
        >
        ABOUT
        </button>
    </div>
    </div>
  );
}
