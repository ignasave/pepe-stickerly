import { useState, ChangeEvent, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [baseImage] = useState<HTMLImageElement>(new Image());
  const [stickerImage] = useState<HTMLImageElement>(new Image());
  const [stickerX, setStickerX] = useState<number>(50);
  const [stickerY, setStickerY] = useState<number>(50);
  const [stickerScale, setStickerScale] = useState<number>(100);
  const [stickerFlip, setStickerFlip] = useState<boolean>(false); 
  const [baseImageReady, setBaseImageReady] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load default sticker
    stickerImage.src = "/pepe.png";

    stickerImage.onload = () => {
      refreshCanvas();
    }
  }, []);

  useEffect(() => {
    refreshCanvas();
  }, [baseImageReady, stickerX, stickerY, stickerScale, stickerFlip]);


  const refreshCanvas = () => {
    if (!canvasRef.current || !baseImageReady)
      return;

    // Get current canvas size
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = baseImage.width;
    canvas.height = baseImage.height;

    const {width:canvasWidth, height:canvasHeight} = baseImage;
    const {width:stickerWidth, height:stickerHeight} = stickerImage;
    const realWidth = (canvas.width - stickerWidth * stickerScale/100);
    const realHeight = (canvas.height - stickerHeight * stickerScale/100);

    // Clear canvas
    ctx?.clearRect(0, 0, canvasWidth, canvasHeight);

    // Base Image
    ctx?.drawImage(baseImage, 0, 0);

    // Sticker Image
    if (stickerFlip) {
      ctx?.save();
      ctx?.scale(-1, 1);
      ctx?.drawImage(stickerImage, -(realWidth * (stickerX/100)) - stickerImage.width*(stickerScale/100), realHeight * (stickerY/100), stickerWidth*(stickerScale/100), stickerHeight*(stickerScale/100));
      ctx?.restore();
    } else {
      ctx?.drawImage(stickerImage, realWidth * (stickerX/100), realHeight * (stickerY/100), stickerWidth*(stickerScale/100), stickerHeight*(stickerScale/100));
    }
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      baseImage.src = URL.createObjectURL(file);
    }

    baseImage.onload = () => {
        setBaseImageReady(true);
    };    
  };

  const handlePositionChange = (axis: "x" | "y", value: number) => {
    if (axis === "x")
      setStickerX(value);

    if (axis === "y")
      setStickerY(value);

    refreshCanvas();
  };

  const handleScaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const scale = parseInt(event.target.value);
    setStickerScale(scale);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !baseImageReady)
      return;

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = "imagen_combinada.png";
    link.click();
  };

  return (
    <div className="App">
      <h1>Hi anon make your meme</h1>
      <input type="file" onChange={handleImageUpload} />
      
      {baseImageReady && (
        <div style={{ position: "relative" }}>
          <canvas ref={canvasRef}/>
          <div>
            <input
              type="range"
              value={stickerX}
              onChange={(e) =>
                handlePositionChange("x", parseInt(e.target.value))
              }
              min="0"
              max="100"
              style={{
                position: "absolute",
                zIndex: 999,
                width: "80%",
                top: "340px",
              }}
            />
            <input
              type="range"
              value={stickerY}
              onChange={(e) =>
                handlePositionChange("y", parseInt(e.target.value))
              }
              min="0"
              max="100"
              style={{
                position: "absolute",
                zIndex: 999,
                width: "80%",
                top: "380px",
              }}
            />
          </div>
          <div>
            <input
              type="range"
              value={stickerScale}
              onChange={handleScaleChange}
              min="25"
              max="200"
              style={{
                position: "absolute",
                zIndex: 999,
                width: "40%",
                top: "420px",
              }}
            />
          </div>
          <div>
            <label style={{ position: "absolute", top: "460px" }}>
              Flip pepe:
              <input
                type="checkbox"
                checked={stickerFlip}
                onChange={(e) => setStickerFlip(e.target.checked)}
              />
            </label>
          </div>
          <button
            style={{
              position: "absolute",
              zIndex: 500,
              top: "500px",
            }}
            onClick={handleDownload}
          >
            Downlaod
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
