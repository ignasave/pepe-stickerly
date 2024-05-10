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
  const [canvasBackgroundColor, setCanvasBackgroundColor] =
    useState<string>("white");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleChangeCanvasColor = () => {
    // Aquí puedes implementar lógica para cambiar el color de fondo del canvas, por ejemplo:
    const newColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Genera un color hexadecimal aleatorio
    setCanvasBackgroundColor(newColor);
  };
  useEffect(() => {
    // Load default sticker
    stickerImage.src = "/pepe.png";

    stickerImage.onload = () => {
      refreshCanvas();
    };
  }, []);

  useEffect(() => {
    refreshCanvas();
  }, [baseImageReady, stickerX, stickerY, stickerScale, stickerFlip]);

  const refreshCanvas = () => {
    if (!canvasRef.current || !baseImageReady) return;

    // Get current canvas size
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = baseImage.width;
    canvas.height = baseImage.height;

    const { width: canvasWidth, height: canvasHeight } = baseImage;
    const { width: stickerWidth, height: stickerHeight } = stickerImage;
    const realWidth = canvas.width - (stickerWidth * stickerScale) / 100;
    const realHeight = canvas.height - (stickerHeight * stickerScale) / 100;

    // Clear canvas
    ctx?.clearRect(0, 0, canvasWidth, canvasHeight);

    // Base Image
    ctx?.drawImage(baseImage, 0, 0);

    // Sticker Image
    if (stickerFlip) {
      ctx?.save();
      ctx?.scale(-1, 1);
      ctx?.drawImage(
        stickerImage,
        -(realWidth * (stickerX / 100)) -
          stickerImage.width * (stickerScale / 100),
        realHeight * (stickerY / 100),
        stickerWidth * (stickerScale / 100),
        stickerHeight * (stickerScale / 100)
      );
      ctx?.restore();
    } else {
      ctx?.drawImage(
        stickerImage,
        realWidth * (stickerX / 100),
        realHeight * (stickerY / 100),
        stickerWidth * (stickerScale / 100),
        stickerHeight * (stickerScale / 100)
      );
    }
  };

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
    if (axis === "x") setStickerX(value);

    if (axis === "y") setStickerY(value);

    refreshCanvas();
  };

  const handleScaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const scale = parseInt(event.target.value);
    setStickerScale(scale);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !baseImageReady) return;

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "pepe_wif_breasts.png";
    link.click();
  };

  return (
    <div className=" flex-col justify-center items-center h-[70em]">
      <h1 className="mb-4 freeman">Hi anon, make your meme</h1>

      <input type="file" onChange={handleImageUpload} />

      <div className="relative flex flex-col items-center mt-4">
        <canvas
          ref={canvasRef}
          style={{ backgroundColor: canvasBackgroundColor }}
          className="mb-4 w-[20em]"
        />
        <div className="absolute text-orange-400 font-bold top-[35em] left-[-10] transform -translate-y-1/2">
          <div className="flex flex-col gap-4 p-4 border-4  bg-gray-100 border-black   rounded">
            <div className="flex items-center gap-2">
              <label htmlFor="x-range">X:</label>
              <input
                id="x-range"
                type="range"
                value={stickerX}
                onChange={(e) =>
                  handlePositionChange("x", parseInt(e.target.value))
                }
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="y-range">Y:</label>
              <input
                id="y-range"
                type="range"
                value={stickerY}
                onChange={(e) =>
                  handlePositionChange("y", parseInt(e.target.value))
                }
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="scale-range">Scale:</label>
              <input
                id="scale-range"
                type="range"
                value={stickerScale}
                onChange={handleScaleChange}
                min="25"
                max="200"
              />
            </div>
            <div className="flex items-center gap-2 ">
              <label htmlFor="flip-checkbox">
                Flip pepe:
                <input
                  id="flip-checkbox"
                  type="checkbox"
                  checked={stickerFlip}
                  className="w-[1em]"
                  onChange={(e) => setStickerFlip(e.target.checked)}
                />{" "}
                <span className="checkmark mt-3 cursor-pointer"></span>
              </label>
            </div>
            <div className="flex gap-2 ">
              <button className="  text-white px-3 py-1 rounded">
                {" "}
                <a onClick={handleDownload}> Download</a>
              </button>
              <button className="  text-white px-3 py-1 rounded">
                {" "}
                <a onClick={handleChangeCanvasColor}> Change BG color</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
