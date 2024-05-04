import { useState, ChangeEvent, useRef, useEffect } from "react";
import "./App.css";

interface StickerPosition {
  x: number;
  y: number;
}

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [stickerPosition, setStickerPosition] = useState<StickerPosition>({
    x: 0,
    y: 0,
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
      const inputImage = new Image();
      inputImage.src = image;

      inputImage.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = inputImage.width;
          canvas.height = inputImage.height;
          setImageDimensions({
            width: inputImage.width,
            height: inputImage.height,
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
          console.log("***************");

          const stickerX =
            (stickerPosition.x / imageDimensions.width) * canvas.width;
          const stickerY =
            (stickerPosition.y / imageDimensions.height) * canvas.height;
          const stickerWidthCanvas =
            (stickerWidth / imageDimensions.width) * canvas.width;
          const stickerHeightCanvas =
            (stickerWidthCanvas * stickerDimensions.height) /
            stickerDimensions.width;

          let res_w = canvas.width;
          let res_h = canvas.height;

          console.log("canvas dims", canvas.width, canvas.height);

          if (stickerPosition.x + stickerWidthCanvas > res_w) {
            res_w += stickerWidthCanvas - stickerPosition.x;
            console.log("res_w", res_w);
            canvas.width += res_w;
            console.log("changed width");
          }

          if (stickerPosition.y + stickerHeightCanvas > res_h) {
            res_h += stickerHeightCanvas - stickerPosition.y;
            console.log("res_h", res_h);
            canvas.height += res_h;
            console.log("changed height");
          }

          console.log("canvas dims", canvas.width, canvas.height);
          console.log("input res", canvas.width, canvas.height);
          console.log("sticker pos", stickerPosition.x, stickerPosition.y);
          context.drawImage(
            imageElement,
            0,
            0,
            imageElement.width,
            imageElement.height
          );

          stickerElement.onload = () => {
            if (flipSticker) {
              context.translate(stickerX, stickerY);
              context.scale(-1, 1);
            }

            context.drawImage(
              stickerElement,
              stickerPosition.x,
              stickerPosition.y,
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
        <div style={{ position: "absolute" }}>
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
        </div>
      )}
    </div>
  );
}

export default App;
