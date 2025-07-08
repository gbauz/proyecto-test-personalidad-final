import ReactDOM from "react-dom";
import { useEffect, useState } from "react";

interface SweetAlertProps {
  title: string;
  message: string;
  onConfirm: () => void;
  icon?: string;
  autoCloseDelay?: number; // opcional, en ms
}

const SweetAlertLike: React.FC<SweetAlertProps> = ({ title, message, onConfirm, icon, autoCloseDelay }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const appear = setTimeout(() => setVisible(true), 10);
    let autoClose: NodeJS.Timeout | null = null;

    if (autoCloseDelay) {
      autoClose = setTimeout(() => {
        setVisible(false);
        setTimeout(onConfirm, 300); // Espera la animación
      }, autoCloseDelay);
    }

    return () => {
      clearTimeout(appear);
      if (autoClose) clearTimeout(autoClose);
    };
  }, [autoCloseDelay, onConfirm]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onConfirm, 300); // Espera la animación de salida
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-2xl shadow-2xl p-6 w-80 text-center transform transition-all duration-300 ease-out ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
        }`}
      >
        {icon && (
          <div className="flex justify-center mb-4">
            <img src={icon} alt="Icono" className="w-16 h-16 animate-bounce" />
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default SweetAlertLike;
