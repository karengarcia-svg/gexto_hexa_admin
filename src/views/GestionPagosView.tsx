import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  RefreshCw,
  Search,
  Filter,
  FileSpreadsheet,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileArchive,
  ArrowLeft,
  X,
  Check,
  Building2,
  DollarSign,
  ChevronDown,
  Info,
  Sparkles,
  Paperclip
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  numero: string;
  cufe: string;
  proveedor: string;
  nit: string;
  emision: string;
  vencimiento: string | null;
  diasVencida: string | null;
  tipoPago: 'CONTADO' | 'CREDITO';
  claseCC: string | null;
  total: string;
  estadoSlug: 'recibida' | 'revisada' | 'aprobada' | 'debitada' | 'conciliada' | 'rechazada' | 'paso_7';
}

export const GestionPagosView: React.FC = () => {
  const { setActiveMenu } = useApp();

  // Mode: 'list' (Main invoice list) | 'add-invoice' (Agregar Factura)
  const [viewMode, setViewMode] = useState<'list' | 'add-invoice'>('list');

  // Sub-tabs in Agregar Factura: 'zip' | 'manual'
  const [addMode, setAddMode] = useState<'zip' | 'manual'>('zip');

  // Active step filter in pipeline
  const [activeStepFilter, setActiveStepFilter] = useState<string>('recibida');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync Modal & State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('30 Sep 2026, 05:05 PM');
  const [timeRange, setTimeRange] = useState('Últimos 7 días');
  const [showHistory, setShowHistory] = useState(true);

  // Sync executions history matching screenshot
  const syncExecutions = [
    {
      id: 'exec-1',
      date: '30 Sep 2026, 05:05 PM',
      origin: 'Sistema (Cron)',
      processedEmails: 0,
      xmlCount: 0
    },
    {
      id: 'exec-2',
      date: '30 Sep 2026, 05:01 PM',
      origin: 'Karen Garcia',
      processedEmails: 75,
      xmlCount: 0
    },
    {
      id: 'exec-3',
      date: '30 Sep 2026, 05:00 PM',
      origin: 'Sistema (Cron)',
      processedEmails: 0,
      xmlCount: 0
    },
    {
      id: 'exec-4',
      date: '30 Sep 2026, 04:58 PM',
      origin: 'Karen Garcia',
      processedEmails: 75,
      xmlCount: 0
    },
    {
      id: 'exec-5',
      date: '30 Sep 2026, 04:55 PM',
      origin: 'Sistema (Cron)',
      processedEmails: 0,
      xmlCount: 0
    }
  ];

  // Manual Form State
  const [manualProvider, setManualProvider] = useState('');
  const [docType, setDocType] = useState('Factura');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('1.500.000');
  const [taxAmount, setTaxAmount] = useState('0');
  const [paymentType, setPaymentType] = useState<'Contado' | 'Crédito'>('Contado');
  const [currency, setCurrency] = useState('COP - Peso Colombiano');
  const [notes, setNotes] = useState('');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Pipeline step items
  const pipelineSteps = [
    { num: '01', slug: 'recibida', name: 'Recibida', count: 58, color: '#f59e0b' },
    { num: '02', slug: 'revisada', name: 'Revisada', count: 0, color: '#3b82f6' },
    { num: '03', slug: 'aprobada', name: 'Aprobada', count: 0, color: '#10b981' },
    { num: '04', slug: 'debitada', name: 'Debitada', count: 0, color: '#8b5cf6' },
    { num: '05', slug: 'conciliada', name: 'Conciliada', count: 0, color: '#06b6d4' },
    { num: '06', slug: 'rechazada', name: 'Rechazada', count: 0, color: '#ef4444' },
    { num: '07', slug: 'paso_7', name: 'Paso 7', count: 0, color: '#94a3b8' }
  ];

  // Invoices dataset from screenshots
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: 'inv-1',
      numero: 'PQ0158097',
      cufe: '735ff4d3...',
      proveedor: 'CAJASAN',
      nit: '890200106',
      emision: '08 Sep, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$15.865',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-2',
      numero: 'E6100879670',
      cufe: 'e07e345a...',
      proveedor: 'COMUNICACION CELULAR S A COMCEL S A',
      nit: '800153993',
      emision: '06 Sep, 2026',
      vencimiento: '14 Sep, 2026',
      diasVencida: 'hace 16 días',
      tipoPago: 'CREDITO',
      claseCC: null,
      total: '$39.900',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-3',
      numero: 'Z0344002846',
      cufe: '86510a7d...',
      proveedor: 'COLOMBIANA DE COMERCIO S.A.',
      nit: '890900943',
      emision: '17 Ago, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$61.835',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-4',
      numero: 'Z0344002845',
      cufe: 'b695b22b...',
      proveedor: 'COLOMBIANA DE COMERCIO S.A.',
      nit: '890900943',
      emision: '17 Ago, 2026',
      vencimiento: '16 Sep, 2026',
      diasVencida: 'hace 14 días',
      tipoPago: 'CREDITO',
      claseCC: null,
      total: '$1.460.098',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-5',
      numero: 'PQ0263785',
      cufe: '653d2db9...',
      proveedor: 'CAJASAN',
      nit: '890200106',
      emision: '11 Ago, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$15.865',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-6',
      numero: 'E6089917659',
      cufe: '818b0e9d...',
      proveedor: 'COMUNICACION CELULAR S A COMCEL S A',
      nit: '800153993',
      emision: '07 Ago, 2026',
      vencimiento: '14 Ago, 2026',
      diasVencida: 'hace 47 días',
      tipoPago: 'CREDITO',
      claseCC: null,
      total: '$39.900',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-7',
      numero: 'PQ0156465',
      cufe: 'd24b5cf3...',
      proveedor: 'CAJASAN',
      nit: '890200106',
      emision: '27 Jul, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$8.100',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-8',
      numero: 'PQ0156343',
      cufe: '8d4a62e3...',
      proveedor: 'CAJASAN',
      nit: '890200106',
      emision: '23 Jul, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$12.692',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-9',
      numero: 'E6078872290',
      cufe: 'a3b4da77...',
      proveedor: 'COMUNICACION CELULAR S A COMCEL S A',
      nit: '800153993',
      emision: '06 Jul, 2026',
      vencimiento: '14 Jul, 2026',
      diasVencida: 'hace 78 días',
      tipoPago: 'CREDITO',
      claseCC: null,
      total: '$39.900',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-10',
      numero: 'PQ0261796',
      cufe: 'dff84f3b...',
      proveedor: 'CAJASAN',
      nit: '890200106',
      emision: '30 Jun, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$11.600',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-11',
      numero: 'SETG980000070',
      cufe: 'b84c417e...',
      proveedor: 'GOMEZ MANCILLA L...',
      nit: '63271907',
      emision: '17 Jun, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$160.000',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-12',
      numero: 'FMT462886',
      cufe: '34516fc9...',
      proveedor: 'COMERCIALIZADORA SAS',
      nit: '900481856',
      emision: '13 Jun, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$101.611',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-13',
      numero: 'E6066899238',
      cufe: 'f5a345c3...',
      proveedor: 'COMUNICACION CELULAR S A COMCEL S A',
      nit: '800153993',
      emision: '06 Jun, 2026',
      vencimiento: '16 Jun, 2026',
      diasVencida: 'hace 106 días',
      tipoPago: 'CREDITO',
      claseCC: null,
      total: '$39.900',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-14',
      numero: 'CACQ452742',
      cufe: 'c43946d5...',
      proveedor: 'CINE COLOMBIA S.A.S.',
      nit: '890900076',
      emision: '05 Jun, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$63.000',
      estadoSlug: 'recibida'
    },
    {
      id: 'inv-15',
      numero: 'CACQ452786',
      cufe: '2bcab8d6...',
      proveedor: 'CINE COLOMBIA S.A.S.',
      nit: '890900076',
      emision: '05 Jun, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: 'CONTADO',
      claseCC: null,
      total: '$12.600',
      estadoSlug: 'recibida'
    }
  ]);

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    // Step filter
    if (activeStepFilter !== 'todas' && inv.estadoSlug !== activeStepFilter) {
      return false;
    }
    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        inv.numero.toLowerCase().includes(q) ||
        inv.proveedor.toLowerCase().includes(q) ||
        inv.nit.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((i) => i.id));
    }
  };

  const handleToggleInvoice = (id: string) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((item) => item !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const handleExecuteSync = () => {
    setIsSyncModalOpen(false);
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('30 Sep 2026, 05:00 PM');
      showToast('Sincronización completada. Buzón al día.');
    }, 1800);
  };

  const handleSaveManualInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim() || !manualProvider.trim()) {
      alert('Completa el número de factura y el proveedor.');
      return;
    }

    const newInv: InvoiceItem = {
      id: `inv-${Date.now()}`,
      numero: invoiceNumber.trim(),
      cufe: 'fe98a12c...',
      proveedor: manualProvider.trim(),
      nit: '900580962',
      emision: issueDate || '30 Sep, 2026',
      vencimiento: null,
      diasVencida: null,
      tipoPago: paymentType === 'Contado' ? 'CONTADO' : 'CREDITO',
      claseCC: null,
      total: `$${totalAmount}`,
      estadoSlug: 'recibida'
    };

    setInvoices([newInv, ...invoices]);
    setViewMode('list');
    showToast(`Factura ${newInv.numero} registrada exitosamente`);
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

      {/* ======================================================== */}
      {/* VIEW 1: Main Gestión de Pagos (Screenshots 1, 2, 3, 4, 8, 9) */}
      {/* ======================================================== */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Gestión de pagos
              </h1>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
                RECEPCIÓN Y GESTIÓN DE FACTURACIÓN ELECTRÓNICA DIAN
              </p>
            </div>

            <button
              onClick={() => setViewMode('add-invoice')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Factura</span>
            </button>
          </div>

          {/* Sincronización Inteligente de Buzón Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">
                    Sincronización Inteligente de Buzón
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Clock className="w-3 h-3" />
                    AUTO CADA 5 MIN
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Última ejecución: <strong>{lastSyncTime}</strong> (Facturas extraídas: 0)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer ${
                  showHistory
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Ver Historial</span>
              </button>

              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl pl-3 pr-8 py-2 shadow-2xs focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                >
                  <option value="Últimos 7 días">Últimos 7 días</option>
                  <option value="Últimos 15 días">Últimos 15 días</option>
                  <option value="Este mes">Este mes</option>
                  <option value="Año en curso">Año en curso</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* Sync Button or Syncing State */}
              {isSyncing ? (
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2 bg-[#818cf8] text-white text-xs font-semibold rounded-xl shadow-sm cursor-wait animate-pulse"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sincronizando...</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSyncModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Buscar Facturas Nuevas</span>
                </button>
              )}
            </div>
          </div>

          {/* ÚLTIMAS 5 EJECUCIONES DE BÚSQUEDA (Screenshot exact match) */}
          {showHistory && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3.5 animate-in fade-in slide-in-from-top-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ÚLTIMAS 5 EJECUCIONES DE BÚSQUEDA
              </div>

              <div className="space-y-2.5">
                {syncExecutions.map((exec) => (
                  <div
                    key={exec.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                  >
                    {/* Left: Checkmark + Date + Origin */}
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-emerald-500 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>

                      <div className="font-bold text-slate-900">
                        {exec.date}
                      </div>

                      <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                        <span>◦</span>
                        <span>Origen: {exec.origin}</span>
                      </div>
                    </div>

                    {/* Right: Badges */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <span>✉</span>
                        <span>{exec.processedEmails} procesados</span>
                      </div>

                      <div className="px-2.5 py-0.5 rounded-md border border-indigo-100 bg-indigo-50/60 text-[#4338ca] font-bold text-[11px] font-mono">
                        {exec.xmlCount} Facturas XML
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workflow Stepper / Pipeline Tabs Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setActiveStepFilter('todas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeStepFilter === 'todas'
                    ? 'bg-slate-100 text-slate-900 border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Todas</span>
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full ml-1">
                  58
                </span>
              </button>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2 border-l border-slate-200">
                FLUJO DE TRABAJO
              </span>
            </div>

            {/* Stepper Pipeline Circles */}
            <div className="overflow-x-auto pb-2 scrollbar-none">
              <div className="flex items-center justify-between min-w-[750px] px-4 relative">
                {/* Horizontal line connector */}
                <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-200 -z-0" />

                {pipelineSteps.map((step) => {
                  const isActive = activeStepFilter === step.slug;
                  return (
                    <button
                      key={step.slug}
                      type="button"
                      onClick={() => setActiveStepFilter(step.slug)}
                      className="relative z-10 flex flex-col items-center group cursor-pointer"
                    >
                      {/* Circle Node */}
                      <div
                        style={{
                          backgroundColor: isActive ? step.color : '#ffffff',
                          borderColor: step.color,
                          color: isActive ? '#ffffff' : step.color
                        }}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-xs transition-transform ${
                          isActive ? 'scale-110 shadow-md ring-4 ring-slate-100' : 'hover:scale-105'
                        }`}
                      >
                        {isActive && step.slug === 'recibida' ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          step.num
                        )}
                      </div>

                      {/* Step Name */}
                      <div className="text-xs font-semibold text-slate-700 mt-2 flex items-center gap-1">
                        <span>{step.name}</span>
                      </div>

                      {/* Count Pill */}
                      <div className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">
                        {step.count}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search, Filter & Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Search Strip */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  BUSCAR EN {activeStepFilter.toUpperCase()}
                </span>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Proveedor, NIT o # Factura..."
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-end pt-5">
                <button
                  type="button"
                  onClick={() => showToast('Filtros avanzados abiertos')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filtros</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Exportando reporte a Excel...')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Buscar</span>
                </button>
              </div>
            </div>

            {/* Invoices Table or Empty State */}
            {filteredInvoices.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <FileText className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  No se encontraron facturas en estado &quot;{activeStepFilter}&quot;
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedInvoices.length === filteredInvoices.length &&
                            filteredInvoices.length > 0
                          }
                          onChange={handleToggleSelectAll}
                          className="rounded text-indigo-600 cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-4">FACTURA</th>
                      <th className="py-3.5 px-4">PROVEEDOR</th>
                      <th className="py-3.5 px-4">EMISIÓN</th>
                      <th className="py-3.5 px-4">VENCIMIENTO</th>
                      <th className="py-3.5 px-4 text-center">PAGO</th>
                      <th className="py-3.5 px-4 text-center">CLASE / CC</th>
                      <th className="py-3.5 px-4 text-right">TOTAL</th>
                      <th className="py-3.5 px-4 text-center">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(inv.id)}
                            onChange={() => handleToggleInvoice(inv.id)}
                            className="rounded text-indigo-600 cursor-pointer"
                          />
                        </td>

                        {/* FACTURA */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold font-mono text-slate-900 cursor-pointer hover:underline">
                                {inv.numero}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {inv.cufe}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* PROVEEDOR */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="font-bold text-slate-900 truncate">
                            {inv.proveedor}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            NIT: {inv.nit}
                          </div>
                        </td>

                        {/* EMISIÓN */}
                        <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                          {inv.emision}
                        </td>

                        {/* VENCIMIENTO */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {inv.vencimiento ? (
                            <div>
                              <div className="font-mono text-slate-800">{inv.vencimiento}</div>
                              {inv.diasVencida && (
                                <div className="text-[10px] font-semibold text-rose-600">
                                  {inv.diasVencida}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300 font-mono">—</span>
                          )}
                        </td>

                        {/* PAGO */}
                        <td className="py-3.5 px-4 text-center">
                          {inv.tipoPago === 'CONTADO' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              💵 CONTADO
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              💳 CREDITO
                            </span>
                          )}
                        </td>

                        {/* CLASE / CC */}
                        <td className="py-3.5 px-4 text-center text-slate-300 font-mono">
                          —
                        </td>

                        {/* TOTAL */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="font-bold font-mono text-slate-900 text-sm">
                            {inv.total}
                          </div>
                          <div className="text-[9px] font-mono text-slate-400">COP</div>
                        </td>

                        {/* ACCIÓN */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => showToast(`Detalles de la factura ${inv.numero}`)}
                            className="w-7 h-7 rounded-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors mx-auto cursor-pointer"
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

            {/* Pagination strip */}
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Mostrando página 1 de 4 (58 registros)
              </div>

              <div className="flex items-center gap-1 font-mono">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === 1
                      ? 'bg-[#4338ca] text-white shadow-2xs'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(3)}
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(4)}
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  4
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs flex items-center justify-center"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: Agregar Factura Manualmente (Screenshots 5, 6, 7) */}
      {/* ======================================================== */}
      {viewMode === 'add-invoice' && (
        <div className="space-y-6">
          {/* Breadcrumb return link */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('list')}
              className="hover:text-slate-700 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>FACTURAS</span>
            </button>
            <span>&gt;</span>
            <span className="text-slate-600">AGREGAR FACTURA</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Agregar Factura Manualmente
            </h1>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
              SUBE UN ZIP CON FACTURA ELECTRÓNICA O INGRESA LOS DATOS MANUALMENTE
            </p>
          </div>

          {/* Top 2 Tabs Pill: Subir ZIP vs Ingreso Manual */}
          <div className="grid grid-cols-2 max-w-md gap-3">
            <button
              type="button"
              onClick={() => setAddMode('zip')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                addMode === 'zip'
                  ? 'bg-[#4338ca] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileArchive className="w-4 h-4" />
              <span>Subir ZIP (XML + PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => setAddMode('manual')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                addMode === 'manual'
                  ? 'bg-[#4338ca] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Ingreso Manual</span>
            </button>
          </div>

          {/* TAB 1: Subir ZIP (XML + PDF) - Screenshot 5 */}
          {addMode === 'zip' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-8 space-y-6">
              <div className="text-center max-w-md mx-auto space-y-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                  <FileArchive className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Subir Factura Electrónica (ZIP)
                </h3>
                <p className="text-xs text-slate-500">
                  El sistema extraerá automáticamente los datos del XML contenido en el ZIP
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div className="max-w-2xl mx-auto border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer">
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-800">
                  Arrastra tu archivo ZIP aquí o haz clic para seleccionar
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Máximo 10MB · Debe contener al menos un archivo XML de factura DIAN
                </div>
              </div>

              <div className="max-w-md mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => showToast('Archivo procesado y registrado')}
                  className="w-full py-3 bg-[#818cf8] hover:bg-[#6366f1] text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Procesar y Registrar Factura
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Ingreso Manual - Screenshots 6 & 7 */}
          {addMode === 'manual' && (
            <form onSubmit={handleSaveManualInvoice} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-8 space-y-8">
              <div className="text-center max-w-md mx-auto space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Ingreso Manual de Factura
                </h3>
                <p className="text-xs text-slate-500">
                  Ingresa los datos de la factura o cotización por pagar
                </p>
              </div>

              {/* SECCIÓN: PROVEEDOR */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>PROVEEDOR</span>
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={manualProvider}
                    onChange={(e) => setManualProvider(e.target.value)}
                    placeholder="Buscar proveedor por NIT o nombre..."
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>ℹ️ Escribe al menos 2 caracteres. Si no encuentras el proveedor, podrás crearlo.</span>
                </div>
              </div>

              {/* SECCIÓN: DATOS DEL DOCUMENTO */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  DATOS DEL DOCUMENTO
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      TIPO DE DOCUMENTO
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="Factura">Factura</option>
                      <option value="Cotización">Cotización</option>
                      <option value="Cuenta de Cobro">Cuenta de Cobro</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      NÚMERO DE FACTURA *
                    </label>
                    <input
                      type="text"
                      required
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="FE-12345"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    FECHA DE EMISIÓN *
                  </label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* SECCIÓN: MONTOS Y CLASIFICACIÓN (Screenshot 7) */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  MONTOS Y CLASIFICACIÓN
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      TOTAL A PAGAR *
                    </label>
                    <input
                      type="text"
                      required
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      IMPUESTOS (IVA)
                    </label>
                    <input
                      type="text"
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      TIPO DE PAGO
                    </label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as any)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="Contado">Contado</option>
                      <option value="Crédito">Crédito</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      MONEDA
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="COP - Peso Colombiano">COP - Peso Colombiano</option>
                      <option value="USD - Dólar Estadounidense">USD - Dólar Estadounidense</option>
                    </select>
                  </div>
                </div>

                {/* CLASIFICACIÓN (opcional) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    🏷️ CLASIFICACIÓN <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white">
                      <option value="">— Seleccionar —</option>
                      <option value="Gastos Operacionales">Gastos Operacionales</option>
                      <option value="Gastos Administrativos">Gastos Administrativos</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Monto"
                      className="w-24 text-xs px-2.5 py-2 rounded-lg border border-slate-200 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="% %"
                      className="w-16 text-xs px-2 py-2 rounded-lg border border-slate-200 font-mono text-center"
                    />
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center font-bold text-slate-600"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Repartido: $0,00 (0,00%)</span>
                    <span>Restante: <strong>$0,00</strong></span>
                  </div>
                </div>

                {/* CENTRO DE COSTOS (opcional) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    🏢 CENTRO DE COSTOS <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white">
                      <option value="">— Seleccionar —</option>
                      <option value="Administración">Administración</option>
                      <option value="Ventas">Ventas</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Monto"
                      className="w-24 text-xs px-2.5 py-2 rounded-lg border border-slate-200 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="% %"
                      className="w-16 text-xs px-2 py-2 rounded-lg border border-slate-200 font-mono text-center"
                    />
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center font-bold text-slate-600"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Repartido: $0,00 (0,00%)</span>
                    <span>Restante: <strong>$0,00</strong></span>
                  </div>
                </div>
              </div>

              {/* SECCIÓN: INFORMACIÓN ADICIONAL */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  INFORMACIÓN ADICIONAL
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    NOTAS / OBSERVACIONES
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Descripción, concepto o notas adicionales..."
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                {/* DOCUMENTO ADJUNTO */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    📎 DOCUMENTO ADJUNTO (COTIZACIÓN, FACTURA PDF, IMAGEN)
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 bg-[#4338ca] text-white text-xs font-semibold rounded-lg shadow-xs"
                    >
                      Seleccionar archivo
                    </button>
                    <span className="text-xs text-slate-400">Ningún archivo seleccionado</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Máximo 5MB · PDF, JPG, PNG o WEBP
                  </div>
                </div>
              </div>

              {/* Submit Full Width Green Button (Screenshot 7) */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Registrar Factura</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* MODAL: Sincronizar Buzón (Screenshot 8) */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-sm w-full text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3">
              <Info className="w-6 h-6 text-indigo-600" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              Sincronizar Buzón
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Se buscarán mensajes con archivos de facturación en tu cuenta vinculada para el rango seleccionado.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleExecuteSync}
                className="flex-1 py-2.5 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Iniciar Búsqueda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
