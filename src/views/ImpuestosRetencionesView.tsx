import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Filter,
  DollarSign,
  Building,
  Receipt,
  Download,
  Calendar,
  Layers,
  FileText,
  Check,
  ChevronDown
} from 'lucide-react';

interface RetencionConcept {
  id: string;
  concepto: string;
  tipo: 'RETEFUENTE' | 'RETEIVA' | 'RETEICA';
  baseGravable: string;
  tarifa: string;
  valorRetenido: string;
  facturasAfectadas: number;
}

export const ImpuestosRetencionesView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Enero');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Filter feedback
  const [isFiltered, setIsFiltered] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Mock concepts state (initially 0 concepts as shown in screenshot)
  const [concepts, setConcepts] = useState<RetencionConcept[]>([]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = ['2026', '2025', '2024', '2023'];

  const handleFilterPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFiltered(true);

    // If September 2026 is chosen, simulate showing real data from the invoices, otherwise 0
    if (selectedMonth === 'Septiembre' && selectedYear === '2026') {
      setConcepts([
        {
          id: 'c-1',
          concepto: 'Compras Generales (Declarantes)',
          tipo: 'RETEFUENTE',
          baseGravable: '$1.460.098',
          tarifa: '2.5%',
          valorRetenido: '$36.502',
          facturasAfectadas: 1
        },
        {
          id: 'c-2',
          concepto: 'Servicios de Telecomunicaciones',
          tipo: 'RETEICA',
          baseGravable: '$539.003',
          tarifa: '0.966%',
          valorRetenido: '$5.207',
          facturasAfectadas: 4
        }
      ]);
      showToast(`Mostrando consolidado de ${selectedMonth} ${selectedYear}`);
    } else {
      setConcepts([]);
      showToast(`Período ${selectedMonth} ${selectedYear} filtrado (0 retenciones)`);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Concepto,Tipo,Base Gravable,Tarifa,Valor Retenido,Facturas Afectadas\n';
    const rows = concepts
      .map(
        (c) =>
          `"${c.concepto}","${c.tipo}","${c.baseGravable}","${c.tarifa}","${c.valorRetenido}",${c.facturasAfectadas}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sabana_retenciones_${selectedMonth.toLowerCase()}_${selectedYear}.csv`;
    link.click();
    showToast('Sábana de retenciones exportada con éxito');
  };

  const totalFuente = concepts
    .filter((c) => c.tipo === 'RETEFUENTE')
    .reduce((acc, c) => acc + (parseFloat(c.valorRetenido.replace('$', '').replace('.', '')) || 0), 0);

  const totalIva = concepts
    .filter((c) => c.tipo === 'RETEIVA')
    .reduce((acc, c) => acc + (parseFloat(c.valorRetenido.replace('$', '').replace('.', '')) || 0), 0);

  const totalIca = concepts
    .filter((c) => c.tipo === 'RETEICA')
    .reduce((acc, c) => acc + (parseFloat(c.valorRetenido.replace('$', '').replace('.', '')) || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-800">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-12 right-6 z-50 bg-[#4338ca] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header + Export Button (Matching Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Consolidado Tributario
          </h1>
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
            RESUMEN MENSUAL DE RETENCIONES PRACTICADAS (RETEFUENTE, RETEIVA, RETEICA)
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>EXPORTAR SÁBANA CSV</span>
        </button>
      </div>

      {/* Filter Card: Seleccionar Mes, Año y Filtrar */}
      <form
        onSubmit={handleFilterPeriod}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* SELECCIONAR MES */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              SELECCIONAR MES
            </label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full appearance-none bg-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* SELECCIONAR AÑO */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              SELECCIONAR AÑO
            </label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full appearance-none bg-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* BOTÓN FILTRAR PERÍODO */}
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>FILTRAR PERÍODO</span>
            </button>
          </div>
        </div>
      </form>

      {/* 3 Summary KPI Cards (Matching Screenshot exactly) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: RETENCIÓN FUENTE */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs font-bold text-slate-700 tracking-wider">
              RETENCIÓN FUENTE
            </span>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL PRACTICADO
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {totalFuente > 0 ? `$${totalFuente.toLocaleString('es-CO')}` : '$0,00'}
            </div>
          </div>
        </div>

        {/* Card 2: RETENCIÓN IVA */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-slate-700 tracking-wider">
              RETENCIÓN IVA
            </span>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL PRACTICADO
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {totalIva > 0 ? `$${totalIva.toLocaleString('es-CO')}` : '$0,00'}
            </div>
          </div>
        </div>

        {/* Card 3: RETENCIÓN ICA */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Building className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-slate-700 tracking-wider">
              RETENCIÓN ICA
            </span>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL PRACTICADO
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {totalIca > 0 ? `$${totalIca.toLocaleString('es-CO')}` : '$0,00'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Resumen por Concepto de Retención (Matching Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">
            Resumen por Concepto de Retención
          </h3>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {concepts.length} concepto(s)
          </span>
        </div>

        {concepts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
              <Receipt className="w-6 h-6 text-slate-300" />
            </div>
            <h4 className="font-bold text-xs text-slate-700">
              No se encontraron retenciones practicadas en este período.
            </h4>
            <p className="text-[11px] text-slate-400">
              Las retenciones aparecerán a medida que se liquiden facturas en el workflow.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">CONCEPTO</th>
                  <th className="py-3 px-3 text-center">TIPO</th>
                  <th className="py-3 px-3 text-right">BASE GRAVABLE</th>
                  <th className="py-3 px-3 text-center">TARIFA</th>
                  <th className="py-3 px-3 text-right">VALOR RETENIDO</th>
                  <th className="py-3 px-3 text-center">FACTURAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {concepts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {c.concepto}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {c.tipo}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                      {c.baseGravable}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-semibold text-indigo-700">
                      {c.tarifa}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                      {c.valorRetenido}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-600">
                      {c.facturasAfectadas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
