import { useEffect, useMemo, useState } from "react";
import {
  Palette, Sparkles, Copy, Shuffle, Heart, Download, Search,
  Plus, Trash2, Check, Lock, Unlock, X
} from "lucide-react";

const starterPalettes = [
  { id: "coastal", name: "Coastal Morning", tags: "Calm · Nature", colors: ["#16324F", "#2F6690", "#3A7CA5", "#D9DCD6", "#F4EBD0"] },
  { id: "peach", name: "Peach Please", tags: "Warm · Playful", colors: ["#6D2E46", "#A26769", "#D5B9B2", "#ECE2D0", "#FEDCC8"] },
  { id: "garden", name: "Garden Party", tags: "Nature · Fresh", colors: ["#386641", "#6A994E", "#A7C957", "#F2E8CF", "#BC4749"] },
  { id: "night", name: "After Hours", tags: "Bold · Modern", colors: ["#22223B", "#4A4E69", "#9A8C98", "#C9ADA7", "#F2E9E4"] },
  { id: "citrus", name: "Citrus Club", tags: "Bright · Summer", colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"] },
  { id: "lavender", name: "Lavender Haze", tags: "Soft · Dreamy", colors: ["#463F8C", "#7B72B9", "#B7B1D8", "#E5DFF2", "#F7EDE2"] }
];

const randomHex = () =>
  "#" + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, "0").toUpperCase();

