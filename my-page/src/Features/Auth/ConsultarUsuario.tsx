import React, { useEffect, useState } from "react";
import {
  fetchUsuarios,
  fetchRoles,
  Usuario,
  RoleOption,
  updateUsuarioStructured,
  deleteUsuarioStructured,
} from "./apiUsuarios";

function ConsultarUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    roleId: 0,
  });

  const [selectedRole, setSelectedRole] = useState<number>(0);

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchUsuarios();
      if (!res.isSuccess) {
        setError(res.message || "No se pudieron obtener los usuarios.");
        setUsuarios([]);
        return;
      }
      setUsuarios(res.data);
    } catch {
      setError("Error al conectar con el servidor.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const res = await fetchRoles();
      if (res.isSuccess) {
        setRoles(res.data);
      }
    } catch {}
  };

  const abrirModalEditar = (usuario: Usuario) => {
    if (roles.length === 0) {
      alert("Los roles aún no están cargados. Intenta de nuevo en unos segundos.");
      return;
    }

    const rolEncontrado = roles.find((r) => r.label === usuario.role);

    if (!rolEncontrado) {
      alert("No se encontró un rol válido para este usuario.");
      return;
    }

    setUsuarioSeleccionado(usuario);
    setForm({
      name: usuario.name,
      email: usuario.email,
      roleId: rolEncontrado.value,
    });
    setSelectedRole(rolEncontrado.value);

    console.log("Editar usuario:", usuario);
    console.log("Rol encontrado:", rolEncontrado);

    setModalEditarVisible(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setSelectedRole(value);
    setForm({ ...form, roleId: value });
  };

  const guardarCambios = async () => {
    if (!usuarioSeleccionado) return;

    if (selectedRole === 0) {
      alert("Por favor selecciona un rol válido");
      return;
    }

    console.log("Datos a actualizar:", {
      id: usuarioSeleccionado.id,
      name: form.name,
      email: form.email,
      roleId: selectedRole,
    });

    try {
      const res = await updateUsuarioStructured({
        id: usuarioSeleccionado.id,
        name: form.name,
        email: form.email,
        roleId: selectedRole,
      });

      if (!res.isSuccess) {
        alert(res.message || "Error al actualizar usuario");
        return;
      }

      alert("Usuario actualizado correctamente");
      setModalEditarVisible(false);
      cargarUsuarios();
    } catch (error) {
      alert("Error al actualizar usuario");
      console.error(error);
    }
  };

  const abrirModalEliminar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminarVisible(true);
  };

  const confirmarEliminar = async () => {
    if (!usuarioSeleccionado) return;
     

    console.log("Datos a eliminar:", { id: usuarioSeleccionado.id });
    try {
      const res = await deleteUsuarioStructured({ id: usuarioSeleccionado.id });
     
      if (!res.isSuccess) {
        alert(res.message || "Error al eliminar usuario");
        return;
      }

      alert("Usuario eliminado correctamente");
      setModalEliminarVisible(false);
      cargarUsuarios();
    } catch (error) {
      alert("Error al eliminar usuario");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Usuarios Registrados
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Cargando usuarios...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : usuarios.length === 0 ? (
        <p className="text-center text-gray-700">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-5xl bg-white shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Correo
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-800">{usuario.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{usuario.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{usuario.role}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      className="mr-3 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => abrirModalEditar(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      onClick={() => abrirModalEliminar(usuario)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Editar */}
      {modalEditarVisible && usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-black font-bold mb-4">Editar Usuario</h2>
            <label className="block mb-2">
              Nombre:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded text-black placeholder-black"
                placeholder="Ingresa el nombre"
              />
            </label>
            <label className="block mb-2">
              Correo:
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded text-black placeholder-black"
                placeholder="Ingresa el correo"
              />
            </label>
            <label className="block mb-4">
              Rol:
              <select
                name="roleId"
                value={selectedRole}
                onChange={handleRoleChange}
                className="w-full border px-2 py-1 rounded text-black bg-white"
              >
                <option value={0}>Seleccione un rol</option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end">
              <button
                className="mr-3 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setModalEditarVisible(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={guardarCambios}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {modalEliminarVisible && usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <strong>{usuarioSeleccionado.name}</strong>?
            </p>
            <div className="flex justify-end">
              <button
                className="mr-3 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setModalEliminarVisible(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmarEliminar}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultarUsuario;
