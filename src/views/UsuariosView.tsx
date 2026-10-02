import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Check,
  Shield,
  UserPlus,
  Mail,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface UserRow {
  id: string;
  name: string;
  email: string;
  accessBadge: string;
  roles: string[];
  dashboardPerm: boolean;
  addInvoicesPerm: boolean;
  ultimoAccesoFecha: string;
  ultimoAccesoHora: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export const UsuariosView: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([
    {
      id: 'usr-karen-01',
      name: 'Karen Garcia',
      email: 'karenyinet.0216@gmail.com',
      accessBadge: 'Admin - Acceso total',
      roles: ['ADMIN', 'EMPRESA'],
      dashboardPerm: true,
      addInvoicesPerm: true,
      ultimoAccesoFecha: '30/09/2026',
      ultimoAccesoHora: '03:16 PM',
      estado: 'ACTIVO'
    },
    {
      id: 'usr-andres-02',
      name: 'Andrés Morales',
      email: 'andres.morales@disfarma.com.co',
      accessBadge: 'Aprobador - Operaciones',
      roles: ['APROBADOR', 'EMPRESA'],
      dashboardPerm: true,
      addInvoicesPerm: false,
      ultimoAccesoFecha: '29/09/2026',
      ultimoAccesoHora: '11:42 AM',
      estado: 'ACTIVO'
    },
    {
      id: 'usr-laura-03',
      name: 'Laura Sofía Gómez',
      email: 'laura.gomez@disfarma.com.co',
      accessBadge: 'Contabilidad & Impuestos',
      roles: ['CONTADOR', 'EMPRESA'],
      dashboardPerm: true,
      addInvoicesPerm: true,
      ultimoAccesoFecha: '30/09/2026',
      ultimoAccesoHora: '08:20 AM',
      estado: 'ACTIVO'
    }
  ]);

  // Left form state (Crear / Editar Usuario)
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [primaryRole, setPrimaryRole] = useState<'ADMIN' | 'APROBADOR' | 'CONTADOR' | 'AUDITOR'>('ADMIN');
  const [isEmpresaRole, setIsEmpresaRole] = useState(true);
  const [dashboardPerm, setDashboardPerm] = useState(true);
  const [addInvoicesPerm, setAddInvoicesPerm] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const toggleDashboard = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, dashboardPerm: !u.dashboardPerm } : u))
    );
  };

  const toggleAddInvoices = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, addInvoicesPerm: !u.addInvoicesPerm } : u))
    );
  };

  const handleEditClick = (u: UserRow) => {
    setEditingUserId(u.id);
    setName(u.name);
    setEmail(u.email);
    setPrimaryRole(
      u.roles.includes('ADMIN')
        ? 'ADMIN'
        : u.roles.includes('APROBADOR')
        ? 'APROBADOR'
        : u.roles.includes('CONTADOR')
        ? 'CONTADOR'
        : 'AUDITOR'
    );
    setIsEmpresaRole(u.roles.includes('EMPRESA'));
    setDashboardPerm(u.dashboardPerm);
    setAddInvoicesPerm(u.addInvoicesPerm);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setName('');
    setEmail('');
    setPrimaryRole('ADMIN');
    setIsEmpresaRole(true);
    setDashboardPerm(true);
    setAddInvoicesPerm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const roleList: string[] = [primaryRole];
    if (isEmpresaRole && !roleList.includes('EMPRESA')) {
      roleList.push('EMPRESA');
    }

    if (editingUserId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                name,
                email,
                accessBadge: `${primaryRole} - Acceso configurado`,
                roles: roleList,
                dashboardPerm,
                addInvoicesPerm
              }
            : u
        )
      );
      setSavedFeedback(`Usuario ${name} actualizado con éxito`);
    } else {
      const newUser: UserRow = {
        id: `usr-${Date.now()}`,
        name,
        email,
        accessBadge: `${primaryRole} - Acceso configurado`,
        roles: roleList,
        dashboardPerm,
        addInvoicesPerm,
        ultimoAccesoFecha: '30/09/2026',
        ultimoAccesoHora: '04:10 PM',
        estado: 'ACTIVO'
      };
      setUsers((prev) => [...prev, newUser]);
      setSavedFeedback(`Usuario ${name} creado con éxito`);
    }

    handleCancelEdit();
    setTimeout(() => setSavedFeedback(null), 3500);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas revocar el acceso a este usuario?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (editingUserId === id) {
        handleCancelEdit();
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-14 font-sans text-slate-800">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Usuarios
          </h1>
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
            ADMINISTRA LOS USUARIOS, ROLES Y PERMISOS DE ACCESO EN TU PLATAFORMA
          </p>
        </div>

        {savedFeedback && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-2 font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedFeedback}</span>
          </div>
        )}
      </div>

      {/* Split 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Crear / Editar Usuario Form (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4338ca] flex items-center justify-center font-bold">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">
                  {editingUserId ? 'Editar Usuario' : 'Crear Usuario Nuevo'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {editingUserId ? 'Modifica los permisos del usuario' : 'Ingresa los datos del nuevo miembro'}
                </p>
              </div>
            </div>

            {editingUserId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline"
              >
                Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* NOMBRE COMPLETO */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                NOMBRE COMPLETO *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Karen Garcia"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                />
              </div>
            </div>

            {/* CORREO ELECTRÓNICO */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                CORREO ELECTRÓNICO *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@disfarma.com.co"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                />
              </div>
            </div>

            {/* ROL PRINCIPAL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                ROL PRINCIPAL
              </label>
              <select
                value={primaryRole}
                onChange={(e) => setPrimaryRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="APROBADOR">APROBADOR</option>
                <option value="CONTADOR">CONTADOR</option>
                <option value="AUDITOR">AUDITOR</option>
              </select>
            </div>

            {/* ROL SECUNDARIO (EMPRESA) */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-800">Rol Empresa</div>
                <div className="text-[10px] text-slate-500">Asigna visibilidad corporativa</div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmpresaRole(!isEmpresaRole)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                  isEmpresaRole ? 'bg-[#4338ca]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isEmpresaRole ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* PERMISOS: DASHBOARD & AGREGAR FACTURAS */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                PERMISOS DIRECTOS
              </div>

              {/* DASHBOARD SWITCH */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Dashboard</div>
                  <div className="text-[10px] text-slate-500">Acceso a métricas y KPIs</div>
                </div>
                <button
                  type="button"
                  onClick={() => setDashboardPerm(!dashboardPerm)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    dashboardPerm ? 'bg-[#4f46e5]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      dashboardPerm ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* AGREGAR FACTURAS SWITCH */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Agregar Facturas</div>
                  <div className="text-[10px] text-slate-500">Cargar y radicar documentos</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAddInvoicesPerm(!addInvoicesPerm)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    addInvoicesPerm ? 'bg-[#818cf8]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      addInvoicesPerm ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingUserId ? 'Guardar Cambios' : 'Crear Usuario'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Tabla de Usuarios (8 cols on lg) Matching Screenshot Exactly */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">USUARIO</th>
                  <th className="py-4 px-4">ROL</th>
                  <th className="py-4 px-4 text-center">DASHBOARD</th>
                  <th className="py-4 px-4 text-center">AGREGAR FACTURAS</th>
                  <th className="py-4 px-4 text-center">ÚLTIMO ACCESO</th>
                  <th className="py-4 px-4 text-center">ESTADO</th>
                  <th className="py-4 px-6 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const initialLetter = u.name.trim().charAt(0).toUpperCase();
                  const isBeingEdited = editingUserId === u.id;
                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        isBeingEdited ? 'bg-indigo-50/50' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      {/* USUARIO */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          {/* Avatar Circle with letter in light blue */}
                          <div className="w-10 h-10 rounded-full bg-[#eff6ff] border border-blue-200/80 text-[#2563eb] font-bold text-sm flex items-center justify-center shrink-0">
                            {initialLetter}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm leading-tight">
                              {u.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                              {u.email}
                            </div>
                            {u.accessBadge && (
                              <div className="mt-1">
                                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                  {u.accessBadge}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ROL */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {u.roles.map((r, rIdx) => (
                            <span
                              key={rIdx}
                              className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#e0e7ff] text-[#4338ca]"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* DASHBOARD TOGGLE */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => toggleDashboard(u.id)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                              u.dashboardPerm ? 'bg-[#4f46e5]' : 'bg-slate-200'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                u.dashboardPerm ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* AGREGAR FACTURAS TOGGLE */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => toggleAddInvoices(u.id)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                              u.addInvoicesPerm ? 'bg-[#818cf8]' : 'bg-slate-200'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                u.addInvoicesPerm ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* ÚLTIMO ACCESO */}
                      <td className="py-4 px-4 text-center">
                        <div className="font-mono text-xs text-slate-800 font-medium">
                          {u.ultimoAccesoFecha}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {u.ultimoAccesoHora}
                        </div>
                      </td>

                      {/* ESTADO */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
                          {u.estado}
                        </span>
                      </td>

                      {/* ACCIONES */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditClick(u)}
                            className="w-8 h-8 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                            title="Editar usuario"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="w-8 h-8 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
