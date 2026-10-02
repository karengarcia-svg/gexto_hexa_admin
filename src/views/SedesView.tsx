import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building,
  Network,
  GitFork,
  ArrowLeft,
  Info,
  Save,
  Pencil,
  Users,
  Check,
  ChevronDown,
  X,
  Plus,
  Trash2,
  Layers,
  MapPin
} from 'lucide-react';

interface Sede {
  id: string;
  codigo: string;
  nombre: string;
  ciudad: string;
  direccion: string;
  habilitado: boolean;
  areasAsociadas: string[];
}

interface AreaItem {
  id: string;
  codigo: string;
  nombre: string;
  departamento: string;
  habilitado: boolean;
}

interface DepartamentoItem {
  id: string;
  codigo: string;
  nombre: string;
  habilitado: boolean;
}

export const SedesView: React.FC = () => {
  const { activeMenu, setActiveMenu } = useApp();

  // Tab State: 'sedes' | 'areas' | 'departamentos'
  const [activeTab, setActiveTab] = useState<'sedes' | 'areas' | 'departamentos'>('sedes');

  // Synchronize tab with sidebar menu
  useEffect(() => {
    if (activeMenu === 'areas') {
      setActiveTab('areas');
    } else if (activeMenu === 'departamentos') {
      setActiveTab('departamentos');
    } else if (activeMenu === 'sedes') {
      setActiveTab('sedes');
    }
  }, [activeMenu]);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Form State: Nueva Sede
  const [nextSedeNum, setNextSedeNum] = useState(2);
  const currentSedeCode = `SEDE_${String(nextSedeNum).padStart(6, '0')}`;
  const [nombreSede, setNombreSede] = useState('');
  const [direccionSede, setDireccionSede] = useState('');
  const [ciudadSede, setCiudadSede] = useState('');

  // Editing Sede Modal
  const [editingSede, setEditingSede] = useState<Sede | null>(null);
  const [editSedeNombre, setEditSedeNombre] = useState('');
  const [editSedeCiudad, setEditSedeCiudad] = useState('');
  const [editSedeDireccion, setEditSedeDireccion] = useState('');

  // Organizacion Modal (Associate Areas)
  const [organizacionSede, setOrganizacionSede] = useState<Sede | null>(null);

  // Sedes List (Starts with 1 item exactly matching screenshot)
  const [sedes, setSedes] = useState<Sede[]>([
    {
      id: 'sede-1',
      codigo: 'SEDE_000001',
      nombre: 'Principal Anillo Vial',
      ciudad: 'Girón',
      direccion:
        'Kilómetro 7 + 400 metros, Anillo Vial Palenque - Diagonal Floridablanca, Bodegas San Jorge (Bodegas 89 a 93)',
      habilitado: true,
      areasAsociadas: ['area-1', 'area-2', 'area-3', 'area-4']
    }
  ]);

  // 15 Áreas (to match the badge 15 in the screenshot!)
  const [areas, setAreas] = useState<AreaItem[]>([
    { id: 'area-1', codigo: 'AREA_001', nombre: 'Administración General', departamento: 'Administración', habilitado: true },
    { id: 'area-2', codigo: 'AREA_002', nombre: 'Contabilidad y Finanzas', departamento: 'Finanzas', habilitado: true },
    { id: 'area-3', codigo: 'AREA_003', nombre: 'Facturación y Cartera', departamento: 'Finanzas', habilitado: true },
    { id: 'area-4', codigo: 'AREA_004', nombre: 'Compras y Proveedores', departamento: 'Operaciones', habilitado: true },
    { id: 'area-5', codigo: 'AREA_005', nombre: 'Logística y Distribución', departamento: 'Operaciones', habilitado: true },
    { id: 'area-6', codigo: 'AREA_006', nombre: 'Bodega Principal', departamento: 'Operaciones', habilitado: true },
    { id: 'area-7', codigo: 'AREA_007', nombre: 'Recursos Humanos', departamento: 'Gestión Humana', habilitado: true },
    { id: 'area-8', codigo: 'AREA_008', nombre: 'Tecnología e Infraestructura', departamento: 'Tecnología', habilitado: true },
    { id: 'area-9', codigo: 'AREA_009', nombre: 'Ventas Corporativas', departamento: 'Comercial', habilitado: true },
    { id: 'area-10', codigo: 'AREA_010', nombre: 'Servicio al Cliente', departamento: 'Comercial', habilitado: true },
    { id: 'area-11', codigo: 'AREA_011', nombre: 'Marketing y Comunicaciones', departamento: 'Comercial', habilitado: true },
    { id: 'area-12', codigo: 'AREA_012', nombre: 'Control de Calidad', departamento: 'Calidad', habilitado: true },
    { id: 'area-13', codigo: 'AREA_013', nombre: 'Seguridad y Salud en el Trabajo', departamento: 'Gestión Humana', habilitado: true },
    { id: 'area-14', codigo: 'AREA_014', nombre: 'Jurídico y Cumplimiento', departamento: 'Legal', habilitado: true },
    { id: 'area-15', codigo: 'AREA_015', nombre: 'Auditoría Interna', departamento: 'Auditoría', habilitado: true }
  ]);

  // Departamentos List (0 items as shown in badge 0 in screenshot!)
  const [departamentos, setDepartamentos] = useState<DepartamentoItem[]>([]);

  // Form State for new Area
  const [nuevaAreaNombre, setNuevaAreaNombre] = useState('');
  const [nuevaAreaDepto, setNuevaAreaDepto] = useState('');

  // Form State for new Departamento
  const [nuevoDeptoNombre, setNuevoDeptoNombre] = useState('');

  const handleCreateSede = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreSede.trim() || !direccionSede.trim() || !ciudadSede) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const newSede: Sede = {
      id: `sede-${Date.now()}`,
      codigo: currentSedeCode,
      nombre: nombreSede.trim(),
      ciudad: ciudadSede,
      direccion: direccionSede.trim(),
      habilitado: true,
      areasAsociadas: []
    };

    setSedes([...sedes, newSede]);
    setNextSedeNum((prev) => prev + 1);
    showToast(`Sede "${newSede.nombre}" creada exitosamente`);

    // Reset Form
    setNombreSede('');
    setDireccionSede('');
    setCiudadSede('');
  };

  const handleToggleHabilitado = (id: string) => {
    setSedes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, habilitado: !s.habilitado } : s))
    );
    showToast('Estado de la sede actualizado');
  };

  const handleStartEdit = (sede: Sede) => {
    setEditingSede(sede);
    setEditSedeNombre(sede.nombre);
    setEditSedeCiudad(sede.ciudad);
    setEditSedeDireccion(sede.direccion);
  };

  const handleSaveEditSede = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSede || !editSedeNombre.trim()) return;

    setSedes((prev) =>
      prev.map((s) =>
        s.id === editingSede.id
          ? {
              ...s,
              nombre: editSedeNombre.trim(),
              ciudad: editSedeCiudad || s.ciudad,
              direccion: editSedeDireccion.trim() || s.direccion
            }
          : s
      )
    );

    showToast(`Sede "${editSedeNombre}" actualizada`);
    setEditingSede(null);
  };

  const handleToggleAreaInSede = (areaId: string) => {
    if (!organizacionSede) return;
    const exists = organizacionSede.areasAsociadas.includes(areaId);
    const updatedAreas = exists
      ? organizacionSede.areasAsociadas.filter((id) => id !== areaId)
      : [...organizacionSede.areasAsociadas, areaId];

    setOrganizacionSede({
      ...organizacionSede,
      areasAsociadas: updatedAreas
    });

    setSedes((prev) =>
      prev.map((s) => (s.id === organizacionSede.id ? { ...s, areasAsociadas: updatedAreas } : s))
    );
    showToast('Áreas asociadas actualizadas');
  };

  const handleCreateArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaAreaNombre.trim()) return;
    const newArea: AreaItem = {
      id: `area-${Date.now()}`,
      codigo: `AREA_${String(areas.length + 1).padStart(3, '0')}`,
      nombre: nuevaAreaNombre.trim(),
      departamento: nuevaAreaDepto.trim() || 'General',
      habilitado: true
    };
    setAreas([...areas, newArea]);
    setNuevaAreaNombre('');
    setNuevaAreaDepto('');
    showToast(`Área "${newArea.nombre}" creada`);
  };

  const handleCreateDepartamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoDeptoNombre.trim()) return;
    const newDepto: DepartamentoItem = {
      id: `depto-${Date.now()}`,
      codigo: `DEP_${String(departamentos.length + 1).padStart(3, '0')}`,
      nombre: nuevoDeptoNombre.trim(),
      habilitado: true
    };
    setDepartamentos([...departamentos, newDepto]);
    setNuevoDeptoNombre('');
    showToast(`Departamento "${newDepto.nombre}" creado`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-800">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-12 right-6 z-50 bg-[#4338ca] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Breadcrumb: VOLVER A CONFIGURACIÓN */}
      <div>
        <button
          type="button"
          onClick={() => setActiveMenu('mi-empresa')}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VOLVER A CONFIGURACIÓN</span>
        </button>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          Sedes
        </h1>
        <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
          ADMINISTRA LAS SEDES, ÁREAS Y DEPARTAMENTOS DE TU EMPRESA
        </p>
      </div>

      {/* TABS NAVIGATION (Matching Screenshot Exactly) */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {/* Tab 1: Sedes (1) */}
        <button
          type="button"
          onClick={() => setActiveTab('sedes')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'sedes'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Sedes</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {sedes.length}
          </span>
        </button>

        {/* Tab 2: Áreas (15) */}
        <button
          type="button"
          onClick={() => setActiveTab('areas')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'areas'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Áreas</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {areas.length}
          </span>
        </button>

        {/* Tab 3: Departamentos (0) */}
        <button
          type="button"
          onClick={() => setActiveTab('departamentos')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'departamentos'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Departamentos</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {departamentos.length}
          </span>
        </button>
      </div>

      {/* INFO NOTICE (Matching Screenshot Exactly) */}
      <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100/80 p-4 flex items-center gap-3 text-xs text-indigo-950/80">
        <Info className="w-4 h-4 text-indigo-600 shrink-0" />
        <p className="text-[11px] leading-relaxed">
          Aquí registras las ubicaciones de tu empresa. Con el botón <span className="font-bold text-indigo-950">Organización</span> de cada sede le asocias las áreas y departamentos que creaste en las otras pestañas.
        </p>
      </div>

      {/* TAB 1: SEDES (Matching Screenshot Layout) */}
      {activeTab === 'sedes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Nueva Sede Form (4 cols on lg) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-4 h-4 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900">
                Nueva Sede
              </h2>
            </div>

            <form onSubmit={handleCreateSede} className="space-y-4 text-xs">
              {/* CÓDIGO */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CÓDIGO
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentSedeCode}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-600 focus:outline-none cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">
                  Se asigna automáticamente y no se puede modificar.
                </p>
              </div>

              {/* NOMBRE * */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NOMBRE *
                </label>
                <input
                  type="text"
                  required
                  value={nombreSede}
                  onChange={(e) => setNombreSede(e.target.value)}
                  placeholder="Nombre de la sede"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                />
              </div>

              {/* DIRECCIÓN * */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  DIRECCIÓN *
                </label>
                <input
                  type="text"
                  required
                  value={direccionSede}
                  onChange={(e) => setDireccionSede(e.target.value)}
                  placeholder="Dirección de la sede"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                />
              </div>

              {/* CIUDAD * */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CIUDAD *
                </label>
                <div className="relative">
                  <select
                    required
                    value={ciudadSede}
                    onChange={(e) => setCiudadSede(e.target.value)}
                    className="w-full appearance-none bg-white text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer pr-8"
                  >
                    <option value="">Selecciona una ciudad</option>
                    <option value="Girón">Girón</option>
                    <option value="Bucaramanga">Bucaramanga</option>
                    <option value="Floridablanca">Floridablanca</option>
                    <option value="Piedecuesta">Piedecuesta</option>
                    <option value="Bogotá D.C.">Bogotá D.C.</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                    <option value="Barranquilla">Barranquilla</option>
                    <option value="Cartagena">Cartagena</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* CREAR SEDE Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>CREAR SEDE</span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Table of Sedes (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-5">CÓDIGO</th>
                    <th className="py-4 px-5">NOMBRE</th>
                    <th className="py-4 px-5">CIUDAD - DIRECCIÓN</th>
                    <th className="py-4 px-4 text-center">HABILITADO</th>
                    <th className="py-4 px-5 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sedes.map((sede) => (
                    <tr key={sede.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* CÓDIGO */}
                      <td className="py-4 px-5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {sede.codigo}
                      </td>

                      {/* NOMBRE */}
                      <td className="py-4 px-5 font-semibold text-slate-900 whitespace-nowrap">
                        {sede.nombre}
                      </td>

                      {/* CIUDAD - DIRECCIÓN */}
                      <td className="py-4 px-5 text-slate-600 leading-relaxed max-w-md">
                        <span className="font-bold text-slate-900">{sede.ciudad}</span>
                        {' - '}
                        <span>{sede.direccion}</span>
                      </td>

                      {/* HABILITADO */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleHabilitado(sede.id)}
                          className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${
                            sede.habilitado ? 'bg-indigo-600 justify-end' : 'bg-slate-200 justify-start'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                        </button>
                      </td>

                      {/* ACCIONES */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Editar Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(sede)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-500" />
                            <span>Editar</span>
                          </button>

                          {/* Organización Button */}
                          <button
                            type="button"
                            onClick={() => setOrganizacionSede(sede)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-slate-500" />
                            <span>Organización</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ÁREAS (15 items) */}
      {activeTab === 'areas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Nueva Área */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Network className="w-4 h-4 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900">
                Nueva Área
              </h2>
            </div>

            <form onSubmit={handleCreateArea} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NOMBRE DEL ÁREA *
                </label>
                <input
                  type="text"
                  required
                  value={nuevaAreaNombre}
                  onChange={(e) => setNuevaAreaNombre(e.target.value)}
                  placeholder="Ej: Contabilidad y Finanzas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  DEPARTAMENTO
                </label>
                <input
                  type="text"
                  value={nuevaAreaDepto}
                  onChange={(e) => setNuevaAreaDepto(e.target.value)}
                  placeholder="Ej: Finanzas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Área</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Table of Áreas */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Áreas Registradas ({areas.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">CÓDIGO</th>
                    <th className="py-3 px-4">NOMBRE</th>
                    <th className="py-3 px-4">DEPARTAMENTO</th>
                    <th className="py-3 px-4 text-center">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {areas.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                        {a.codigo}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {a.nombre}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {a.departamento}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ACTIVO
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTAMENTOS (0 items) */}
      {activeTab === 'departamentos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Nuevo Departamento */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <GitFork className="w-4 h-4 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900">
                Nuevo Departamento
              </h2>
            </div>

            <form onSubmit={handleCreateDepartamento} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NOMBRE DEL DEPARTAMENTO *
                </label>
                <input
                  type="text"
                  required
                  value={nuevoDeptoNombre}
                  onChange={(e) => setNuevoDeptoNombre(e.target.value)}
                  placeholder="Ej: Operaciones"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Departamento</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Empty State / List */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {departamentos.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mx-auto mb-2">
                  <GitFork className="w-6 h-6 text-slate-300" />
                </div>
                <div className="font-bold text-xs text-slate-700">
                  No hay departamentos configurados.
                </div>
                <div className="text-[11px] text-slate-400">
                  Crea uno usando el formulario de la izquierda.
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">CÓDIGO</th>
                      <th className="py-3 px-4">NOMBRE</th>
                      <th className="py-3 px-4 text-center">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departamentos.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                          {d.codigo}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {d.nombre}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ACTIVO
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: "Editar Sede" */}
      {editingSede && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                Editar Sede
              </h3>
              <button
                type="button"
                onClick={() => setEditingSede(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSede} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CÓDIGO
                </label>
                <input
                  type="text"
                  readOnly
                  value={editingSede.codigo}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-700 text-xs cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NOMBRE DE LA SEDE
                </label>
                <input
                  type="text"
                  required
                  value={editSedeNombre}
                  onChange={(e) => setEditSedeNombre(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-500 ring-2 ring-indigo-100 text-slate-900 font-medium text-xs focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CIUDAD
                </label>
                <input
                  type="text"
                  required
                  value={editSedeCiudad}
                  onChange={(e) => setEditSedeCiudad(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  DIRECCIÓN
                </label>
                <input
                  type="text"
                  required
                  value={editSedeDireccion}
                  onChange={(e) => setEditSedeDireccion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSede(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: "Organización de la Sede" (Associate Áreas) */}
      {organizacionSede && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Organización: {organizacionSede.nombre}
                </h3>
                <p className="text-xs text-slate-400">
                  Selecciona las áreas activas en esta sede
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOrganizacionSede(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {areas.map((area) => {
                const isChecked = organizacionSede.areasAsociadas.includes(area.id);
                return (
                  <label
                    key={area.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleAreaInSede(area.id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{area.nombre}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {area.codigo} · Depto: {area.departamento}
                        </div>
                      </div>
                    </div>
                    {isChecked && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        Asignada
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setOrganizacionSede(null)}
                className="px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
