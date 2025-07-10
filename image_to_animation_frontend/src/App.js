import React, { useState, useRef } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  App: Main interface for creating GIF animations from uploaded images.
  - Multiple image upload, drag-and-drop arrangement
  - Animation speed selection, GIF preview, and download
  - Minimal, modern, light-themed design with color palette
*/
function App() {
  // States for images, arrangement, speed, errors, and loading
  const [images, setImages] = useState([]); // { src:..., file:..., name:... }
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(500); // ms per frame
  const [error, setError] = useState("");
  const [gifUrl, setGifUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef();

  // Image uploading logic
  const handleFiles = (files) => {
    setError("");
    let imgPromises = [];
    let newImgs = [];

    for (let file of files) {
      // Only images
      if (!file.type.startsWith("image/")) {
        setError("Please upload image files only.");
        return;
      }
      imgPromises.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            newImgs.push({
              src: e.target.result,
              file,
              name: file.name,
            });
            resolve();
          };
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(imgPromises).then(() => {
      setImages((prev) => [...prev, ...newImgs]);
    });
  };

  // File input handler
  const handleFileInput = (e) => {
    handleFiles([...e.target.files]);
    e.target.value = "";
  };

  // Drag-and-drop logic for rearranging images
  const onDragStart = (i) => setDraggedIdx(i);
  const onDrop = (i) => {
    if (draggedIdx === null || draggedIdx === i) return;
    setImages((imgs) => {
      const arr = [...imgs];
      const [removed] = arr.splice(draggedIdx, 1);
      arr.splice(i, 0, removed);
      return arr;
    });
    setDraggedIdx(null);
  };
  const onDragOver = (e) => e.preventDefault();

  // Remove image
  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setGifUrl(null);
  };

  // Animation speed selection
  const handleSpeedChange = (e) => setAnimationSpeed(Number(e.target.value));

  // GIF generation logic using gif.js (client-side lib)
  // Lazy import to avoid including unless needed
  const createGif = async () => {
    if (images.length < 2) {
      setError("Upload at least 2 images.");
      return;
    }
    setError("");
    setIsGenerating(true);
    setGifUrl(null);

    try {
      // Dynamic load gif.js from CDN
      if (!window.GIF) {
        await loadGifJs();
      }
      // Calculate smallest width/height to standardize all frames
      let minW = Math.min(...images.map((img) => imgRefDims(img.src).width));
      let minH = Math.min(...images.map((img) => imgRefDims(img.src).height));

      const gif = new window.GIF({
        workers: 2,
        quality: 8,
        width: minW,
        height: minH,
        workerScript: "https://cdn.jsdelivr.net/npm/gif.js.optimized@0.6.11/dist/gif.worker.js",
      });

      // Draw each image onto canvas and add to GIF
      for (let { src } of images) {
        let imgDims = await imgRefDimsAsync(src);
        let canvas = document.createElement("canvas");
        canvas.width = minW;
        canvas.height = minH;
        let ctx = canvas.getContext("2d");
        // Center image in canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, minW, minH);
        let offsetX = (minW - imgDims.width) / 2;
        let offsetY = (minH - imgDims.height) / 2;
        ctx.drawImage(await createImage(src), offsetX, offsetY, imgDims.width, imgDims.height);
        gif.addFrame(canvas, { delay: animationSpeed });
      }

      gif.on("finished", (blob) => {
        setGifUrl(URL.createObjectURL(blob));
        setIsGenerating(false);
      });
      gif.on("abort", () => {
        setError("GIF generation aborted.");
        setIsGenerating(false);
      });
      gif.render();
    } catch (err) {
      setError("Failed to generate GIF. Try again.");
      setIsGenerating(false);
    }
  };

  // Helpers for image dimension extraction and image element creation
  function createImage(src) {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }
  function imgRefDims(src) {
    const img = new window.Image();
    img.src = src;
    return {
      width: img.width || 150,
      height: img.height || 150,
    };
  }
  function imgRefDimsAsync(src) {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = src;
    });
  }

  // Lazy-load gif.js from CDN
  async function loadGifJs() {
    if (document.getElementById("gifjs-lib")) return;
    let script = document.createElement("script");
    script.id = "gifjs-lib";
    script.src = "https://cdn.jsdelivr.net/npm/gif.js.optimized@0.6.11/dist/gif.js";
    script.async = true;
    document.body.appendChild(script);
    await new Promise((resolve) => {
      script.onload = resolve;
      script.onerror = resolve;
    });
  }

  // Download GIF
  const handleDownload = () => {
    if (gifUrl) {
      const link = document.createElement("a");
      link.href = gifUrl;
      link.download = "animation.gif";
      link.click();
    }
  };

  // Animation Preview component (uses GIF if generated, else animate via <img>)
  function AnimationPreview() {
    if (gifUrl)
      return (
        <div className="preview-gif">
          <img
            src={gifUrl}
            alt="Animated GIF Preview"
            style={{ boxShadow: "0 2px 16px #1976D234", maxHeight: 320, borderRadius: 12 }}
          />
          <button onClick={handleDownload} className="btn-accent" style={{ marginTop: 16 }}>
            Download GIF
          </button>
        </div>
      );
    if (images.length < 2)
      return <div className="preview-placeholder">Upload at least 2 images to preview</div>;
    // Fallback simple JS animation (not GIF) as preview
    return <FrameAnimation images={images} delay={animationSpeed} />;
  }

  // Simple animating <img> preview, cycling frames
  function FrameAnimation({ images, delay }) {
    const [idx, setIdx] = useState(0);
    React.useEffect(() => {
      const interval = setInterval(() => setIdx((c) => (c + 1) % images.length), delay);
      return () => clearInterval(interval);
    }, [images.length, delay]);
    return (
      <div className="preview-simple">
        <img
          src={images[idx].src}
          alt={`Frame ${idx + 1}`}
          style={{
            maxHeight: 320,
            borderRadius: 10,
            border: "2px solid #EEE",
            boxShadow: "0 2px 18px #42424221",
            background: "#fff",
          }}
        />
      </div>
    );
  }

  // UI Render
  return (
    <div className="iac-root">
      {/* Top: Image upload area */}
      <div className="iac-upload-area card">
        <h1 style={{ color: "#1976D2", marginBottom: 10 }}>Image Animation Creator</h1>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileInput}
        />
        <button
          className="btn-primary"
          onClick={() => fileInputRef.current.click()}
          tabIndex={0}
        >
          Upload Images
        </button>
        <div style={{ fontSize: 13, marginTop: 5, color: "#424242" }}>
          Drag-and-drop images anywhere. Min size: 2 images.
        </div>
        {/* Drag n Drop support */}
        <div
          className="iac-dropzone"
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
              handleFiles(Array.from(e.dataTransfer.files));
            }
          }}
          onDragOver={onDragOver}
        >
          <span role="img" aria-label="drag-drop">🖼️</span>
        </div>
      </div>

      {/* Center: Drag-and-drop arrangement grid */}
      <div className="iac-arr-grid card">
        <h2 style={{ color: "#424242", fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Arrange Images</h2>
        {images.length === 0 && (
          <div className="arr-placeholder">
            <span style={{ opacity: 0.6 }}>Upload some images to start arranging</span>
          </div>
        )}
        <div className="img-grid">
          {images.map((img, i) => (
            <div
              key={i}
              className="img-thumb"
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(i)}
              tabIndex={0}
              aria-label={`Image ${i + 1}: ${img.name}`}
            >
              <img src={img.src} alt={`thumbnail-${i}`} />
              <button className="btn-small btn-accent" aria-label="Remove" onClick={() => removeImage(i)} tabIndex={0}>
                ✕
              </button>
              <span className="thumb-num">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Below arrangement: animation settings */}
      <div className="iac-settings card">
        <h3 style={{ color: "#1976D2", margin: 0, fontWeight: 500, fontSize: 15 }}>Animation Settings</h3>
        <div className="speed-slider-wrap">
          <label htmlFor="anim-speed" style={{ marginRight: 15, color: "#424242", fontSize: 14 }}>
            Speed (ms/frame): {animationSpeed}
          </label>
          <input
            id="anim-speed"
            type="range"
            min={100}
            max={2000}
            step={50}
            value={animationSpeed}
            className="slider"
            style={{ accentColor: "#1976D2" }}
            onChange={handleSpeedChange}
          />
        </div>
        <button
          onClick={createGif}
          className="btn-primary"
          disabled={isGenerating || images.length < 2}
        >
          {isGenerating ? "Generating GIF..." : "Create GIF"}
        </button>
      </div>

      {/* Preview and Download */}
      <div className="iac-preview card">
        <h3 style={{ color: "#1976D2", margin: 0, fontWeight: 500, fontSize: 15 }}>
          Preview & Download
        </h3>
        <AnimationPreview />
      </div>

      {/* Error Handling */}
      {error && <div className="iac-error" role="alert">{error}</div>}

      {/* Attribution / Footer */}
      <div className="iac-footer">
        <span>Powered by <a href="https://gifjs.dev/" style={{ color: "#FF4081" }}>gif.js</a>. &copy; Kavia Co.</span>
      </div>
    </div>
  );
}

export default App;
