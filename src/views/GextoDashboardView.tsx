import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  DollarSign,
  AlertCircle,
  Truck,
  Clock,
  CheckCircle,
  Ban,
  GitPullRequest,
  Trophy,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Building2,
  Tag,
  ArrowRight,
  Check
} from 'lucide-react';

export const GextoDashboardView: React.FC = () => {
  const { periodFilter, setPeriodFilter, setActiveMenu } = useApp();
  const [chartMode, setChartMode] = useState<'monto' | 'cantidad'>('monto');

  const clasificaciones = [
    { code: 'N/A', name: 'Sin Clasificación', esteMes: '$55.765', total: '$17.254.003', color: 'bg-slate-200 text-slate-700', activeBar: true },
    { code: 'GO', name: 'Gastos Operacionales', esteMes: '$0', total: '$0', color: 'bg-blue-100 text-blue-700' },
    { code: 'OT', name: 'Otros / No Especificado', esteMes: '$0', total: '$0', color: 'bg-slate-100 text-slate-600' },
    { code: 'GP', name: 'Gastos de Personal', esteMes: '$0', total: '$0', color: 'bg-purple-100 text-purple-700' },
    { code: 'GA', name: 'Gastos Administrativos', esteMes: '$0', total: '$0', color: 'bg-purple-100 text-purple-700' },
    { code: 'AF', name: 'Activos Fijos / Capex', esteMes: '$0', total: '$0', color: 'bg-emerald-100 text-emerald-700' },
    { code: 'CV', name: 'Costos de Ventas', esteMes: '$0', total: '$0', color: 'bg-amber-100 text-amber-700' }
  ];

  const centrosCostos = [
    { code: 'N/A', name: 'Sin Centro de Costos', esteMes: '$55.765', total: '$17.254.003', color: 'bg-slate-200 text-slate-700', activeBar: true },
    { code: 'ADM', name: 'Administración', esteMes: '$0', total: '$0', color: 'bg-blue-100 text-blue-700' },
    { code: 'GEN', name: 'General / Sin Asignar', esteMes: '$0', total: '$0', color: 'bg-slate-100 text-slate-600' },
    { code: 'TEC', name: 'Tecnología', esteMes: '$0', total: '$0', color: 'bg-cyan-100 text-cyan-700' },
    { code: 'LOG', name: 'Logística', esteMes: '$0', total: '$0', color: 'bg-purple-100 text-purple-700' },
    { code: 'PRD', name: 'Producción', esteMes: '$0', total: '$0', color: 'bg-amber-100 text-amber-700' },
    { code: 'VTA', name: 'Ventas', esteMes: '$0', total: '$0', color: 'bg-emerald-100 text-emerald-700' }
  ];

  const facturasVencidas = [
    {
      proveedor: 'COLOMBIA TELECOMUNICACIONES S.A. E.S.P. BIC',
      numero: '#BEC323172222',
      vencio: '18 Sep, 2023',
      diasVencida: '1108 días vencida',
      monto: '$35.990'
    },
    {
      proveedor: 'COLOMBIANA DE COMERCIO S.A.',
      numero: '#X4801003742',
      vencio: '04 Oct, 2023',
      diasVencida: '1092 días vencida',
      monto: '$335.588'
    },
    {
      proveedor: 'COLOMBIANA DE COMERCIO S.A.',
      numero: '#X4831006898',
      vencio: '27 Ene, 2024',
      diasVencida: '977 días vencida',
      monto: '$3.133.088'
    },
    {
      proveedor: 'COMUNICACION CELULAR S A COMCEL S A',
      numero: '#E5907941176',
      vencio: '11 Mar, 2025',
      diasVencida: '568 días vencida',
      monto: '$38.956'
    },
    {
      proveedor: 'COMUNICACION CELULAR S A COMCEL S A',
      numero: '#E5917896836',
      vencio: '08 Abr, 2025',
      diasVencida: '540 días vencida',
      monto: '$38.900'
    }
  ];

  const facturasRecientes = [
    { numero: '1422110613', proveedor: 'SERVICIOS DE SALU...', fecha: '21/03/2023', monto: '$4.100', estado: 'Recibida' },
    { numero: 'POL6421993', proveedor: 'SEGUROS COMERCI...', fecha: '29/04/2023', monto: '$278.200', estado: 'Recibida' },
    { numero: '1422120582', proveedor: 'SERVICIOS DE SALU...', fecha: '03/05/2023', monto: '$4.100', estado: 'Recibida' },
    { numero: 'CCP6963947', proveedor: 'CINE COLOMBIA S.A...', fecha: '24/07/2023', monto: '$40.000', estado: 'Recibida' },
    { numero: 'CCP6964136', proveedor: 'CINE COLOMBIA S.A...', fecha: '24/07/2023', monto: '$12.000', estado: 'Recibida' },
    { numero: 'CCP7112825', proveedor: 'CINE COLOMBIA S.A...', fecha: '31/07/2023', monto: '$13.600', estado: 'Recibida' },
    { numero: 'X4801003742', proveedor: 'COLOMBIANA DE C...', fecha: '04/09/2023', monto: '$335.588', estado: 'Recibida' }
  ];

  const chartData = [
    { mes: 'Ago', valorLabel: '$48K', heightPercent: 12, barColor: 'bg-emerald-400' },
    { mes: 'Sep', valorLabel: '$3.3M', heightPercent: 95, barColor: 'bg-amber-500' },
    { mes: 'Oct', valorLabel: '$45K', heightPercent: 11, barColor: 'bg-blue-400' },
    { mes: 'Nov', valorLabel: '$45K', heightPercent: 11, barColor: 'bg-blue-400' },
    { mes: 'Feb', valorLabel: '$141K', heightPercent: 22, barColor: 'bg-blue-400' },
    { mes: 'Mar', valorLabel: '$2.9M', heightPercent: 85, barColor: 'bg-teal-500' },
    { mes: 'Abr', valorLabel: '$75K', heightPercent: 15, barColor: 'bg-emerald-400' },
    { mes: 'May', valorLabel: '$40K', heightPercent: 10, barColor: 'bg-emerald-400' },
    { mes: 'Jun', valorLabel: '$614K', heightPercent: 38, barColor: 'bg-purple-500' },
    { mes: 'Jul', valorLabel: '$61K', heightPercent: 13, barColor: 'bg-rose-500' },
    { mes: 'Ago', valorLabel: '$1.6M', heightPercent: 65, barColor: 'bg-teal-500' },
    { mes: 'Sep', valorLabel: '$56K', heightPercent: 14, barColor: 'bg-amber-400' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header: Hola, Karen + Ir a Facturas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Hola, Karen
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Resumen de tu plataforma · 30 Sep 2026
          </p>
        </div>

        <button
          onClick={() => setActiveMenu('facturas')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Ir a Facturas</span>
        </button>
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: FACTURAS MES */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                FACTURAS MES
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 leading-tight">
                2
              </div>
              <div className="text-[11px] text-slate-400">
                58 acumuladas
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5 text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>50%</span>
          </div>
        </div>

        {/* Card 2: FACTURADO MES */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-lg">
              $
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                FACTURADO MES
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 leading-tight">
                $55.765
              </div>
              <div className="text-[11px] text-slate-400">
                $16.247.966 total
              </div>
              <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                📄 1 NC · 0 ND
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5 text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded self-start">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>96.5%</span>
          </div>
        </div>

        {/* Card 3: REQUIEREN ACCIÓN */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                <span>REQUIEREN ACCIÓN</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 leading-tight">
                58
              </div>
              <div className="text-[11px] text-slate-400">
                58 Recibida · 0 Revisada
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: PROVEEDORES */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                PROVEEDORES
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 leading-tight">
                13
              </div>
              <div className="text-[11px] text-slate-400">
                1 usuarios activos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 3 Colored Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
        {/* Card 1: PENDIENTE DE PAGO */}
        <div className="bg-[#3b3dbf] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-100">
              <Clock className="w-4 h-4 text-indigo-200" />
              <span>PENDIENTE DE PAGO</span>
            </div>

            <div className="bg-[#2e2f96] p-0.5 rounded-md flex text-[11px] font-medium">
              <button
                onClick={() => setPeriodFilter('mes')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'mes' ? 'bg-[#5557e5] text-white font-semibold' : 'text-indigo-200'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setPeriodFilter('total')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'total' ? 'bg-[#5557e5] text-white font-semibold' : 'text-indigo-200'
                }`}
              >
                Total
              </button>
            </div>
          </div>

          <div className="text-3xl font-bold font-mono tracking-tight text-white">
            $0
          </div>

          <div className="text-xs text-indigo-200">
            Aprobadas + Debitadas este mes
          </div>
        </div>

        {/* Card 2: CONCILIADO */}
        <div className="bg-[#057a55] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>CONCILIADO</span>
            </div>

            <div className="bg-[#046c4e] p-0.5 rounded-md flex text-[11px] font-medium">
              <button
                onClick={() => setPeriodFilter('mes')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'mes' ? 'bg-[#0e9f6e] text-white font-semibold' : 'text-emerald-200'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setPeriodFilter('total')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'total' ? 'bg-[#0e9f6e] text-white font-semibold' : 'text-emerald-200'
                }`}
              >
                Total
              </button>
            </div>
          </div>

          <div className="text-3xl font-bold font-mono tracking-tight text-white">
            $0
          </div>

          <div className="text-xs text-emerald-200">
            Pagado y cerrado este mes
          </div>
        </div>

        {/* Card 3: RECHAZADO */}
        <div className="bg-[#c81e1e] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-100">
              <Ban className="w-4 h-4 text-red-200" />
              <span>RECHAZADO</span>
            </div>

            <div className="bg-[#9b1c1c] p-0.5 rounded-md flex text-[11px] font-medium">
              <button
                onClick={() => setPeriodFilter('mes')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'mes' ? 'bg-[#e02424] text-white font-semibold' : 'text-red-200'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setPeriodFilter('total')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'total' ? 'bg-[#e02424] text-white font-semibold' : 'text-red-200'
                }`}
              >
                Total
              </button>
            </div>
          </div>

          <div className="text-3xl font-bold font-mono tracking-tight text-white">
            $0
          </div>

          <div className="text-xs text-red-200">
            0 rechazadas este mes
          </div>
        </div>
      </div>

      {/* Row 3: Pipeline de Facturas & Top Proveedores por Facturación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <GitPullRequest className="w-4 h-4 text-indigo-600" />
              <span>Pipeline de Facturas</span>
            </div>

            <div className="bg-slate-100 p-0.5 rounded-md flex text-[11px] font-medium">
              <button
                onClick={() => setPeriodFilter('mes')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'mes' ? 'bg-[#3730a3] text-white font-semibold' : 'text-slate-600'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setPeriodFilter('total')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'total' ? 'bg-[#3730a3] text-white font-semibold' : 'text-slate-600'
                }`}
              >
                Total
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-base leading-none">📥</span>
                  <span>Recibida</span>
                </span>
                <span className="font-mono text-slate-800 font-bold">
                  2 <span className="text-slate-400 font-normal text-[11px]">100%</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#f59e0b] h-full rounded-full w-full"></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-base leading-none">👁️</span>
                  <span>Revisada</span>
                </span>
                <span className="font-mono text-slate-800 font-bold">
                  0 <span className="text-slate-400 font-normal text-[11px]">0%</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#3b82f6] h-full rounded-full w-[2px]"></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-base leading-none">👍</span>
                  <span>Aprobada</span>
                </span>
                <span className="font-mono text-slate-800 font-bold">
                  0 <span className="text-slate-400 font-normal text-[11px]">0%</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#10b981] h-full rounded-full w-[2px]"></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-base leading-none">💳</span>
                  <span>Debitada</span>
                </span>
                <span className="font-mono text-slate-800 font-bold">
                  0 <span className="text-slate-400 font-normal text-[11px]">0%</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#8b5cf6] h-full rounded-full w-[2px]"></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-base leading-none">📑</span>
                  <span>Conciliada</span>
                </span>
                <span className="font-mono text-slate-800 font-bold">
                  0 <span className="text-slate-400 font-normal text-[11px]">0%</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#64748b] h-full rounded-full w-[2px]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Proveedores Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Top Proveedores por Facturación</span>
            </div>

            <div className="bg-slate-100 p-0.5 rounded-md flex text-[11px] font-medium">
              <button
                onClick={() => setPeriodFilter('mes')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'mes' ? 'bg-[#3730a3] text-white font-semibold' : 'text-slate-600'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setPeriodFilter('total')}
                className={`px-2.5 py-0.5 rounded ${
                  periodFilter === 'total' ? 'bg-[#3730a3] text-white font-semibold' : 'text-slate-600'
                }`}
              >
                Total
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#eab308] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">
                      COMUNICACION CELULAR S A COMCEL S A
                    </div>
                    <div className="text-[11px] text-slate-400">
                      NIT: 800153993 · 1 facturas
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono text-sm text-slate-900">
                    $39.900
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    IVA: $6.360
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#4338ca] h-full rounded-full w-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-400 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">
                      CAJASAN
                    </div>
                    <div className="text-[11px] text-slate-400">
                      NIT: 890200106 · 1 facturas
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono text-sm text-slate-900">
                    $15.865
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    IVA: $755
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#6366f1] h-full rounded-full w-[40%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Distribución por Clasificación & Distribución por Centro de Costos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Distribución por Clasificación */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Distribución por Clasificación</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              7 categorías
            </span>
          </div>

          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-2">CLASIFICACIÓN</th>
                <th className="pb-2 text-center">ESTE MES</th>
                <th className="pb-2 text-right">TOTAL ACUMULADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clasificaciones.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${c.color}`}>
                        {c.code}
                      </span>
                      <span className="font-medium text-slate-800">{c.name}</span>
                    </div>
                    {c.activeBar && (
                      <div className="w-36 h-1 bg-[#4338ca] rounded-full mt-1"></div>
                    )}
                  </td>
                  <td className="py-2.5 text-center font-mono font-medium text-slate-900">
                    {c.esteMes}
                  </td>
                  <td className="py-2.5 text-right font-mono font-medium text-slate-900">
                    {c.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Consolidado */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              TOTAL CONSOLIDADO
            </span>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] text-slate-400 font-mono mr-1">MES</span>
                <span className="font-bold font-mono text-slate-900">$55.765</span>
              </div>
              <div>
                <span className="text-[10px] text-sky-600 font-mono mr-1">GENERAL</span>
                <span className="font-bold font-mono text-[#0284c7]">$17.254.003</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Distribución por Centro de Costos */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Distribución por Centro de Costos</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              7 centros
            </span>
          </div>

          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-2">CENTRO DE COSTOS</th>
                <th className="pb-2 text-center">ESTE MES</th>
                <th className="pb-2 text-right">TOTAL ACUMULADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centrosCostos.map((cc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${cc.color}`}>
                        {cc.code}
                      </span>
                      <span className="font-medium text-slate-800">{cc.name}</span>
                    </div>
                    {cc.activeBar && (
                      <div className="w-36 h-1 bg-[#4338ca] rounded-full mt-1"></div>
                    )}
                  </td>
                  <td className="py-2.5 text-center font-mono font-medium text-slate-900">
                    {cc.esteMes}
                  </td>
                  <td className="py-2.5 text-right font-mono font-medium text-slate-900">
                    {cc.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Consolidado */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              TOTAL CONSOLIDADO
            </span>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] text-slate-400 font-mono mr-1">MES</span>
                <span className="font-bold font-mono text-slate-900">$55.765</span>
              </div>
              <div>
                <span className="text-[10px] text-sky-600 font-mono mr-1">GENERAL</span>
                <span className="font-bold font-mono text-[#0284c7]">$17.254.003</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Próximos Vencimientos & Facturas Vencidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Vencimientos */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Próximos Vencimientos</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              0 facturas
            </span>
          </div>

          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Sin vencimientos próximos
            </p>
          </div>
        </div>

        {/* Facturas Vencidas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Facturas Vencidas</span>
            </div>
            <span className="text-[11px] text-rose-600 font-semibold font-mono">
              5 vencidas
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {facturasVencidas.map((fv, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold text-xs shrink-0">
                    !
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">
                      {fv.proveedor}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {fv.numero} · Venció: {fv.vencio}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-semibold text-rose-600 font-mono">
                    {fv.diasVencida}
                  </div>
                  <div className="font-bold font-mono text-rose-700 text-sm">
                    {fv.monto}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 6: Facturas Recientes & Facturación por Mes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facturas Recientes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Facturas Recientes</span>
            </div>
            <button
              onClick={() => setActiveMenu('facturas')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-2">FACTURA</th>
                  <th className="pb-2">PROVEEDOR</th>
                  <th className="pb-2">FECHA</th>
                  <th className="pb-2 text-right">MONTO</th>
                  <th className="pb-2 text-right">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facturasRecientes.map((fr, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 font-mono text-indigo-700 font-semibold cursor-pointer hover:underline">
                      {fr.numero}
                    </td>
                    <td className="py-2.5 text-slate-800 font-medium truncate max-w-[130px]">
                      {fr.proveedor}
                    </td>
                    <td className="py-2.5 text-slate-500 font-mono text-[11px]">
                      {fr.fecha}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      {fr.monto}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        📄 {fr.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Facturación por Mes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Facturación por Mes</span>
              </div>

              <div className="bg-slate-100 p-0.5 rounded-md flex text-[11px] font-medium">
                <button
                  onClick={() => setChartMode('monto')}
                  className={`px-2.5 py-0.5 rounded ${
                    chartMode === 'monto' ? 'bg-[#3730a3] text-white font-semibold' : 'text-slate-600'
                  }`}
                >
                  Monto
                </button>
                <button
                  onClick={() => setChartMode('cantidad')}
                  className={`px-2.5 py-0.5 rounded ${
                    chartMode === 'cantidad' ? 'bg-[#3730a3] text-white font-semibold' : 'text-slate-600'
                  }`}
                >
                  Cantidad
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Basado en fecha de emisión de la factura
            </p>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-4 pb-2">
            <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 px-1 border-b border-slate-200">
              {chartData.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[9px] font-mono text-slate-500 font-bold mb-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    {bar.valorLabel}
                  </span>
                  <div
                    style={{ height: `${bar.heightPercent}%` }}
                    className={`w-full max-w-[24px] ${bar.barColor} rounded-t-sm shadow-xs transition-all group-hover:brightness-95`}
                  />
                  <span className="text-[10px] text-slate-500 font-medium mt-1.5">
                    {bar.mes}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Footer summary */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Total 12 meses</span>
            <div className="flex items-center gap-4">
              <span>📄 34 facturas</span>
              <span className="font-bold font-mono text-emerald-700 text-sm">
                $ 8.989.089
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Footer */}
      <footer className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-900 text-white flex items-center justify-center font-bold text-[10px]">
            G
          </div>
          <span>© 2026 Gexto</span>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-semibold px-1.5 py-0.5 rounded">
            v1.18.0
          </span>
          <span>· Todos los derechos reservados.</span>
        </div>

        <div className="text-[11px] text-slate-400">
          Gexto es un producto de <strong className="text-slate-600">HexaSolutions SAS</strong> · Desarrollado por <strong className="text-slate-600">HexaLabs</strong>
        </div>
      </footer>
    </div>
  );
};
