import { useState, ChangeEvent, useRef, useEffect } from "react";
import "./App.css";

interface StickerPosition {
  x: number;
  y: number;
}

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [stickerPosition, setStickerPosition] = useState<StickerPosition>({
    x: 50,
    y: 50,
  });
  const [stickerWidth, setStickerWidth] = useState<number>(100);
  const [stickerDimensions, setStickerDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [flipSticker, setFlipSticker] = useState<boolean>(false); // Estado para rastrear si la imagen
  useEffect(() => {
    const stickerImage = new Image();
    stickerImage.onload = () => {
      setStickerDimensions({
        width: stickerImage.width,
        height: stickerImage.height,
      });
    };
    stickerImage.src = "/pepe.png";
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    if (image && canvasRef.current) {
      const imageElement = new Image();
      imageElement.src = image;

      imageElement.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = imageElement.width;
          canvas.height = imageElement.height;
          setImageDimensions({
            width: imageElement.width,
            height: imageElement.height,
          });
        }
      };
    }
  }, [image]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePositionChange = (axis: "x" | "y", value: number) => {
    setStickerPosition((prevPosition) => ({
      ...prevPosition,
      [axis]: value,
    }));
  };

  const handleWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(event.target.value);
    setStickerWidth(width);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context && image) {
        const imageElement = new Image();
        const stickerElement = new Image();

        imageElement.onload = () => {
          context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

          const stickerX =
            (stickerPosition.x / imageDimensions.width) * canvas.width;
          const stickerY =
            (stickerPosition.y / imageDimensions.height) * canvas.height;
          const stickerWidthCanvas =
            (stickerWidth / imageDimensions.width) * canvas.width;
          const stickerHeightCanvas =
            (stickerWidthCanvas * stickerDimensions.height) /
            stickerDimensions.width;

          stickerElement.onload = () => {
            if (flipSticker) {
              context.translate(stickerX + stickerWidthCanvas, stickerY);
              context.scale(-1, 1);
            }
            context.drawImage(
              stickerElement,
              flipSticker ? 0 : stickerX,
              stickerY,
              stickerWidthCanvas,
              stickerHeightCanvas
            );

            const dataUrl = canvas.toDataURL("image/png");

            const anchor = document.createElement("a");
            anchor.href = dataUrl;
            anchor.download = "imagen_combinada.png";
            anchor.click();
          };
          stickerElement.src = "/pepe.png";
        };
        imageElement.src = image;
      }
    }
  };

  return (
    <div className="App">
      <h1>Hi anon make your meme</h1>
      <input type="file" onChange={handleImageUpload} />
      {image && (
        <div style={{ position: "relative" }}>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <img src={image} alt="Uploaded" style={{ maxWidth: "100%" }} />
          <div
            className="sticker"
            style={{
              position: "absolute",
              top: `${stickerPosition.y}px`,
              left: `${stickerPosition.x}px`,

              transform: flipSticker ? "scaleX(-1)" : undefined,
            }}
          >
            <img
              src="/pepe.png"
              alt="Sticker"
              style={{ width: `${stickerWidth}px` }}
            />
          </div>
          <div>
            <input
              type="range"
              value={stickerPosition.x}
              onChange={(e) =>
                handlePositionChange("x", parseInt(e.target.value))
              }
              min="0"
              max={imageDimensions.width.toString()}
              style={{
                position: "absolute",
                zIndex: 999,
                width: "80%",
                top: "340px",
              }}
            />
            <input
              type="range"
              value={stickerPosition.y}
              onChange={(e) =>
                handlePositionChange("y", parseInt(e.target.value))
              }
              min="0"
              max={imageDimensions.height.toString()}
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
              value={stickerWidth}
              onChange={handleWidthChange}
              min="0"
              max="1500"
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
                checked={flipSticker}
                onChange={(e) => setFlipSticker(e.target.checked)}
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
