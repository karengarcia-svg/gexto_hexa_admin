import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Paperclip,
  Plus,
  GripVertical,
  Pencil,
  Ban,
  Lock,
  Check,
  ChevronDown,
  Info,
  ArrowLeft,
  FileText,
  Landmark,
  FileBadge,
  FileCheck,
  ShoppingCart,
  Calculator,
  MoreHorizontal,
  Scale
} from 'lucide-react';

interface TipoAdjunto {
  id: string;
  nombre: string;
  slug: string;
  iconoKey: string;
  colorName: string;
  colorHex: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
  estado: 'ACTIVO' | 'INACTIVO';
  isLocked?: boolean;
}

export const TiposAdjuntosView: React.FC = () => {
  const { setActiveMenu } = useApp();

  // Form State
  const [formNombre, setFormNombre] = useState('');
  const [formIcono, setFormIcono] = useState('generico');
  const [formColor, setFormColor] = useState('Gris');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Color config map
  const colorMap: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
    'Ámbar': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
    'Azul': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
    'Esmeralda': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'Púrpura': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
    'Índigo': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    'Teal': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', badgeBg: 'bg-teal-50 text-teal-700 border-teal-200' },
    'Rosa': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' },
    'Gris': { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-700', badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' },
    'Rojo': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badgeBg: 'bg-red-50 text-red-700 border-red-200' }
  };

  // 9 initial items exactly matching screenshots 1 & 2
  const [tipos, setTipos] = useState<TipoAdjunto[]>([
    {
      id: 'tipo-1',
      nombre: 'Cuenta de Cobro',
      slug: 'cuenta-de-cobro',
      iconoKey: 'cobro',
      colorName: 'ÁMBAR',
      colorHex: '#d97706',
      bgHex: 'bg-amber-50',
      borderHex: 'border-amber-200',
      textHex: 'text-amber-700',
      estado: 'ACTIVO'
    },
    {
      id: 'tipo-2',
      nombre: 'Certificado Bancario',
      slug: 'certificado-bancario',
      iconoKey: 'banco',
      colorName: 'AZUL',
      colorHex: '#2563eb',
      bgHex: 'bg-blue-50',
      borderHex: 'border-blue-200',
      textHex: 'text-blue-700',
      estado: 'ACTIVO'
    },
    {
      id: 'tipo-3',
      nombre: 'RUT',
      slug: 'rut',
      iconoKey: 'rut',
      colorName: 'ESMERALDA',
      colorHex: '#059669',
      bgHex: 'bg-emerald-50',
      borderHex: 'border-emerald-200',
      textHex: 'text-emerald-700',
      estado: 'ACTIVO'
    },
    {
      id: 'tipo-4',
      nombre: 'Cámara de Comercio',
      slug: 'camara-de-comercio',
      iconoKey: 'camara',
      colorName: 'PÚRPURA',
      colorHex: '#9333ea',
      bgHex: 'bg-purple-50',
      borderHex: 'border-purple-200',
      textHex: 'text-purple-700',
      estado: 'ACTIVO'
    },
    {
      id: 'tipo-5',
      nombre: 'Contrato',
      slug: 'contrato',
      iconoKey: 'contrato',
      colorName: 'ÍNDIGO',
      colorHex: '#4f46e5',
      bgHex: 'bg-indigo-50',
      borderHex: 'border-indigo-200',
      textHex: 'text-indigo-700',
      estado: 'ACTIVO'
    },
    {
      id: 'tipo-6',
      nombre: 'Orden de Compra',
      slug: 'orden-de-compra',
      iconoKey: 'compra',
      colorName: 'TEAL',
      colorHex: '#0d9488',
      bgHex: 'bg-teal-50',
      borderHex: 'border-teal-200',
      textHex: 'text-teal-700',
      estado: 'ACTIVO'
    },
    {
      id: 'tipo-7',
      nombre: 'Cotización',
      slug: 'cotizacion',
      iconoKey: 'cotizacion',
      colorName: 'ROSA',
      colorHex: '#e11d48',
      bgHex: 'bg-rose-50',
      borderHex: 'border-rose-200',
      textHex: 'text-rose-700',
      estado: 'ACTIVO'
    },
    {
      id: 'tipo-8',
      nombre: 'Otro',
      slug: 'otro',
      iconoKey: 'otro',
      colorName: 'GRIS',
      colorHex: '#475569',
      bgHex: 'bg-slate-100',
      borderHex: 'border-slate-200',
      textHex: 'text-slate-700',
      estado: 'ACTIVO',
      isLocked: true // Cannot be deactivated, fallback as stated in screenshot!
    },
    {
      id: 'tipo-9',
      nombre: 'Demanda',
      slug: 'demanda',
      iconoKey: 'demanda',
      colorName: 'ROJO',
      colorHex: '#dc2626',
      bgHex: 'bg-red-50',
      borderHex: 'border-red-200',
      textHex: 'text-red-700',
      estado: 'ACTIVO'
    }
  ]);

  const renderIcon = (key: string, className: string = 'w-4 h-4') => {
    switch (key) {
      case 'cobro':
        return <FileText className={className} />;
      case 'banco':
        return <Landmark className={className} />;
      case 'rut':
        return <FileBadge className={className} />;
      case 'camara':
        return <FileCheck className={className} />;
      case 'contrato':
        return <FileText className={className} />;
      case 'compra':
        return <ShoppingCart className={className} />;
      case 'cotizacion':
        return <Calculator className={className} />;
      case 'demanda':
        return <Scale className={className} />;
      case 'otro':
      default:
        return <MoreHorizontal className={className} />;
    }
  };

  const handleAddOrEditTipo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) return;

    const slug = formNombre
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]+/g, '');

    const colorConfig = colorMap[formColor] || colorMap['Gris'];

    if (editingId) {
      setTipos((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                nombre: formNombre.trim(),
                slug,
                iconoKey: formIcono,
                colorName: formColor.toUpperCase(),
                bgHex: colorConfig.bg,
                borderHex: colorConfig.border,
                textHex: colorConfig.text
              }
            : t
        )
      );
      showToast(`Tipo "${formNombre}" actualizado`);
      setEditingId(null);
    } else {
      const newTipo: TipoAdjunto = {
        id: `tipo-${Date.now()}`,
        nombre: formNombre.trim(),
        slug,
        iconoKey: formIcono,
        colorName: formColor.toUpperCase(),
        colorHex: '#4f46e5',
        bgHex: colorConfig.bg,
        borderHex: colorConfig.border,
        textHex: colorConfig.text,
        estado: 'ACTIVO'
      };
      setTipos([...tipos, newTipo]);
      showToast(`Tipo "${newTipo.nombre}" creado exitosamente`);
    }

    setFormNombre('');
    setFormIcono('generico');
    setFormColor('Gris');
  };

  const handleStartEdit = (t: TipoAdjunto) => {
    setEditingId(t.id);
    setFormNombre(t.nombre);
    setFormIcono(t.iconoKey);
    // Find matching color
    const matchedColor = Object.keys(colorMap).find(
      (c) => c.toUpperCase() === t.colorName
    ) || 'Gris';
    setFormColor(matchedColor);
  };

  const handleToggleEstado = (id: string) => {
    const item = tipos.find((t) => t.id === id);
    if (item?.isLocked) {
      showToast('El tipo "Otro" no se puede desactivar.');
      return;
    }
    setTipos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, estado: t.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' } : t
      )
    );
    showToast('Estado del tipo modificado');
  };

  // Reordering helpers (drag/move up and down)
  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === tipos.length - 1)
    ) {
      return;
    }
    const newTipos = [...tipos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newTipos[index];
    newTipos[index] = newTipos[targetIndex];
    newTipos[targetIndex] = temp;
    setTipos(newTipos);
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
          Tipos de Adjuntos
        </h1>
        <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
          DEFINE LOS TIPOS DE DOCUMENTOS QUE TU EQUIPO PUEDE ADJUNTAR
        </p>
      </div>

      {/* TOP CARD: "Agregar Nuevo Tipo" (Matching Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>{editingId ? 'Editar Tipo de Adjunto' : 'Agregar Nuevo Tipo'}</span>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormNombre('');
                setFormColor('Gris');
                setFormIcono('generico');
              }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 underline cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>

        <form onSubmit={handleAddOrEditTipo} className="space-y-4 text-xs">
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
                placeholder="Ej: Certificado Bancario"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
              />
            </div>

            {/* ÍCONO */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ÍCONO
              </label>
              <div className="relative">
                <select
                  value={formIcono}
                  onChange={(e) => setFormIcono(e.target.value)}
                  className="w-full appearance-none bg-white text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer pr-8"
                >
                  <option value="generico">📄 Archivo genérico</option>
                  <option value="cobro">📄 Cuenta de Cobro</option>
                  <option value="banco">🏛️ Banco / Certificado</option>
                  <option value="rut">📇 RUT / Identificación</option>
                  <option value="camara">📜 Cámara de Comercio</option>
                  <option value="contrato">📋 Contrato</option>
                  <option value="compra">🛒 Orden de Compra</option>
                  <option value="cotizacion">🧮 Cotización</option>
                  <option value="demanda">⚖️ Demanda / Legal</option>
                  <option value="otro">⋯ Otro documento</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* COLOR */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                COLOR
              </label>
              <div className="relative">
                <select
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-full appearance-none bg-white text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer pr-8"
                >
                  <option value="Gris">Gris</option>
                  <option value="Ámbar">Ámbar</option>
                  <option value="Azul">Azul</option>
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
              <span>{editingId ? 'Guardar Cambios' : 'Agregar Tipo'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* BOTTOM CARD: "Tipos Configurados" (Matching Screenshots 1 & 2) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Tipos Configurados
            </h3>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {tipos.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <GripVertical className="w-3.5 h-3.5 text-slate-400" />
            <span>Arrastra para reordenar</span>
          </div>
        </div>

        {/* List of items */}
        <div className="space-y-2.5">
          {tipos.map((tipo, index) => (
            <div
              key={tipo.id}
              className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
            >
              {/* Left: Grip Handle + Icon Square + Name/Slug */}
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
                    disabled={index === tipos.length - 1}
                    className="hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
                    title="Mover abajo"
                  >
                    ▼
                  </button>
                </div>

                {/* Icon square matching color */}
                <div
                  className={`w-9 h-9 rounded-xl ${tipo.bgHex} border ${tipo.borderHex} ${tipo.textHex} flex items-center justify-center shrink-0 font-bold`}
                >
                  {renderIcon(tipo.iconoKey, 'w-4 h-4')}
                </div>

                <div>
                  <div className="font-bold text-slate-900 leading-tight">
                    {tipo.nombre}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {tipo.slug}
                  </div>
                </div>
              </div>

              {/* Right: Color Badge + Estado Badge + Actions */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Color badge */}
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase ${
                    colorMap[tipo.colorName.charAt(0) + tipo.colorName.slice(1).toLowerCase()]?.badgeBg ||
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {tipo.colorName}
                </span>

                {/* Estado badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    tipo.estado === 'ACTIVO'
                      ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {tipo.estado}
                </span>

                {/* Actions: Edit + Inactivate */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(tipo)}
                    className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                    title="Editar tipo"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {tipo.isLocked ? (
                    <div
                      className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed"
                      title="El tipo Otro no se puede desactivar"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleEstado(tipo.id)}
                      className="w-7 h-7 rounded-lg border border-amber-200 text-amber-500 hover:bg-amber-50 flex items-center justify-center transition-colors cursor-pointer"
                      title={tipo.estado === 'ACTIVO' ? 'Desactivar tipo' : 'Activar tipo'}
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
              Los tipos que definas aquí aparecerán como opciones al adjuntar documentos en facturas y proveedores.
            </li>
            <li>
              El tipo <span className="font-semibold text-indigo-950">"Otro"</span> siempre estará disponible como fallback y no se puede desactivar.
            </li>
            <li>
              Desactivar un tipo no elimina los documentos existentes con ese tipo asignado.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
