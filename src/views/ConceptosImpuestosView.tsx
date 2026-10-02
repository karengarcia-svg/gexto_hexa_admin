import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Percent,
  Plus,
  Settings,
  Save,
  Check,
  ChevronDown,
  ArrowLeft,
  Receipt,
  FileSpreadsheet,
  Pencil,
  Ban,
  Trash2,
  X,
  FileText
} from 'lucide-react';

interface ConceptoRetencion {
  id: string;
  nombre: string;
  tipo: string;
  tipoCorto: 'RENTA' | 'RETEIVA' | 'RETEICA' | 'OTRO';
  tarifa: number;
  baseMinimaUvt: number;
  codigoDane?: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export const ConceptosImpuestosView: React.FC = () => {
  const { setActiveMenu } = useApp();

  // Left Card: Perfil Tributario State
  const [valorUvt, setValorUvt] = useState('50471');
  const [regimenFiscal, setRegimenFiscal] = useState('Régimen Ordinario / Común');
  const [esAgenteRetencion, setEsAgenteRetencion] = useState(true);

  // Right Card: Form State for New Concept
  const [nombreConcepto, setNombreConcepto] = useState('');
  const [tipoRetencion, setTipoRetencion] = useState('Retención en la Fuente (Renta)');
  const [tarifa, setTarifa] = useState('');
  const [baseMinimaUvt, setBaseMinimaUvt] = useState('0');
  const [codigoDane, setCodigoDane] = useState('');

  // Editing Concept Modal State
  const [editingConcepto, setEditingConcepto] = useState<ConceptoRetencion | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editTipo, setEditTipo] = useState('');
  const [editTarifa, setEditTarifa] = useState('');
  const [editBaseUvt, setEditBaseUvt] = useState('');
  const [editDane, setEditDane] = useState('');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Conceptos List (starts at 0 as in screenshot)
  const [conceptos, setConceptos] = useState<ConceptoRetencion[]>([]);

