import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { updatePerfil, fetchPerfilByUserId } from '../Features/Auth/apiPerfil'; // ✅ Ruta corregida

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const nombreUsuario = localStorage.getItem("nombre");
  const rolUsuario = localStorage.getItem("rolName");
  const userIdStr = localStorage.getItem("userId");
  const userId = userIdStr ? Number(userIdStr) : null;

  // Obtener foto actual al montar
  useEffect(() => {
    if (userId) {
      fetchPerfilByUserId(userId)
        .then(({ isSuccess, data }) => {
          if (isSuccess && data?.fotoPerfil) {
            setFotoPerfil(`http://localhost:3001/${data.fotoPerfil}`);
          }
        })
        .catch(() => {
          console.error("No se pudo cargar la foto de perfil.");
        });
    }
  }, [userId]);

  // Cierre de menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cierre de sesión
  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem("persist:root");
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("rolName");
    localStorage.removeItem("userId");
    localStorage.removeItem("testCompleted");
    localStorage.removeItem("idUsuarioTest");
    


   

    navigate('/login');
  };

  // Cambio de imagen de perfil
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append("userId", userId.toString());
    formData.append("fotoPerfil", file);

    try {
      const res = await updatePerfil(formData);
      alert(res.message);
      setFotoPerfil(URL.createObjectURL(file)); // vista previa inmediata
    } catch {
      alert("Error al actualizar la imagen.");
    }
  };

  return (
    <nav className="bg-black border-b border-gray-800 shadow-md px-4">
      <div className="flex items-center justify-between p-4 w-full">
        <button
          className="text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm p-2.5 focus:outline-none"
          onClick={toggleSidebar}
        >
          <HiMenu className="w-5 h-5" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <span className="sr-only">Abrir menú de usuario</span>
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={fotoPerfil || "https://flowbite.com/docs/images/people/profile-picture-3.jpg"}
              alt="Foto de perfil"
            />
          </button>

          <div
            className={`absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg transform transition-all duration-200 origin-top-right ${
              isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <span className="block text-sm font-medium">{nombreUsuario}</span>
              <span className="block text-sm text-gray-500 truncate">{rolUsuario}</span>
            </div>
            <ul className="py-1">
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <label className="cursor-pointer block">
                  Cambiar foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