function getSavedPalettes() {
  try {
    const value = JSON.parse(localStorage.getItem("paletteplay-saved") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function App() {
  const [colors, setColors] = useState(["#5B5FEF", "#A5A6F6", "#D9D9F3", "#F4B860", "#E76F51"]);
  const [paletteName, setPaletteName] = useState("My new palette");
  const [savedPalettes, setSavedPalettes] = useState(getSavedPalettes);
  const [lockedColors, setLockedColors] = useState([]);
  const [activePage, setActivePage] = useState("studio");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("paletteplay-saved", JSON.stringify(savedPalettes));
    } catch {
      // The app still works if browser storage is unavailable.
    }
  }, [savedPalettes]);

  const allPalettes = useMemo(
    () => [...starterPalettes, ...savedPalettes],
    [savedPalettes]
  );

  const filteredPalettes = allPalettes.filter((palette) =>
    `${palette.name} ${palette.tags || ""} ${palette.colors.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2000);
  }

  async function copyColor(color, key) {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 1200);
      showToast(`Copied ${color}`);
    } catch {
      showToast(`Clipboard blocked. Copy manually: ${color}`);
    }
  }

  function shuffleColors() {
    setColors((current) =>
      current.map((color, index) =>
        lockedColors.includes(index) ? color : randomHex()
      )
    );
  }

  function updateColor(index, value) {
    setColors((current) =>
      current.map((color, i) => (i === index ? value.toUpperCase() : color))
    );
  }

  function toggleLock(index) {
    setLockedColors((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  }

  function savePalette() {
    const palette = {
      id: Date.now(),
      name: paletteName.trim() || "Untitled palette",
      tags: "Custom",
      colors: [...colors]
    };
    setSavedPalettes((current) => [palette, ...current]);
    setActivePage("saved");
    showToast("Palette saved to your collection");
  }

  function loadPalette(palette) {
    setColors([...palette.colors]);
    setPaletteName(palette.name);
    setLockedColors([]);
    setActivePage("studio");
    showToast(`Loaded ${palette.name}`);
  }

  function deletePalette(id) {
    setSavedPalettes((current) => current.filter((palette) => palette.id !== id));
  }

  function exportCss() {
    const css = `:root {\n${colors
      .map((color, index) => `  --color-${index + 1}: ${color};`)
      .join("\n")}\n}\n`;
    const blob = new Blob([css], { type: "text/css;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(paletteName || "palette")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}.css`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("CSS variables exported");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" onClick={() => setActivePage("studio")}>
          <span className="brand-mark"><Palette size={21} /></span>
          <span>
            palette<span className="brand-accent">play</span>
            <small>COLOR STUDIO</small>
          </span>
        </a>

        <div className="side-label">WORKSPACE</div>
        <button className={`nav-item ${activePage === "studio" ? "active" : ""}`} onClick={() => setActivePage("studio")}>
          <span>◈</span> Color studio
        </button>
        <button className={`nav-item ${activePage === "explore" ? "active" : ""}`} onClick={() => setActivePage("explore")}>
          <span>▦</span> Explore palettes
        </button>
        <button className={`nav-item ${activePage === "saved" ? "active" : ""}`} onClick={() => setActivePage("saved")}>
          <Heart size={16} /> My collection <span className="count">{savedPalettes.length}</span>
        </button>

        <div className="sidebar-bottom">
          <div className="mini-art">
            {["#16324F", "#3A7CA5", "#D9DCD6", "#F4B860", "#E76F51"].map((color) =>
              <i key={color} style={{ background: color }} />
            )}
          </div>
          <p className="side-note">Good colors make good ideas feel even better.</p>
          <span className="version">PALETTEPLAY · 1.0</span>
        </div>
      </aside>

      <main className="main-area" id="top">
        <header className="topbar">
          <div className="crumb">
            Workspace <span>/</span>
            <strong>{activePage === "studio" ? "Color studio" : activePage === "saved" ? "My collection" : "Explore palettes"}</strong>
          </div>
          <div className="top-actions"><i className="status-dot" /> Your creative space <b className="avatar">P</b></div>
        </header>

        {activePage === "studio" && (
          <section className="page-content">
            <div className="eyebrow"><Sparkles size={14} /> YOUR COLOR PLAYGROUND</div>
            <div className="page-heading">
              <div>
                <h1>Make room for<br /><em>colorful ideas.</em></h1>
                <p>Build a palette, try a new mood, and take your colors anywhere.</p>
              </div>
              <div className="sticker">✳<small>MAKE<br />IT POP</small></div>
            </div>

            <section className="palette-card">
              <div className="card-topline">
                <div>
                  <span className="tiny-label">CURRENT PALETTE</span>
                  <input className="palette-title" value={paletteName} onChange={(event) => setPaletteName(event.target.value)} aria-label="Palette name" />
                </div>
                <span className="color-count">{colors.length} COLORS</span>
              </div>

              <div className="swatches">
                {colors.map((color, index) => (
                  <div className="swatch-column" key={index}>
                    <button
                      className="swatch"
                      style={{ backgroundColor: color, color: getReadableTextColor(color) }}
                      onClick={() => copyColor(color, `swatch-${index}`)}
                      title={`Copy ${color}`}
                    >
                      {copied === `swatch-${index}` ? <Check size={18} /> : <Copy size={17} />}
                      <span>{copied === `swatch-${index}` ? "Copied" : "Copy"}</span>
                    </button>
                    <div className="swatch-meta">
                      <input type="color" value={color} onChange={(event) => updateColor(index, event.target.value)} aria-label={`Choose color ${index + 1}`} />
                      <input
                        className="hex-input"
                        value={color}
                        maxLength={7}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (/^#[0-9a-fA-F]{6}$/.test(value)) updateColor(index, value);
                        }}
                        aria-label={`Hex code ${index + 1}`}
                      />
                      <button className={`lock-btn ${lockedColors.includes(index) ? "locked" : ""}`} onClick={() => toggleLock(index)} title={lockedColors.includes(index) ? "Unlock color" : "Lock color"}>
                        {lockedColors.includes(index) ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="palette-actions">
                <span className="helper-text">Tip: lock a color to keep it while you shuffle the rest.</span>
                <div className="action-group">
                  <button className="btn btn-light" onClick={shuffleColors}><Shuffle size={16} /> Shuffle colors</button>
                  <button className="btn btn-primary" onClick={savePalette}><Heart size={16} /> Save palette</button>
                </div>
              </div>
            </section>

            <div className="below-grid">
              <section className="preview-panel">
                <div className="section-heading">
                  <div><span className="tiny-label">LIVE PREVIEW</span><h2>See it in action</h2></div>
                  <span className="preview-badge">AUTO-UPDATING</span>
                </div>
                <div className="mock-site" style={{ "--p1": colors[0], "--p2": colors[1], "--p3": colors[2], "--p4": colors[3], "--p5": colors[4] }}>
                  <div className="mock-nav"><b className="mock-logo">bloom.</b><span>Our story&nbsp;&nbsp; Shop&nbsp;&nbsp; Journal</span><button>Say hello ↗</button></div>
                  <div className="mock-hero">
                    <div><small>A LITTLE MORE COLOR</small><h3>Find your<br />happy place.</h3><p>Thoughtful things for slower days and brighter living.</p><button>Explore the collection</button></div>
                    <div className="mock-shapes"><i /><i /><i /></div>
                  </div>
                  <div className="mock-footer"><span>Made for everyday magic</span><span>✳ ✳ ✳</span></div>
                </div>
              </section>

              <section className="export-panel">
                <span className="tiny-label">READY TO USE</span>
                <h2>Take your colors<br />with you.</h2>
                <p>Export your palette as CSS variables and drop it into your next web project.</p>
                <div className="code-preview">
                  <span>/* your palette */</span><br />:root {"{"}
                  {colors.slice(0, 3).map((color, index) => (
                    <span className="code-line" key={index}>--color-{index + 1}: <b style={{ color }}>{color.toLowerCase()}</b>;</span>
                  ))}
                  <span className="code-line">...</span>
                  {"}"}
                </div>
                <button className="btn btn-primary export-btn" onClick={exportCss}><Download size={16} /> Export CSS variables</button>
              </section>
            </div>
          </section>
        )}

        {activePage === "explore" && (
          <section className="page-content">
            <div className="eyebrow"><Sparkles size={14} /> A LITTLE COLOR INSPIRATION</div>
            <div className="page-heading">
              <div><h1>Find your next<br /><em>favorite feeling.</em></h1><p>Explore palettes made for moods, moments, and things you're dreaming up.</p></div>
              <div className="sticker explore-sticker">COLOR<small>OUTSIDE<br />THE LINES</small></div>
            </div>
            <div className="search-row">
              <div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search palettes, moods, colors..." /></div>
              <span className="result-count">{filteredPalettes.length} palettes</span>
            </div>
            <div className="palette-gallery">
              {filteredPalettes.map((palette) => <PaletteCard key={palette.id} palette={palette} onLoad={loadPalette} onCopy={copyColor} />)}
            </div>
            {filteredPalettes.length === 0 && <EmptyState onCreate={() => setActivePage("studio")} />}
            <div className="bottom-banner">
              <div className="banner-icon">✳</div><div><h3>Your taste. Your rules.</h3><p>There are no wrong colors—only colors you haven't tried together yet.</p></div>
              <button className="btn btn-dark" onClick={() => setActivePage("studio")}>Start creating ↗</button>
            </div>
          </section>
        )}

        {activePage === "saved" && (
          <section className="page-content">
            <div className="eyebrow"><Heart size={14} /> YOUR PERSONAL COLOR LIBRARY</div>
            <div className="page-heading">
              <div><h1>Colors worth<br /><em>keeping close.</em></h1><p>Your saved palettes live here, ready for the next idea.</p></div>
              <button className="btn btn-primary" onClick={() => setActivePage("studio")}><Plus size={16} /> New palette</button>
            </div>
            {savedPalettes.length > 0 ? (
              <div className="palette-gallery">
                {savedPalettes.map((palette) => (
                  <PaletteCard key={palette.id} palette={palette} onLoad={loadPalette} onCopy={copyColor} onDelete={() => deletePalette(palette.id)} />
                ))}
              </div>
            ) : <EmptyState onCreate={() => setActivePage("studio")} />}
          </section>
        )}

        <footer className="footer"><span>© 2026 PalettePlay Studio</span><span>Made with curiosity <b>✳</b></span></footer>
      </main>

      {toast && <div className="toast"><Check size={16} /> {toast}<button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={14} /></button></div>}
    </div>
  );
}

function getReadableTextColor(hex) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 155 ? "#17212B" : "#FFFFFF";
}

function PaletteCard({ palette, onLoad, onCopy, onDelete }) {
  return (
    <article className="gallery-card">
      <div className="gallery-colors">
        {palette.colors.map((color, index) => (
          <button key={index} style={{ background: color }} title={`Copy ${color}`} onClick={() => onCopy(color, `${palette.id}-${index}`)} />
        ))}
      </div>
      <div className="gallery-info">
        <div><h3>{palette.name}</h3><p>{palette.tags || "Custom"}</p></div>
        {onDelete ? (
          <button className="delete-btn" onClick={onDelete} aria-label={`Delete ${palette.name}`}><Trash2 size={15} /></button>
        ) : (
          <button className="round-arrow" onClick={() => onLoad(palette)} aria-label={`Open ${palette.name}`}>↗</button>
        )}
      </div>
      <button className="text-link" onClick={() => onLoad(palette)}>Open in studio <span>→</span></button>
    </article>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="empty-state">
      <Palette size={28} /><h3>Your collection starts here</h3>
      <p>Make a palette you love, then save it to see it here.</p>
      <button className="btn btn-primary" onClick={onCreate}>Create a palette</button>
    </div>
  );
}

export default App;