  const handleSavePerfil = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Perfil tributario guardado correctamente');
  };

  const mapTipoCorto = (tipo: string): 'RENTA' | 'RETEIVA' | 'RETEICA' | 'OTRO' => {
    if (tipo.includes('Renta') || tipo.includes('Fuente')) return 'RENTA';
    if (tipo.includes('IVA')) return 'RETEIVA';
    if (tipo.includes('ICA')) return 'RETEICA';
    return 'OTRO';
  };

  const handleAddConcepto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreConcepto.trim()) {
      alert('Ingresa el nombre del concepto');
      return;
    }
    const parsedTarifa = parseFloat(tarifa);
    if (isNaN(parsedTarifa) || parsedTarifa < 0) {
      alert('Ingresa una tarifa válida en %');
      return;
    }

    const newConcepto: ConceptoRetencion = {
      id: `conc-${Date.now()}`,
      nombre: nombreConcepto.trim(),
      tipo: tipoRetencion,
      tipoCorto: mapTipoCorto(tipoRetencion),
      tarifa: parsedTarifa,
      baseMinimaUvt: parseFloat(baseMinimaUvt) || 0,
      codigoDane: codigoDane.trim() || undefined,
      estado: 'ACTIVO'
    };

    setConceptos([...conceptos, newConcepto]);
    showToast(`Concepto "${newConcepto.nombre}" agregado exitosamente`);

    // Reset Form
    setNombreConcepto('');
    setTarifa('');
    setBaseMinimaUvt('0');
    setCodigoDane('');
  };

  const handleStartEdit = (conc: ConceptoRetencion) => {
    setEditingConcepto(conc);
    setEditNombre(conc.nombre);
    setEditTipo(conc.tipo);
    setEditTarifa(String(conc.tarifa));
    setEditBaseUvt(String(conc.baseMinimaUvt));
    setEditDane(conc.codigoDane || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConcepto || !editNombre.trim()) return;

    const parsedTarifa = parseFloat(editTarifa);
    if (isNaN(parsedTarifa) || parsedTarifa < 0) {
      alert('Ingresa una tarifa válida');
      return;
    }

    setConceptos((prev) =>
      prev.map((c) =>
        c.id === editingConcepto.id
          ? {
              ...c,
              nombre: editNombre.trim(),
              tipo: editTipo,
              tipoCorto: mapTipoCorto(editTipo),
              tarifa: parsedTarifa,
              baseMinimaUvt: parseFloat(editBaseUvt) || 0,
              codigoDane: editDane.trim() || undefined
            }
          : c
      )
    );

    showToast(`Concepto "${editNombre}" actualizado`);
    setEditingConcepto(null);
  };

  const handleToggleEstado = (id: string) => {
    setConceptos((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, estado: c.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' } : c
      )
    );
    showToast('Estado del concepto modificado');
  };

  const handleDeleteConcepto = (id: string) => {
    setConceptos((prev) => prev.filter((c) => c.id !== id));
    showToast('Concepto eliminado');
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
          Impuestos y Retenciones
        </h1>
        <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
          PARÁMETROS TRIBUTARIOS DE COLOMBIA Y TABLA DE CONCEPTOS DE RETENCIÓN
        </p>
      </div>

      {/* TOP SECTION: 2 Cards Side-by-Side (Matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT CARD: Perfil Tributario (approx 4.5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900">
              Perfil Tributario
            </h2>
          </div>

          <form onSubmit={handleSavePerfil} className="space-y-4 text-xs">
            {/* VALOR UVT (COP) * */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                VALOR UVT (COP) *
              </label>
              <input
                type="text"
                required
                value={valorUvt}
                onChange={(e) => setValorUvt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
              <p className="text-[11px] text-slate-400">
                Año en curso en Colombia
              </p>
            </div>

            {/* RÉGIMEN FISCAL * */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                RÉGIMEN FISCAL *
              </label>
              <div className="relative">
                <select
                  value={regimenFiscal}
                  onChange={(e) => setRegimenFiscal(e.target.value)}
                  className="w-full appearance-none bg-white text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer pr-8"
                >
                  <option value="Régimen Ordinario / Común">Régimen Ordinario / Común</option>
                  <option value="Régimen Simple de Tributación (RST)">Régimen Simple de Tributación (RST)</option>
                  <option value="Gran Contribuyente">Gran Contribuyente</option>
                  <option value="Autorretenedor de Renta">Autorretenedor de Renta</option>
                  <option value="No Responsable de IVA">No Responsable de IVA</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Checkbox: ¿AGENTE DE RETENCIÓN? */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esAgenteRetencion}
                  onChange={(e) => setEsAgenteRetencion(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  ¿AGENTE DE RETENCIÓN?
                </span>
              </label>
            </div>

            {/* Botón: Guardar Perfil */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Perfil</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT CARD: Agregar Concepto de Retención (approx 7.5 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Plus className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900">
              Agregar Concepto de Retención
            </h2>
          </div>

          <form onSubmit={handleAddConcepto} className="space-y-4 text-xs">
            {/* Row 1: NOMBRE DEL CONCEPTO * + TIPO DE RETENCIÓN * */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NOMBRE DEL CONCEPTO *
                </label>
                <input
                  type="text"
                  required
                  value={nombreConcepto}
                  onChange={(e) => setNombreConcepto(e.target.value)}
                  placeholder="Ej: Compras declarantes 2.5%"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TIPO DE RETENCIÓN *
                </label>
                <div className="relative">
                  <select
                    value={tipoRetencion}
                    onChange={(e) => setTipoRetencion(e.target.value)}
                    className="w-full appearance-none bg-white text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer pr-8"
                  >
                    <option value="Retención en la Fuente (Renta)">Retención en la Fuente (Renta)</option>
                    <option value="Retención en la Fuente (IVA)">Retención en la Fuente (IVA)</option>
                    <option value="Retención en la Fuente (ICA)">Retención en la Fuente (ICA)</option>
                    <option value="Otras Retenciones">Otras Retenciones</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: TARIFA % * + BASE MÍNIMA (UVT) + CÓD. MUNICIPIO DANE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TARIFA % *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={tarifa}
                  onChange={(e) => setTarifa(e.target.value)}
                  placeholder="Ej: 2.5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  BASE MÍNIMA (UVT)
                </label>
                <input
                  type="number"
                  value={baseMinimaUvt}
                  onChange={(e) => setBaseMinimaUvt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CÓD. MUNICIPIO DANE
                </label>
                <input
                  type="text"
                  value={codigoDane}
                  onChange={(e) => setCodigoDane(e.target.value)}
                  placeholder="Opcional (Ej: 11001)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                />
              </div>
            </div>

            {/* Submit button on bottom right */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Concepto</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* BOTTOM CARD: "Conceptos de Retención Configurados" (Matching Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Conceptos de Retención Configurados
            </h3>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {conceptos.length}
            </span>
          </div>
        </div>

        {conceptos.length === 0 ? (
          /* Empty State (Matching Screenshot Exactly) */
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
              <Receipt className="w-6 h-6 text-slate-300" />
            </div>
            <h4 className="font-bold text-xs text-slate-700">
              No hay conceptos de retención configurados.
            </h4>
            <p className="text-[11px] text-slate-400">
              Crea el primero usando el formulario de arriba.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">CONCEPTO</th>
                  <th className="py-3 px-4">TIPO DE RETENCIÓN</th>
                  <th className="py-3 px-4 text-center">TARIFA</th>
                  <th className="py-3 px-4 text-center">BASE MÍNIMA</th>
                  <th className="py-3 px-4 text-center">CÓD. DANE</th>
                  <th className="py-3 px-4 text-center">ESTADO</th>
                  <th className="py-3 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {conceptos.map((conc) => (
                  <tr key={conc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {conc.nombre}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {conc.tipo}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-700">
                      {conc.tarifa}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                      {conc.baseMinimaUvt} UVT
                      <span className="text-[10px] text-slate-400 block font-normal">
                        (${((conc.baseMinimaUvt * parseFloat(valorUvt || '0')) || 0).toLocaleString('es-CO')})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                      {conc.codigoDane || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          conc.estado === 'ACTIVO'
                            ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {conc.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(conc)}
                          className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Editar concepto"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleEstado(conc.id)}
                          className="w-7 h-7 rounded-lg border border-amber-200 text-amber-500 hover:bg-amber-50 flex items-center justify-center transition-colors cursor-pointer"
                          title={conc.estado === 'ACTIVO' ? 'Desactivar concepto' : 'Activar concepto'}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteConcepto(conc.id)}
                          className="w-7 h-7 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Eliminar concepto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: "Editar Concepto de Retención" */}
      {editingConcepto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                Editar Concepto de Retención
              </h3>
              <button
                type="button"
                onClick={() => setEditingConcepto(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NOMBRE DEL CONCEPTO
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

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TIPO DE RETENCIÓN
                </label>
                <div className="relative">
                  <select
                    value={editTipo}
                    onChange={(e) => setEditTipo(e.target.value)}
                    className="w-full appearance-none bg-white text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer pr-8"
                  >
                    <option value="Retención en la Fuente (Renta)">Retención en la Fuente (Renta)</option>
                    <option value="Retención en la Fuente (IVA)">Retención en la Fuente (IVA)</option>
                    <option value="Retención en la Fuente (ICA)">Retención en la Fuente (ICA)</option>
                    <option value="Otras Retenciones">Otras Retenciones</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    TARIFA %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editTarifa}
                    onChange={(e) => setEditTarifa(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    BASE UVT
                  </label>
                  <input
                    type="number"
                    value={editBaseUvt}
                    onChange={(e) => setEditBaseUvt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    CÓD. DANE
                  </label>
                  <input
                    type="text"
                    value={editDane}
                    onChange={(e) => setEditDane(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingConcepto(null)}
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
