import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GitFork,
  ArrowLeft,
  Settings,
  Pencil,
  Trash2,
  Lock,
  Plus,
  RotateCcw,
  Save,
  Check,
  X,
  FileText,
  Mail,
  Eye,
  ThumbsUp,
  CreditCard,
  CheckCircle2,
  FileSpreadsheet,
  Ban,
  AlertTriangle,
  Star,
  Flag,
  Bookmark,
  Clock,
  DollarSign,
  Calendar,
  Truck,
  Building,
  Scale,
  Paperclip,
  User,
  Tag,
  Building2,
  Percent,
  Copy,
  Undo2,
  GripVertical,
  AlertCircle
} from 'lucide-react';

import { WorkflowJuridicaView } from './WorkflowJuridicaView';

interface StepConfig {
  id: string;
  name: string;
  slug: string;
  color: string;
  category: 'Entrada' | 'Revisión' | 'Pago' | 'Cerrado' | 'Rechazado';
  iconName: string;
  facturasCount?: number;
  // Properties
  isInitial?: boolean;
  isTerminal?: boolean;
  requiresReceipt?: boolean;
  requiresAssignment?: boolean;
  requiresSchedule?: boolean;
  requiresClassification?: boolean;
  requiresCostCenter?: boolean;
  requiresTaxLiquidation?: boolean;
  allowsBulkAction?: boolean;
  allowsReturn?: boolean;
  allowedTransitions: string[];
}

