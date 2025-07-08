import SweetAlertLike from "../../components/SweetAlertLike";
import { useNavigate } from "react-router-dom";


const ResultadoMBTI = ({ open, onClose, resultado }: {
  open: boolean;
  onClose: () => void;
  resultado: {
    tipoMBTI: string;
    personalidad: string;
    descripcion: string;
    keywords: string;
  } | null;
}) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onClose();
    navigate("/dashboard");
  };

  if (!open || !resultado) return null;

  return (
    <SweetAlertLike
      title={`Tipo MBTI: ${resultado.tipoMBTI}`}
      message={
        <div className="text-left">
          <p><strong>Personalidad:</strong> {resultado.personalidad}</p>
          <p className="mt-2 whitespace-pre-line">{resultado.descripcion}</p>
          <p className="mt-4 italic text-sm text-gray-600">
            <strong>Palabras clave:</strong> {resultado.keywords}
          </p>
        </div>
      }
      onConfirm={handleConfirm}
      icon="https://cdn-icons-png.flaticon.com/512/201/201623.png"
    />
  );
};

export default ResultadoMBTI;
