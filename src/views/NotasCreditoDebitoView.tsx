import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  RotateCcw,
  Search,
  Calendar,
  ChevronRight,
  ChevronDown,
  Building,
  Check,
  Receipt,
  FileMinus,
  FilePlus,
  X,
  Eye
} from 'lucide-react';

interface NotaItem {
  id: string;
  numero: string;
  cude: string;
  tipo: 'NC' | 'ND';
  facturaAplicada: string;
  proveedor: string;
  nit: string;
  emision: string;
  motivo: string;
  monto: string;
  montoRaw: number;
}

export const NotasCreditoDebitoView: React.FC = () => {
  // Tabs: 'todas' | 'credito' | 'debito'
  const [activeTab, setActiveTab] = useState<'todas' | 'credito' | 'debito'>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('Todos los proveedores');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Selected note for modal preview
  const [selectedNota, setSelectedNota] = useState<NotaItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Dataset matching the uploaded screenshot
  const [notas, setNotas] = useState<NotaItem[]>([
    {
      id: 'nota-1',
      numero: '30947502',
      cude: '3f86be0e8c...',
      tipo: 'NC',
      facturaAplicada: 'X4832518609',
      proveedor: 'COLOMBIANA DE COMERCIO S.A.',
      nit: '890900943',
      emision: '05 Mar, 2026',
      motivo: 'Anulación',
      monto: '-$1.006.037',
      montoRaw: -1006037
    }
  ]);

  const filteredNotas = notas.filter((n) => {
    if (activeTab === 'credito' && n.tipo !== 'NC') return false;
    if (activeTab === 'debito' && n.tipo !== 'ND') return false;
    if (selectedProvider !== 'Todos los proveedores' && n.proveedor !== selectedProvider) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        n.numero.toLowerCase().includes(q) ||
        n.proveedor.toLowerCase().includes(q) ||
        n.nit.toLowerCase().includes(q) ||
        n.facturaAplicada.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const notasCreditoCount = notas.filter((n) => n.tipo === 'NC').length;
  const notasDebitoCount = notas.filter((n) => n.tipo === 'ND').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-800">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-12 right-6 z-50 bg-[#ea580c] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header (Matching Screenshot) */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
          <RotateCcw className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Notas Crédito / Débito
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Documentos aplicados a facturas existentes
          </p>
        </div>
      </div>

      {/* 3 Top KPI Cards (Matching Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: TOTAL NOTAS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL NOTAS
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
              {notas.length}
            </div>
          </div>
        </div>

        {/* Card 2: NOTAS CRÉDITO */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 font-bold">
            <RotateCcw className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
              NOTAS CRÉDITO
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
              {notasCreditoCount}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              $1.006.037
            </div>
          </div>
        </div>

        {/* Card 3: NOTAS DÉBITO */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 font-bold">
            <FileText className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
              NOTAS DÉBITO
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
              {notasDebitoCount}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              $0
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Matching Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        {/* Left: Tab Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('todas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'todas'
                ? 'bg-slate-100 text-slate-900 border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credito')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              activeTab === 'credito'
                ? 'bg-orange-50 border-orange-200 text-orange-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Crédito</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('debito')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              activeTab === 'debito'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Débito</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por proveedor, NIT o número..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Provider dropdown */}
        <div className="relative min-w-[200px]">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full appearance-none bg-white text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 pr-8 cursor-pointer"
          >
            <option value="Todos los proveedores">Todos los proveedores</option>
            <option value="COLOMBIANA DE COMERCIO S.A.">COLOMBIANA DE COMERCIO S.A.</option>
            <option value="CAJASAN">CAJASAN</option>
            <option value="CINE COLOMBIA S.A.S.">CINE COLOMBIA S.A.S.</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
        </div>

        {/* Date pickers */}
        <div className="flex items-center gap-1.5 shrink-0">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <span className="text-slate-300 font-mono">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Orange Buscar Button */}
        <button
          type="button"
          onClick={() => showToast('Búsqueda de notas ejecutada')}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Buscar</span>
        </button>
      </div>

      {/* Table Card (Matching Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredNotas.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
              <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <h4 className="font-bold text-xs text-slate-700">
              No se encontraron notas crédito o débito con los filtros aplicados.
            </h4>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">NOTA</th>
                  <th className="py-3.5 px-4 text-center">TIPO</th>
                  <th className="py-3.5 px-4">FACTURA APLICADA</th>
                  <th className="py-3.5 px-5">PROVEEDOR</th>
                  <th className="py-3.5 px-4">EMISIÓN</th>
                  <th className="py-3.5 px-4">MOTIVO</th>
                  <th className="py-3.5 px-4 text-right">MONTO</th>
                  <th className="py-3.5 px-4 text-center">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNotas.map((nota) => (
                  <tr key={nota.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* NOTA */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold font-mono text-slate-900">
                        {nota.numero}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {nota.cude}
                      </div>
                    </td>

                    {/* TIPO */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-200 bg-orange-50 text-orange-700">
                        <FileText className="w-3 h-3 text-orange-600" />
                        <span>{nota.tipo}</span>
                      </span>
                    </td>

                    {/* FACTURA APLICADA */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-indigo-600 font-semibold cursor-pointer hover:underline">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{nota.facturaAplicada}</span>
                      </div>
                    </td>

                    {/* PROVEEDOR */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 leading-tight">
                        {nota.proveedor}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        NIT: {nota.nit}
                      </div>
                    </td>

                    {/* EMISIÓN */}
                    <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {nota.emision}
                    </td>

                    {/* MOTIVO */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {nota.motivo}
                    </td>

                    {/* MONTO */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="font-bold font-mono text-rose-600 text-sm">
                        {nota.monto}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400">COP</div>
                    </td>

                    {/* ACCIÓN */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedNota(nota)}
                        className="w-7 h-7 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-400 hover:text-orange-600 flex items-center justify-center transition-colors mx-auto cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Detalle de Nota Crédito / Débito */}
      {selectedNota && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 font-bold text-sm flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Nota {selectedNota.tipo === 'NC' ? 'Crédito' : 'Débito'} #{selectedNota.numero}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    CUDE: {selectedNota.cude}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNota(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Proveedor:</span>
                <span className="font-bold text-slate-900">{selectedNota.proveedor}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">NIT:</span>
                <span className="font-mono text-slate-800">{selectedNota.nit}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Factura Afectada:</span>
                <span className="font-mono font-bold text-indigo-600">{selectedNota.facturaAplicada}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Fecha de Emisión:</span>
                <span className="font-mono text-slate-800">{selectedNota.emision}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Motivo:</span>
                <span className="font-medium text-slate-800">{selectedNota.motivo}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Monto Aplicado:</span>
                <span className="font-mono font-bold text-rose-600 text-sm">{selectedNota.monto} COP</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNota(null)}
                className="px-4 py-2 bg-[#ea580c] text-white text-xs font-bold rounded-lg shadow-xs"
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