export const WorkflowView: React.FC = () => {
  const { setActiveMenu } = useApp();

  // Mode: 'list' (Flujos Configurados) | 'edit-invoices' (Flujo de Facturas) | 'edit-juridica' (Flujo de Gestión Jurídica)
  const [viewMode, setViewMode] = useState<'list' | 'edit-invoices' | 'edit-juridica'>('list');
  const [isFlujoHabilitado, setIsFlujoHabilitado] = useState(true);
  const [isJuridicaHabilitado, setIsJuridicaHabilitado] = useState(true);
  const [hoveredToggle, setHoveredToggle] = useState(false);
  const [hoveredJuridicaToggle, setHoveredJuridicaToggle] = useState(false);
  const [confirmDisableFlow, setConfirmDisableFlow] = useState<'invoices' | 'juridica' | null>(null);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDropStep = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(dropIndex, 0, movedStep);
    setSteps(newSteps);
    setDraggedIndex(null);
    setDragOverIndex(null);
    showToast('Orden de pasos actualizado');
  };

  // Steps state
  const [steps, setSteps] = useState<StepConfig[]>([
    {
      id: 'step-recibida',
      name: 'Recibida',
      slug: 'recibida',
      color: '#f59e0b', // Amber
      category: 'Entrada',
      iconName: 'Mail',
      facturasCount: 58,
      isInitial: true,
      isTerminal: false,
      allowsBulkAction: true,
      allowedTransitions: ['revisada', 'rechazada']
    },
    {
      id: 'step-revisada',
      name: 'Revisada',
      slug: 'revisada',
      color: '#3b82f6', // Blue
      category: 'Revisión',
      iconName: 'Eye',
      isInitial: false,
      isTerminal: false,
      requiresClassification: true,
      requiresCostCenter: true,
      allowedTransitions: ['aprobada', 'rechazada']
    },
    {
      id: 'step-aprobada',
      name: 'Aprobada',
      slug: 'aprobada',
      color: '#10b981', // Emerald
      category: 'Revisión',
      iconName: 'ThumbsUp',
      isInitial: false,
      isTerminal: false,
      requiresAssignment: true,
      allowedTransitions: ['debitada', 'rechazada']
    },
    {
      id: 'step-debitada',
      name: 'Debitada',
      slug: 'debitada',
      color: '#8b5cf6', // Purple
      category: 'Pago',
      iconName: 'CreditCard',
      isInitial: false,
      isTerminal: false,
      requiresReceipt: true,
      allowedTransitions: ['conciliada', 'rechazada']
    },
    {
      id: 'step-conciliada',
      name: 'Conciliada',
      slug: 'conciliada',
      color: '#06b6d4', // Teal/Cyan
      category: 'Cerrado',
      iconName: 'FileText',
      isInitial: false,
      isTerminal: true,
      allowedTransitions: []
    },
    {
      id: 'step-rechazada',
      name: 'Rechazada',
      slug: 'rechazada',
      color: '#ef4444', // Red
      category: 'Rechazado',
      iconName: 'X',
      isInitial: false,
      isTerminal: true,
      allowedTransitions: []
    }
  ]);

  // Modal configure step
  const [activeStepConfig, setActiveStepConfig] = useState<StepConfig | null>(null);

  // Modal delete step
  const [stepToDelete, setStepToDelete] = useState<StepConfig | null>(null);
  const [hoveredTrashId, setHoveredTrashId] = useState<string | null>(null);

  // New field in modal
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('Texto');
  const [customFields, setCustomFields] = useState<string[]>([]);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateStepField = (id: string, field: keyof StepConfig, value: any) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleDeleteStep = (id: string) => {
    if (confirm('¿Deseas eliminar este paso del flujo de trabajo?')) {
      setSteps((prev) => prev.filter((s) => s.id !== id));
      showToast('Paso eliminado correctamente');
    }
  };

  const handleAddStep = () => {
    const newStep: StepConfig = {
      id: `step-${Date.now()}`,
      name: 'Nuevo Paso',
      slug: `paso_${steps.length + 1}`,
      color: '#6366f1',
      category: 'Revisión',
      iconName: 'FileText',
      allowedTransitions: []
    };
    setSteps([...steps, newStep]);
    showToast('Nuevo paso agregado');
  };

  const colorPalette = [
    '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6',
    '#06b6d4', '#ec4899', '#6366f1', '#84cc16',
    '#f97316', '#ef4444', '#14b8a6', '#64748b',
    '#94a3b8', '#a855f7', '#d946ef'
  ];

  const availableIcons = [
    { name: 'Mail', icon: Mail },
    { name: 'Eye', icon: Eye },
    { name: 'ThumbsUp', icon: ThumbsUp },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'FileText', icon: FileText },
    { name: 'X', icon: X },
    { name: 'Check', icon: Check },
    { name: 'Ban', icon: Ban },
    { name: 'AlertTriangle', icon: AlertTriangle },
    { name: 'Star', icon: Star },
    { name: 'Flag', icon: Flag },
    { name: 'Bookmark', icon: Bookmark },
    { name: 'Clock', icon: Clock },
    { name: 'DollarSign', icon: DollarSign },
    { name: 'Calendar', icon: Calendar },
    { name: 'Truck', icon: Truck },
    { name: 'Building', icon: Building },
    { name: 'Scale', icon: Scale }
  ];

  const renderIcon = (name: string, className = 'w-4 h-4') => {
    const found = availableIcons.find((i) => i.name === name);
    if (found) {
      const Comp = found.icon;
      return <Comp className={className} />;
    }
    return <FileText className={className} />;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-800">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-12 right-6 z-50 bg-[#4338ca] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* VIEW 1: Flujos Configurados (List Mode) */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <button
              onClick={() => setActiveMenu('mi-empresa')}
              className="hover:text-slate-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>VOLVER A CONFIGURACIÓN</span>
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Flujos de Trabajo
            </h1>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
              GESTIONA LOS FLUJOS DE TRABAJO DE TU EMPRESA
            </p>
          </div>

          {/* Info Banner */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-3">
            <span className="text-indigo-600 font-bold mt-0.5">ℹ️</span>
            <p className="text-indigo-900 leading-relaxed">
              Los flujos de trabajo se crean automáticamente cuando se activa un módulo para tu empresa. Desde aquí puedes configurar sus pasos o habilitarlos/inhabilitarlos.
            </p>
          </div>

          {/* Flujos Configurados List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span>Flujos Configurados</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                2
              </span>
            </div>

            {/* Flujo 1: Flujo de Facturas */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Flujo de Facturas</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Gestión de pagos · /my-company/invoices
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-md border ${
                    isFlujoHabilitado
                      ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {isFlujoHabilitado ? 'HABILITADO' : 'INHABILITADO'}
                </span>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setViewMode('edit-invoices')}
                  className="w-8 h-8 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                  title="Editar flujo de facturas"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Toggle Button with "Inhabilitar" Tooltip */}
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredToggle(true)}
                    onMouseLeave={() => setHoveredToggle(false)}
                    onClick={() => {
                      if (isFlujoHabilitado) {
                        setConfirmDisableFlow('invoices');
                      } else {
                        setIsFlujoHabilitado(true);
                        showToast('Flujo habilitado exitosamente');
                      }
                    }}
                    className="w-8 h-8 rounded-lg border border-amber-300 text-amber-500 hover:bg-amber-50 flex items-center justify-center transition-colors cursor-pointer"
                    title={isFlujoHabilitado ? 'Inhabilitar' : 'Habilitar'}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-amber-500"
                    >
                      <rect x="2" y="6" width="20" height="12" rx="6" />
                      <circle cx={isFlujoHabilitado ? "16" : "8"} cy="12" r="3" fill="currentColor" />
                    </svg>
                  </button>

                  {/* Tooltip matching screenshot */}
                  {hoveredToggle && (
                    <div className="absolute right-0 top-10 z-30 bg-white border border-slate-800 text-slate-900 text-xs px-2.5 py-1 rounded shadow-md whitespace-nowrap font-medium animate-in fade-in">
                      {isFlujoHabilitado ? 'Inhabilitar' : 'Habilitar'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Flujo 2: Flujo de Gestión Jurídica (Nuevo Flujo) */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 flex items-center justify-between hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-purple-100">
                  <Scale className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Flujo de Legalidad</h3>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-purple-100 text-purple-800">
                      5 Submódulos
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Gestión Jurídica · /my-company/legal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-md border ${
                    isJuridicaHabilitado
                      ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {isJuridicaHabilitado ? 'HABILITADO' : 'INHABILITADO'}
                </span>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setViewMode('edit-juridica')}
                  className="w-8 h-8 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                  title="Configurar flujo de gestión jurídica"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Toggle Button */}
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredJuridicaToggle(true)}
                    onMouseLeave={() => setHoveredJuridicaToggle(false)}
                    onClick={() => {
                      if (isJuridicaHabilitado) {
                        setConfirmDisableFlow('juridica');
                      } else {
                        setIsJuridicaHabilitado(true);
                        showToast('Flujo jurídico habilitado exitosamente');
                      }
                    }}
                    className="w-8 h-8 rounded-lg border border-amber-300 text-amber-500 hover:bg-amber-50 flex items-center justify-center transition-colors cursor-pointer"
                    title={isJuridicaHabilitado ? 'Inhabilitar' : 'Habilitar'}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-amber-500"
                    >
                      <rect x="2" y="6" width="20" height="12" rx="6" />
                      <circle cx={isJuridicaHabilitado ? "16" : "8"} cy="12" r="3" fill="currentColor" />
                    </svg>
                  </button>

                  {hoveredJuridicaToggle && (
                    <div className="absolute right-0 top-10 z-30 bg-white border border-slate-800 text-slate-900 text-xs px-2.5 py-1 rounded shadow-md whitespace-nowrap font-medium animate-in fade-in">
                      {isJuridicaHabilitado ? 'Inhabilitar' : 'Habilitar'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Flujo de Gestión Jurídica Editor */}
      {viewMode === 'edit-juridica' && (
        <WorkflowJuridicaView onBack={() => setViewMode('list')} />
      )}

      {/* VIEW 2: Editar Flujo de Facturas (Full Editor matching screenshot 2 & 3) */}
      {viewMode === 'edit-invoices' && (
        <div className="space-y-6">
          {/* Top Return & Breadcrumb */}
          <div className="space-y-1">
            <button
              onClick={() => setViewMode('list')}
              className="text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>VOLVER A CONFIGURACIÓN</span>
            </button>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              🔀 FLUJOS DE TRABAJO &gt; FLUJO DE FACTURAS
            </div>
          </div>

          {/* Header Title + Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#4338ca] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                <GitFork className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Flujo de Facturas
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define los pasos, colores y transiciones del flujo de facturas de tu empresa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => showToast('Flujo restaurado a valores por defecto')}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar por Defecto</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('Cambios del flujo guardados exitosamente')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>

          {/* Dark Preview Card: "Vista Previa del Flujo" */}
          <div className="bg-[#0b1026] text-white rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Vista Previa del Flujo</span>
            </div>

            {/* Pipeline Pills Row */}
            <div className="flex items-center flex-wrap gap-2 pt-1">
              {steps
                .filter((s) => s.category !== 'Rechazado')
                .map((s, idx, arr) => (
                  <React.Fragment key={s.id}>
                    <div
                      style={{ borderColor: s.color, color: s.color }}
                      className="px-3 py-1.5 rounded-lg border font-semibold text-xs flex items-center gap-2 bg-slate-900/60"
                    >
                      {renderIcon(s.iconName, 'w-3.5 h-3.5')}
                      <span>{s.name}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <span className="text-slate-600 font-bold">&gt;</span>
                    )}
                  </React.Fragment>
                ))}
            </div>

            {/* Second row: Rama de Rechazo */}
            {steps.some((s) => s.category === 'Rechazado') && (
              <div className="pt-2">
                {steps
                  .filter((s) => s.category === 'Rechazado')
                  .map((s) => (
                    <div
                      key={s.id}
                      style={{ borderColor: s.color, color: s.color }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-xs bg-slate-900/60"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{s.name}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Footer of Dark Box */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="flex items-center gap-4">
                <span>&gt; Flujo principal</span>
                <span>--- Rama de rechazo</span>
              </div>
              <span>{steps.length} pasos</span>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isBlockedSlug = (step.facturasCount || 0) > 0;
              const isBeingDragged = draggedIndex === index;
              const isDragOver = dragOverIndex === index && draggedIndex !== index;

              return (
                <div
                  key={step.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', index.toString());
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverIndex !== index) {
                      setDragOverIndex(index);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverIndex === index) {
                      setDragOverIndex(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropStep(index);
                  }}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                  style={{ borderLeftColor: step.color, borderLeftWidth: '5px' }}
                  className={`bg-white rounded-xl border shadow-xs p-5 transition-all select-none ${
                    isBeingDragged
                      ? 'opacity-70 scale-[1.01] shadow-2xl border-indigo-400 ring-2 ring-indigo-300 z-20 cursor-grabbing'
                      : isDragOver
                      ? 'border-indigo-400 ring-2 ring-indigo-300 ring-offset-2 bg-indigo-50/30'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Drag Handle + Step Icon */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div
                        className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Arrastra para reordenar libremente"
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <div
                        style={{ backgroundColor: `${step.color}15`, color: step.color }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0"
                      >
                        {renderIcon(step.iconName, 'w-6 h-6')}
                      </div>
                    </div>

                    {/* Middle Fields: NOMBRE + SLUG */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* NOMBRE */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          NOMBRE
                        </label>
                        <input
                          type="text"
                          value={step.name}
                          onChange={(e) => handleUpdateStepField(step.id, 'name', e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                        />
                      </div>

                      {/* SLUG */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          SLUG (ID INTERNO)
                        </label>
                        <input
                          type="text"
                          disabled={isBlockedSlug}
                          value={step.slug}
                          onChange={(e) => handleUpdateStepField(step.id, 'slug', e.target.value)}
                          className={`w-full text-xs font-mono px-3 py-2 rounded-lg border ${
                            isBlockedSlug
                              ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                              : 'border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600'
                          }`}
                        />
                        {isBlockedSlug && (
                          <div className="text-[10px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>{step.facturasCount} factura(s) en este estado — slug bloqueado</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: COLOR PALETTE + CATEGORÍA */}
                    <div className="flex items-center gap-6">
                      {/* Color Palette Grid */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          COLOR
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 w-24">
                          {colorPalette.slice(0, 8).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => handleUpdateStepField(step.id, 'color', c)}
                              style={{ backgroundColor: c }}
                              className={`w-4 h-4 rounded-sm transition-transform cursor-pointer ${
                                step.color === c ? 'ring-2 ring-slate-900 ring-offset-1 scale-110' : 'hover:scale-105'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* CATEGORÍA SELECT */}
                      <div className="space-y-1 w-32">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          CATEGORÍA
                        </label>
                        <select
                          value={step.category}
                          onChange={(e) => handleUpdateStepField(step.id, 'category', e.target.value)}
                          className="w-full text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                        >
                          <option value="Entrada">Entrada</option>
                          <option value="Revisión">Revisión</option>
                          <option value="Pago">Pago</option>
                          <option value="Cerrado">Cerrado</option>
                          <option value="Rechazado">Rechazado</option>
                        </select>
                      </div>

                      {/* Action buttons: Gear (Configure) & Trash with Tooltip */}
                      <div className="flex flex-col gap-1.5 pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveStepConfig(step)}
                          className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Configurar propiedades del paso"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onMouseEnter={() => setHoveredTrashId(step.id)}
                            onMouseLeave={() => setHoveredTrashId(null)}
                            onClick={() => setStepToDelete(step)}
                            className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Tooltip matching screenshot 1 */}
                          {hoveredTrashId === step.id && (
                            <div className="absolute left-9 top-0 z-30 bg-white border border-slate-900 text-slate-900 text-xs px-2.5 py-1 rounded shadow-md whitespace-nowrap font-medium pointer-events-none animate-in fade-in">
                              Eliminar paso
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom Button: + Agregar Nuevo Paso */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-700 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Agregar Nuevo Paso</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP CONFIGURATION MODAL (Triggered by the Gear ⚙️ icon - Screenshots 4 & 5) */}
      {activeStepConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: `${activeStepConfig.color}20`, color: activeStepConfig.color }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                >
                  {renderIcon(activeStepConfig.iconName, 'w-5 h-5')}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Configurar: {activeStepConfig.name}
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    {activeStepConfig.slug}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveStepConfig(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - 2 Columns */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* LEFT COLUMN: Ícono del Paso + Transiciones + Políticas */}
              <div className="space-y-6">
                {/* 1. ÍCONO DEL PASO */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>ÍCONO DEL PASO</span>
                  </div>
                  <div className="grid grid-cols-6 gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                    {availableIcons.map((ic) => {
                      const IconComp = ic.icon;
                      const isSelected = activeStepConfig.iconName === ic.name;
                      return (
                        <button
                          key={ic.name}
                          type="button"
                          onClick={() => {
                            setActiveStepConfig({ ...activeStepConfig, iconName: ic.name });
                            handleUpdateStepField(activeStepConfig.id, 'iconName', ic.name);
                          }}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#4338ca] text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. TRANSICIONES PERMITIDAS */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>TRANSICIONES PERMITIDAS</span>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 bg-white">
                    {steps
                      .filter((s) => s.id !== activeStepConfig.id)
                      .map((otherStep) => {
                        const isChecked = activeStepConfig.allowedTransitions.includes(otherStep.slug);
                        return (
                          <label
                            key={otherStep.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const newTransitions = e.target.checked
                                  ? [...activeStepConfig.allowedTransitions, otherStep.slug]
                                  : activeStepConfig.allowedTransitions.filter((t) => t !== otherStep.slug);
                                setActiveStepConfig({
                                  ...activeStepConfig,
                                  allowedTransitions: newTransitions
                                });
                                handleUpdateStepField(activeStepConfig.id, 'allowedTransitions', newTransitions);
                              }}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex items-center gap-2">
                              {renderIcon(otherStep.iconName, 'w-3.5 h-3.5 text-slate-500')}
                              <span className="font-semibold text-slate-800">{otherStep.name}</span>
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>

                {/* 3. POLÍTICAS DEL PASO */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    POLÍTICAS DEL PASO
                  </div>
                  <p className="text-slate-400 italic text-[11px]">
                    No hay políticas disponibles. Créalas en Configuración → Políticas.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: PROPIEDADES DEL PASO (Cards) + CAMPOS REQUERIDOS */}
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  PROPIEDADES DEL PASO
                </div>

                {/* List of 10 Property Cards matching screenshots */}
                <div className="space-y-2">
                  {/* Estado Inicial */}
                  <label className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between cursor-pointer hover:border-slate-300">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.isInitial}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, isInitial: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'isInitial', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Estado Inicial</div>
                        <div className="text-[11px] text-slate-400">Primera etapa de las facturas nuevas</div>
                      </div>
                    </div>
                    <Flag className="w-4 h-4 text-slate-300" />
                  </label>

                  {/* Estado Terminal */}
                  <label className="p-3 rounded-xl border border-blue-200 bg-blue-50/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.isTerminal}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, isTerminal: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'isTerminal', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Estado Terminal</div>
                        <div className="text-[11px] text-slate-400">Sin transiciones de salida</div>
                      </div>
                    </div>
                    <Lock className="w-4 h-4 text-slate-400" />
                  </label>

                  {/* Requiere Comprobante */}
                  <label className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between cursor-pointer hover:border-slate-300">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.requiresReceipt}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, requiresReceipt: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'requiresReceipt', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Requiere Comprobante</div>
                        <div className="text-[11px] text-slate-400">Obliga a adjuntar archivo de pago</div>
                      </div>
                    </div>
                    <Paperclip className="w-4 h-4 text-blue-500" />
                  </label>

                  {/* Requiere Asignación */}
                  <label className="p-3 rounded-xl border border-amber-200 bg-amber-50/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.requiresAssignment}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, requiresAssignment: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'requiresAssignment', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Requiere Asignación</div>
                        <div className="text-[11px] text-slate-400">Obliga a asignar a un usuario aprobador</div>
                      </div>
                    </div>
                    <User className="w-4 h-4 text-amber-500" />
                  </label>

                  {/* Requiere Agendar Pago */}
                  <label className="p-3 rounded-xl border border-purple-200 bg-purple-50/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.requiresSchedule}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, requiresSchedule: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'requiresSchedule', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Requiere Agendar Pago</div>
                        <div className="text-[11px] text-slate-400">Obliga a seleccionar fecha de pago al transicionar</div>
                      </div>
                    </div>
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </label>

                  {/* Requiere Clasificación */}
                  <label className="p-3 rounded-xl border border-teal-200 bg-teal-50/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.requiresClassification}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, requiresClassification: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'requiresClassification', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Requiere Clasificación</div>
                        <div className="text-[11px] text-slate-400">Obliga a clasificar la factura al transicionar</div>
                      </div>
                    </div>
                    <Tag className="w-4 h-4 text-teal-600" />
                  </label>

                  {/* Requiere Centro de Costos */}
                  <label className="p-3 rounded-xl border border-cyan-200 bg-cyan-50/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.requiresCostCenter}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, requiresCostCenter: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'requiresCostCenter', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Requiere Centro de Costos</div>
                        <div className="text-[11px] text-slate-400">Obliga a asignar un centro de costos al transicionar</div>
                      </div>
                    </div>
                    <Building2 className="w-4 h-4 text-cyan-600" />
                  </label>

                  {/* Requiere Liquidación Fiscal */}
                  <label className="p-3 rounded-xl border border-rose-200 bg-rose-50/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.requiresTaxLiquidation}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, requiresTaxLiquidation: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'requiresTaxLiquidation', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Requiere Liquidación Fiscal</div>
                        <div className="text-[11px] text-slate-400">Obliga a liquidar retenciones de impuestos al transicionar</div>
                      </div>
                    </div>
                    <Percent className="w-4 h-4 text-rose-500" />
                  </label>

                  {/* Permite Acción Masiva */}
                  <label className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.allowsBulkAction}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, allowsBulkAction: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'allowsBulkAction', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Permite Acción Masiva</div>
                        <div className="text-[11px] text-slate-400">Habilita checkboxes para gestionar múltiples facturas a la vez</div>
                      </div>
                    </div>
                    <Copy className="w-4 h-4 text-indigo-500" />
                  </label>

                  {/* Permite Devolución */}
                  <label className="p-3 rounded-xl border border-amber-200 bg-amber-50/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!activeStepConfig.allowsReturn}
                        onChange={(e) => {
                          setActiveStepConfig({ ...activeStepConfig, allowsReturn: e.target.checked });
                          handleUpdateStepField(activeStepConfig.id, 'allowsReturn', e.target.checked);
                        }}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Permite Devolución</div>
                        <div className="text-[11px] text-slate-400">Permite devolver la factura al paso anterior con comentario obligatorio</div>
                      </div>
                    </div>
                    <Undo2 className="w-4 h-4 text-amber-500" />
                  </label>
                </div>

                {/* CAMPOS REQUERIDOS DE SALIDA */}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    CAMPOS REQUERIDOS DE SALIDA
                  </div>
                  {customFields.length === 0 ? (
                    <p className="text-slate-400 italic text-[11px]">
                      No hay campos requeridos configurados.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {customFields.map((cf, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                          {cf}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form to add field */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 pt-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      AGREGAR CAMPO NUEVO
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="Nombre (ej: Orden Compra)"
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                      />
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value)}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Texto">Texto</option>
                        <option value="Número">Número</option>
                        <option value="Fecha">Fecha</option>
                        <option value="Archivo">Archivo</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newFieldName) {
                          setCustomFields([...customFields, `${newFieldName} (${newFieldType})`]);
                          setNewFieldName('');
                        }
                      }}
                      className="w-full py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      + Agregar Campo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStepConfig(null)}
                className="flex items-center gap-1.5 px-6 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Listo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN: ELIMINAR PASO (Matching Screenshot 2 exactly) */}
      {stepToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-sm w-full text-center animate-in zoom-in-95">
            {/* Top Warning Icon in soft rose square */}
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-rose-500" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Eliminar Paso
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              ¿Estás seguro de eliminar &quot;{stepToDelete.name}&quot;? Esta acción se aplicará al guardar.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStepToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  setSteps(steps.filter((s) => s.id !== stepToDelete.id));
                  showToast(`Paso "${stepToDelete.name}" eliminado`);
                  setStepToDelete(null);
                }}
                className="flex-1 py-2.5 px-4 bg-[#be123c] hover:bg-[#9f1239] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: "Inhabilitar flujo" (Matching Uploaded Screenshot Exactly) */}
      {confirmDisableFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-8 text-center space-y-4 animate-in zoom-in-95">
            {/* Soft Yellow Circle with Exclamation Icon */}
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-500">
              <AlertCircle className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Inhabilitar flujo
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                ¿Inhabilitar este flujo? Se ocultarán secciones en la vista asociada.
              </p>
            </div>

            {/* Buttons: Cancelar / Continuar */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setConfirmDisableFlow(null)}
                className="flex-1 py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirmDisableFlow === 'invoices') {
                    setIsFlujoHabilitado(false);
                    showToast('Flujo inhabilitado para tu empresa');
                  } else if (confirmDisableFlow === 'juridica') {
                    setIsJuridicaHabilitado(false);
                    showToast('Flujo jurídico inhabilitado para tu empresa');
                  }
                  setConfirmDisableFlow(null);
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
