interface ImageModalProps {
  imagenUrl: string | null;
  onCerrar: () => void;
}

export const ImageModal = ({ imagenUrl, onCerrar }: ImageModalProps) => {
  // si no hay imagen seleccionada no renderizamos nada
  if (!imagenUrl) return null;

  return (
    <div
      onClick={onCerrar}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        cursor: "pointer",
      }}
    >
      <img
        src={imagenUrl}
        alt="Imagen ampliada"
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: "8px",
          objectFit: "contain",
        }}
      />
    </div>
  );
};