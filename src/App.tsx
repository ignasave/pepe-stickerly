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
  const [stickerWidth, setStickerWidth] = useState<number>(100); // Ancho inicial del sticker
  const [stickerDimensions, setStickerDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    const stickerImage = new Image();
    stickerImage.onload = () => {
      setStickerDimensions({
        width: stickerImage.width,
        height: stickerImage.height,
      });
    };
    stickerImage.src = "/pepe.png"; // Ruta de la imagen del sticker
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

  useEffect(() => {
    if (image && canvasRef.current) {
      const imageElement = new Image();
      imageElement.src = image;

      imageElement.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = imageElement.width;
          canvas.height = imageElement.height;
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

  const handleArrowClick = (direction: "up" | "down" | "left" | "right") => {
    if (direction === "up") {
      setStickerPosition((prevPosition) => ({
        ...prevPosition,
        y: prevPosition.y - 10,
      }));
    } else if (direction === "down") {
      setStickerPosition((prevPosition) => ({
        ...prevPosition,
        y: prevPosition.y + 10,
      }));
    } else if (direction === "left") {
      setStickerPosition((prevPosition) => ({
        ...prevPosition,
        x: prevPosition.x - 10,
      }));
    } else if (direction === "right") {
      setStickerPosition((prevPosition) => ({
        ...prevPosition,
        x: prevPosition.x + 10,
      }));
    }
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

        // Cargar la imagen subida
        imageElement.onload = () => {
          // Dibujar la imagen subida en el canvas
          context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

          // Calcular las coordenadas y dimensiones del sticker en relación con el canvas
          const stickerX =
            (stickerPosition.x / imageDimensions.width) * canvas.width;
          const stickerY =
            (stickerPosition.y / imageDimensions.height) * canvas.height;
          const stickerWidthCanvas =
            (stickerWidth / imageDimensions.width) * canvas.width;
          const stickerHeightCanvas =
            (stickerWidthCanvas * stickerDimensions.height) /
            stickerDimensions.width;

          // Cargar la imagen del sticker
          stickerElement.onload = () => {
            // Dibujar la imagen del sticker en el canvas con la posición y el ancho del sticker
            context.drawImage(
              stickerElement,
              stickerX,
              stickerY,
              stickerWidthCanvas,
              stickerHeightCanvas
            );

            // Convertir el contenido del canvas a una URL de datos
            const dataUrl = canvas.toDataURL("image/png");

            // Crear un enlace temporal para iniciar la descarga
            const anchor = document.createElement("a");
            anchor.href = dataUrl;
            anchor.download = "imagen_combinada.png"; // Establecer el nombre de archivo
            anchor.click();
          };
          stickerElement.src = "/pepe.png"; // Establecer la fuente de la imagen del sticker
        };
        imageElement.src = image; // Establecer la fuente de la imagen subida
      }
    }
  };
  const stickerWidthPercentage = (stickerWidth / imageDimensions.width) * 100;
  return (
    <div className="App">
      <input type="file" onChange={handleImageUpload} />
      {image && (
        <div style={{ position: "relative" }}>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <img
            src={image}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "320px" }}
          />
          <div
            className="sticker"
            style={{
              position: "absolute",
              top: `${(stickerPosition.y / imageDimensions.height) * 150}%`,
              left: `${(stickerPosition.x / imageDimensions.width) * 155}%`,
              width: `${stickerWidth}px`,
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
              transform: `translate(-${100 - stickerWidthPercentage}%, -55%)`, // Centra el sticker
            }}
          >
            <img src="/pepe.png" alt="Sticker" style={{ maxWidth: "100%" }} />
          </div>
          <div className="arrow-buttons">
            <button onClick={() => handleArrowClick("up")}>&#8593;</button>
            <button onClick={() => handleArrowClick("down")}>&#8595;</button>
            <button onClick={() => handleArrowClick("left")}>&#8592;</button>
            <button onClick={() => handleArrowClick("right")}>&#8594;</button>
          </div>
          <div>
            <input
              type="range"
              value={stickerWidth}
              onChange={handleWidthChange}
              min="50"
              max="450"
              style={{
                position: "absolute",
                zIndex: 999,
                width: "40%",
              }}
            />
          </div>
          <button
            style={{
              position: "absolute",
              zIndex: 500,
            }}
            onClick={handleDownload}
          >
            Descargar Imagen
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
