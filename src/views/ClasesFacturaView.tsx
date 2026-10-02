import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardList,
  Plus,
  GripVertical,
  Pencil,
  Ban,
  Lock,
  Check,
  ChevronDown,
  Info,
  ArrowLeft,
  X
} from 'lucide-react';

interface ClaseFactura {
  id: string;
  nombre: string;
  codigoCorto: string;
  colorName: string;
  colorHex: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
  estado: 'ACTIVA' | 'INACTIVA';
  isLocked?: boolean;
}

export const ClasesFacturaView: React.FC = () => {
  const { setActiveMenu } = useApp();

  // Form State for creating new
  const [formNombre, setFormNombre] = useState('');
  const [formCodigo, setFormCodigo] = useState('');
  const [formColor, setFormColor] = useState('Gris');

  // Modal Edit State (Matching Uploaded Screenshot)
  const [editingItem, setEditingItem] = useState<ClaseFactura | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCodigo, setEditCodigo] = useState('');
  const [editColor, setEditColor] = useState('Azul');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Color config map
  const colorMap: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
    'Azul': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
    'Ámbar': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
    'Esmeralda': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'Púrpura': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
    'Índigo': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    'Teal': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', badgeBg: 'bg-teal-50 text-teal-700 border-teal-200' },
    'Rosa': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' },
    'Gris': { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-700', badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' },
    'Rojo': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badgeBg: 'bg-red-50 text-red-700 border-red-200' }
  };

  // 6 initial classifications exactly matching screenshots 1 & 2
  const [clases, setClases] = useState<ClaseFactura[]>([
    {
      id: 'clase-1',
      nombre: 'Gastos Operacionales',
      codigoCorto: 'GO',
      colorName: 'AZUL',
      colorHex: '#2563eb',
      bgHex: 'bg-blue-50',
      borderHex: 'border-blue-200',
      textHex: 'text-blue-700',
      estado: 'ACTIVA'
    },
    {
      id: 'clase-2',
      nombre: 'Costos de Ventas',
      codigoCorto: 'CV',
      colorName: 'ÁMBAR',
      colorHex: '#d97706',
      bgHex: 'bg-amber-50',
      borderHex: 'border-amber-200',
      textHex: 'text-amber-700',
      estado: 'ACTIVA'
    },
    {
      id: 'clase-3',
      nombre: 'Activos Fijos / Capex',
      codigoCorto: 'AF',
      colorName: 'ESMERALDA',
      colorHex: '#059669',
      bgHex: 'bg-emerald-50',
      borderHex: 'border-emerald-200',
      textHex: 'text-emerald-700',
      estado: 'ACTIVA'
    },
    {
      id: 'clase-4',
      nombre: 'Gastos Administrativos',
      codigoCorto: 'GA',
      colorName: 'PÚRPURA',
      colorHex: '#9333ea',
      bgHex: 'bg-purple-50',
      borderHex: 'border-purple-200',
      textHex: 'text-purple-700',
      estado: 'ACTIVA'
    },
    {
      id: 'clase-5',
      nombre: 'Gastos de Personal',
      codigoCorto: 'GP',
      colorName: 'ÍNDIGO',
      colorHex: '#4f46e5',
      bgHex: 'bg-indigo-50',
      borderHex: 'border-indigo-200',
      textHex: 'text-indigo-700',
      estado: 'ACTIVA'
    },
    {
      id: 'clase-6',
      nombre: 'Otros / No Especificado',
      codigoCorto: 'OT',
      colorName: 'GRIS',
      colorHex: '#475569',
      bgHex: 'bg-slate-100',
      borderHex: 'border-slate-200',
      textHex: 'text-slate-700',
      estado: 'ACTIVA',
      isLocked: true // Default fallback, cannot be deactivated as stated in screenshot
    }
  ]);

  const handleCreateClase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim() || !formCodigo.trim()) return;

    const shortCode = formCodigo.trim().toUpperCase();
    const colorConfig = colorMap[formColor] || colorMap['Gris'];

    const newClase: ClaseFactura = {
      id: `clase-${Date.now()}`,
      nombre: formNombre.trim(),
      codigoCorto: shortCode,
      colorName: formColor.toUpperCase(),
      colorHex: '#4f46e5',
      bgHex: colorConfig.bg,
      borderHex: colorConfig.border,
      textHex: colorConfig.text,
      estado: 'ACTIVA'
    };
    setClases([...clases, newClase]);
    showToast(`Clasificación "${newClase.nombre}" creada exitosamente`);

    setFormNombre('');
    setFormCodigo('');
    setFormColor('Gris');
  };

  const handleStartEdit = (c: ClaseFactura) => {
    setEditingItem(c);
    setEditNombre(c.nombre);
    setEditCodigo(c.codigoCorto);
    const matchedColor = Object.keys(colorMap).find(
      (color) => color.toUpperCase() === c.colorName
    ) || 'Azul';
    setEditColor(matchedColor);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editNombre.trim()) return;

    const shortCode = editCodigo.trim().toUpperCase() || editingItem.codigoCorto;
    const colorConfig = colorMap[editColor] || colorMap['Azul'];

    setClases((prev) =>
      prev.map((c) =>
        c.id === editingItem.id
          ? {
              ...c,
              nombre: editNombre.trim(),
              codigoCorto: shortCode,
              colorName: editColor.toUpperCase(),
              bgHex: colorConfig.bg,
              borderHex: colorConfig.border,
              textHex: colorConfig.text
            }
          : c
      )
    );
    showToast(`Clasificación "${editNombre}" actualizada`);
    setEditingItem(null);
  };

  const handleToggleEstado = (id: string) => {
    const item = clases.find((c) => c.id === id);
    if (item?.isLocked) {
      showToast('La clasificación "Otros" siempre estará activa por defecto.');
      return;
    }
    setClases((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, estado: c.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA' } : c
      )
    );
    showToast('Estado de la clasificación modificado');
  };

  // Reordering helpers (drag/move up and down)
  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === clases.length - 1)
    ) {
      return;
    }
    const newClases = [...clases];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newClases[index];
    newClases[index] = newClases[targetIndex];
    newClases[targetIndex] = temp;
    setClases(newClases);
    showToast('Orden actualizado');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans text-slate-800">
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
          Clases de Factura
        </h1>
        <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
          DEFINE LAS CATEGORÍAS O CLASIFICACIONES PARA LAS FACTURAS DE TU EMPRESA
        </p>
      </div>

      {/* TOP CARD: "Agregar Nueva Clasificación" (Matching Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Agregar Nueva Clasificación</span>
          </div>
        </div>

        <form onSubmit={handleCreateClase} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* NOMBRE * */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                NOMBRE *
              </label>
              <input
                type="text"
                required
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
                placeholder="Ej: Gasto Operativo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
              />
            </div>

            {/* CÓDIGO (CORTO) * */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                CÓDIGO (CORTO) *
              </label>
              <input
                type="text"
                required
                value={formCodigo}
                onChange={(e) => setFormCodigo(e.target.value)}
                placeholder="EJ: GO"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 uppercase font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* COLOR BADGE */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                COLOR BADGE
              </label>
              <div className="relative">
                <select
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-full appearance-none bg-white text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer pr-8"
                >
                  <option value="Gris">Gris</option>
                  <option value="Azul">Azul</option>
                  <option value="Ámbar">Ámbar</option>
                  <option value="Esmeralda">Esmeralda</option>
                  <option value="Púrpura">Púrpura</option>
                  <option value="Índigo">Índigo</option>
                  <option value="Teal">Teal</option>
                  <option value="Rosa">Rosa</option>
                  <option value="Rojo">Rojo</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Submit button on bottom right */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Clasificación</span>
            </button>
          </div>
        </form>
      </div>

      {/* BOTTOM CARD: "Clasificaciones Configuradas" (Matching Screenshots 1 & 2) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Clasificaciones Configuradas
            </h3>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {clases.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <GripVertical className="w-3.5 h-3.5 text-slate-400" />
            <span>Arrastra para reordenar</span>
          </div>
        </div>

        {/* List of items */}
        <div className="space-y-2.5">
          {clases.map((clase, index) => (
            <div
              key={clase.id}
              className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
            >
              {/* Left: Grip Handle + Code Badge Box + Name/Code */}
              <div className="flex items-center gap-3.5">
                {/* Grip Handle with up/down arrows for easy reordering */}
                <div className="flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-slate-600 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
                    title="Mover arriba"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === clases.length - 1}
                    className="hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
                    title="Mover abajo"
                  >
                    ▼
                  </button>
                </div>

                {/* Short Code Badge Box */}
                <div
                  className={`w-9 h-9 rounded-xl ${clase.bgHex} border ${clase.borderHex} ${clase.textHex} flex items-center justify-center shrink-0 font-bold font-mono text-xs`}
                >
                  {clase.codigoCorto}
                </div>

                <div>
                  <div className="font-bold text-slate-900 leading-tight">
                    {clase.nombre}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Código: {clase.codigoCorto}
                  </div>
                </div>
              </div>

              {/* Right: Color Badge + Estado Badge + Actions */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Color badge */}
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase ${
                    colorMap[clase.colorName.charAt(0) + clase.colorName.slice(1).toLowerCase()]?.badgeBg ||
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {clase.colorName}
                </span>

                {/* Estado badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    clase.estado === 'ACTIVA'
                      ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {clase.estado}
                </span>

                {/* Actions: Edit + Inactivate */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(clase)}
                    className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                    title="Editar clasificación"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {clase.isLocked ? (
                    <div
                      className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed"
                      title="La clasificación Otros siempre estará activa por defecto"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleEstado(clase.id)}
                      className="w-7 h-7 rounded-lg border border-amber-200 text-amber-500 hover:bg-amber-50 flex items-center justify-center transition-colors cursor-pointer"
                      title={clase.estado === 'ACTIVA' ? 'Desactivar clasificación' : 'Activar clasificación'}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INFO CALLOUT: "¿Cómo funciona?" (Matching Screenshot 2) */}
      <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100/80 p-5 flex items-start gap-3.5 text-xs">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-indigo-950/80">
          <h4 className="font-bold text-xs text-indigo-900">
            ¿Cómo funciona?
          </h4>
          <ul className="space-y-1 text-[11px] leading-relaxed text-indigo-800/90 list-disc list-inside">
            <li>
              Las clases de factura te permiten segmentar gastos y costos en tus flujos de trabajo administrativos.
            </li>
            <li>
              El código identifica de forma corta la clasificación (ej. <span className="font-semibold text-indigo-950">GO</span> para Gastos Operativos).
            </li>
            <li>
              La clasificación <span className="font-semibold text-indigo-950">"Otros"</span> (código: <span className="font-semibold text-indigo-950">OT</span>) siempre estará activa por defecto.
            </li>
          </ul>
        </div>
      </div>

      {/* MODAL: "Editar Clasificación de Factura" (Matching Uploaded Screenshot Exactly) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                Editar Clasificación de Factura
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* NOMBRE */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NOMBRE
                </label>
                <input
                  type="text"
                  required
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-500 ring-2 ring-indigo-100 text-slate-900 font-medium text-xs focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Row: CÓDIGO + COLOR */}
              <div className="grid grid-cols-2 gap-4">
                {/* CÓDIGO */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    CÓDIGO
                  </label>
                  <input
                    type="text"
                    value={editCodigo}
                    onChange={(e) => setEditCodigo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 uppercase"
                  />
                </div>

                {/* COLOR */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    COLOR
                  </label>
                  <div className="relative">
                    <select
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-full appearance-none bg-white text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer pr-8"
                    >
                      <option value="Azul">Azul</option>
                      <option value="Ámbar">Ámbar</option>
                      <option value="Esmeralda">Esmeralda</option>
                      <option value="Púrpura">Púrpura</option>
                      <option value="Índigo">Índigo</option>
                      <option value="Teal">Teal</option>
                      <option value="Rosa">Rosa</option>
                      <option value="Gris">Gris</option>
                      <option value="Rojo">Rojo</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
    </div>
  );
};
