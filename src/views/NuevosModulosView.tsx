import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ModuloPersonalizado } from '../types';
import { Sparkles, Plus, Trash2, Layers, Send, CheckCircle2, FileCode, X } from 'lucide-react';

export const NuevosModulosView: React.FC = () => {
  const { modulosPersonalizados, crearModuloPersonalizado, agregarRegistroAModulo, eliminarModulo } = useApp();

  const [selectedMod, setSelectedMod] = useState<ModuloPersonalizado | null>(modulosPersonalizados[0] || null);
  const [isNewModModalOpen, setIsNewModModalOpen] = useState(false);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [recordState, setRecordState] = useState<Record<string, any>>({});

  // New module state
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');
  const [fields, setFields] = useState<{ nombre: string; etiqueta: string; tipo: 'texto' | 'numero' | 'fecha' | 'select' | 'boolean'; opciones?: string[] }[]>([
    { nombre: 'codigo', etiqueta: 'Código', tipo: 'texto' },
    { nombre: 'nombre', etiqueta: 'Nombre / Concepto', tipo: 'texto' },
    { nombre: 'estado', etiqueta: 'Estado', tipo: 'select', opciones: ['Pendiente', 'Aprobado', 'Completado'] }
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newName, setNewName] = useState('');

  const handleAddField = () => {
    if (!newLabel || !newName) return;
    setFields([...fields, { nombre: newName.toLowerCase().replace(/\s+/g, '_'), etiqueta: newLabel, tipo: 'texto' }]);
    setNewLabel('');
    setNewName('');
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    crearModuloPersonalizado({
      codigo: code,
      titulo: title,
      descripcion: desc,
      icono: 'Sparkles',
      autor: 'Karen Garcia (Disfarma SAS)',
      campos: fields,
      registros: []
    });

    setIsNewModModalOpen(false);
    setTitle('');
    setCode('');
    setDesc('');
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMod) return;
    agregarRegistroAModulo(selectedMod.id, recordState);
    setRecordState({});
    setIsNewRecordModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Extensibilidad Gexto · Hexa Labs</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Centro de Nuevos Módulos a Medida
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Espacio listo para integrar los nuevos módulos y funcionalidades que suministrarás para Disfarma SAS
          </p>
        </div>

        <button
          onClick={() => setIsNewModModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Módulo</span>
        </button>
      </div>

      {/* Modules Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modulosPersonalizados.map((m) => {
          const isSelected = selectedMod?.id === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setSelectedMod(m)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-[#4338ca] ring-1 ring-indigo-600/30 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {m.codigo}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {m.estado}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{m.titulo}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{m.descripcion}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{m.campos.length} campos</span>
                <span className="font-semibold text-slate-700">{m.registros.length} registros</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Module Table */}
      {selectedMod && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{selectedMod.titulo}</h2>
                <span className="font-mono text-xs text-slate-500 font-semibold">({selectedMod.codigo})</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{selectedMod.descripcion}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewRecordModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Registro</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`¿Eliminar módulo ${selectedMod.titulo}?`)) {
                    eliminarModulo(selectedMod.id);
                    setSelectedMod(modulosPersonalizados[0] || null);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                title="Eliminar módulo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {selectedMod.registros.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-xs">
                No hay registros ingresados en este módulo. Haz clic en "Agregar Registro" para ingresar información.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 text-[11px] border-b border-slate-200">
                  <tr>
                    {selectedMod.campos.map((c) => (
                      <th key={c.nombre} className="py-2.5 px-4 font-semibold">
                        {c.etiqueta}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedMod.registros.map((reg, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {selectedMod.campos.map((c) => (
                        <td key={c.nombre} className="py-3 px-4 text-slate-800">
                          {reg[c.nombre] !== undefined ? String(reg[c.nombre]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Instruction Box for Karen */}
      <div className="bg-[#0b0f24] text-white rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <FileCode className="w-4 h-4" />
          <span>¿Cómo suministrar los módulos que necesitas?</span>
        </div>
        <h3 className="text-base font-bold text-slate-100">
          Esta réplica está lista para recibir las especificaciones de tus módulos
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Escríbeme en tu respuesta los nombres, pantallas, campos o flujos de los módulos que deseas incorporar (por ejemplo: <em>Módulo de Conciliación de Pagos, Radicación de Facturas en Lote, Auditoría de Cuentas Médicas o Aprobaciones por Centro de Costos</em>), o sube capturas de cada pantalla como la que acabas de enviar, y los dejaré implementados tal cual.
        </p>
      </div>

      {/* Modal New Module */}
      {isNewModModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 bg-[#0b0f24] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Registrar Nuevo Módulo en Gexto</h3>
              <button onClick={() => setIsNewModModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nombre del Módulo</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Radicación de Facturas Masivas"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Código Identificador</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="MOD-RAD-03"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Propósito del módulo..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              {/* Fields */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Campos del Formulario ({fields.length})</label>
                <div className="space-y-1">
                  {fields.map((f, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                      <span><strong>{f.etiqueta}</strong> ({f.nombre})</span>
                      <span className="text-[10px] font-mono text-slate-400">{f.tipo}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Etiqueta campo"
                    className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nombre variable"
                    className="w-32 text-xs px-2.5 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewModModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Crear Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal New Record */}
      {isNewRecordModalOpen && selectedMod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full">
            <div className="p-4 bg-[#0b0f24] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Nuevo Registro: {selectedMod.titulo}</h3>
              <button onClick={() => setIsNewRecordModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="p-6 space-y-3">
              {selectedMod.campos.map((c) => (
                <div key={c.nombre}>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">{c.etiqueta}</label>
                  {c.tipo === 'select' && c.opciones ? (
                    <select
                      value={recordState[c.nombre] || c.opciones[0]}
                      onChange={(e) => setRecordState({ ...recordState, [c.nombre]: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      {c.opciones.map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={recordState[c.nombre] || ''}
                      onChange={(e) => setRecordState({ ...recordState, [c.nombre]: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewRecordModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
