import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Boxes,
  Package,
  Search,
  Plus,
  Trash2,
  Check,
  Eye,
  Pencil,
  Ban,
  X,
  Tag,
  Hash
} from 'lucide-react';

interface InventarioItem {
  id: string;
  codigo: string;
  nombre: string;
  unidades: string[];
  cantidad: number;
  estado: 'ACTIVO' | 'INACTIVO';
}

export const InventarioView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [nextCodeNum, setNextCodeNum] = useState(1);
  const currentCode = `ART_${String(nextCodeNum).padStart(6, '0')}`;
  const [nombre, setNombre] = useState('');
  const [unidades, setUnidades] = useState<string[]>(['']);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<InventarioItem | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Inventory items state (starts empty as in screenshot)
  const [items, setItems] = useState<InventarioItem[]>([]);

  const handleAddUnitField = () => {
    setUnidades([...unidades, '']);
  };

  const handleRemoveUnitField = (index: number) => {
    if (unidades.length <= 1) {
      setUnidades(['']);
    } else {
      setUnidades(unidades.filter((_, i) => i !== index));
    }
  };

  const handleUnitChange = (index: number, val: string) => {
    const next = [...unidades];
    next[index] = val;
    setUnidades(next);
  };

  const handleCreateOrUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('Ingresa el nombre del artículo');
      return;
    }

    const cleanUnits = unidades.map((u) => u.trim()).filter(Boolean);

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                nombre: nombre.trim(),
                unidades: cleanUnits,
                cantidad: cleanUnits.length
              }
            : item
        )
      );
      showToast(`Artículo "${nombre}" actualizado`);
      setEditingId(null);
    } else {
      const newItem: InventarioItem = {
        id: `item-${Date.now()}`,
        codigo: currentCode,
        nombre: nombre.trim(),
        unidades: cleanUnits,
        cantidad: cleanUnits.length,
        estado: 'ACTIVO'
      };
      setItems([newItem, ...items]);
      setNextCodeNum((prev) => prev + 1);
      showToast(`Artículo "${newItem.nombre}" creado exitosamente`);
    }

    // Reset Form
    setNombre('');
    setUnidades(['']);
  };

  const handleStartEdit = (item: InventarioItem) => {
    setEditingId(item.id);
    setNombre(item.nombre);
    setUnidades(item.unidades.length > 0 ? item.unidades : ['']);
  };

  const handleToggleEstado = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, estado: item.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
          : item
      )
    );
    showToast('Estado del artículo modificado');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Artículo eliminado del inventario');
  };

  const filteredItems = items.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return item.codigo.toLowerCase().includes(q) || item.nombre.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-800">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-12 right-6 z-50 bg-[#4338ca] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header (Matching Screenshot) */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Inventario
        </h1>
        <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
          GESTIONA LOS ARTÍCULOS DE TU INVENTARIO
        </p>
      </div>

      {/* Main 2-Column Split: Left (4 cols) vs Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Form "Nuevo Ítem" (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900">
                {editingId ? 'Editar Ítem' : 'Nuevo Ítem'}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNombre('');
                  setUnidades(['']);
                }}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 underline cursor-pointer"
              >
                Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleCreateOrUpdateItem} className="space-y-4 text-xs">
            {/* CÓDIGO */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                CÓDIGO
              </label>
              <input
                type="text"
                readOnly
                value={editingId ? items.find((i) => i.id === editingId)?.codigo : currentCode}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-600 focus:outline-none cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400">
                Se asigna automáticamente al crear el ítem.
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
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del artículo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
              />
            </div>

            {/* UNIDADES */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                UNIDADES
              </label>

              <div className="space-y-2">
                {unidades.map((unit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => handleUnitChange(index, e.target.value)}
                      placeholder="Identificador de la unidad"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveUnitField(index)}
                      className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* + Agregar unidad button */}
              <button
                type="button"
                onClick={handleAddUnitField}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-indigo-600 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar unidad</span>
              </button>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Identificador de cada unidad física (n.° de serie, placa, etc.). La cantidad es el total de unidades agregadas; puedes dejarlo vacío y crear el ítem sin unidades.
              </p>
            </div>

            {/* + CREAR ÍTEM button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{editingId ? 'GUARDAR CAMBIOS' : 'CREAR ÍTEM'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Table of Items (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top Search Input (Matching Screenshot) */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por código o nombre..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          {/* Table Card (Matching Screenshot) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">CÓDIGO</th>
                    <th className="py-3.5 px-5">NOMBRE</th>
                    <th className="py-3.5 px-4 text-center">CANTIDAD</th>
                    <th className="py-3.5 px-4 text-center">ESTADO</th>
                    <th className="py-3.5 px-5 text-right">ACCIONES</th>
                  </tr>
                </thead>
                {filteredItems.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                            <Package className="w-6 h-6 text-slate-300" />
                          </div>
                          <div className="font-bold text-xs text-slate-700">
                            No hay ítems en el inventario.
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Crea uno usando el formulario.
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* CÓDIGO */}
                        <td className="py-3.5 px-5 font-mono font-bold text-indigo-700">
                          {item.codigo}
                        </td>

                        {/* NOMBRE */}
                        <td className="py-3.5 px-5 font-semibold text-slate-900">
                          {item.nombre}
                        </td>

                        {/* CANTIDAD */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                          {item.cantidad}
                        </td>

                        {/* ESTADO */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.estado === 'ACTIVO'
                                ? 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>

                        {/* ACCIONES */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="Ver unidades"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="Editar ítem"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="w-7 h-7 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="Eliminar ítem"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Detalle de Ítem y Unidades */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center font-mono">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {selectedItem.nombre}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Código: {selectedItem.codigo}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Total Unidades:</span>
                <span className="font-mono font-bold text-slate-900">{selectedItem.cantidad}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Estado:</span>
                <span className="font-bold text-emerald-600">{selectedItem.estado}</span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Unidades Registradas:
                </div>
                {selectedItem.unidades.length === 0 ? (
                  <div className="text-slate-400 italic">No hay números de serie o placas registradas.</div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.unidades.map((u, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-700">
                        {u}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-[#4338ca] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
