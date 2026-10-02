import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useJuridicaWorkflow, JuridicaStep } from '../context/JuridicaWorkflowContext';
import {
  Scale,
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
  Ban,
  Clock,
  User,
  Paperclip,
  GripVertical,
  ShieldAlert,
  ShieldCheck,
  Undo2,
  Layers,
  ChevronDown,
  Info,
  Flag,
  Bookmark,
  Calendar,
  Building,
  AlertTriangle,
  Send,
  ArrowRight,
  Award,
  DollarSign,
  Star,
  SlidersHorizontal,
  CheckSquare,
  Shield,
  Truck
} from 'lucide-react';

interface WorkflowJuridicaViewProps {
  onBack?: () => void;
}

export const WorkflowJuridicaView: React.FC<WorkflowJuridicaViewProps> = ({ onBack }) => {
  const { setActiveMenu } = useApp();
  const {
    subModules,
    activeSubModuleId,
    setActiveSubModuleId,
    createSubModule,
    updateSubModule,
    deleteSubModule,
    updateStep,
    addStep,
    deleteStep,
    reorderSteps
  } = useJuridicaWorkflow();

  // Current active sub-module (Contratos, Demandas, Tutelas, PQRSF, Conceptos, etc.)
  const currentSubModule =
    subModules.find((sm) => sm.id === activeSubModuleId && sm.isActive) ||
    subModules.find((sm) => sm.isActive) ||
    subModules[0];

  // Steps state for the active sub-module
  const steps = currentSubModule.steps;

  // Selected step for properties modal (Gear icon)
  const [activeStepConfig, setActiveStepConfig] = useState<JuridicaStep | null>(null);
  const [hoveredTrashId, setHoveredTrashId] = useState<string | null>(null);
  const [stepToDelete, setStepToDelete] = useState<JuridicaStep | null>(null);
  const [showPropTooltip, setShowPropTooltip] = useState(false);

  // States for Nueva Tipología Modal
  const [isNewTypologyModalOpen, setIsNewTypologyModalOpen] = useState(false);
  const [newTypologyName, setNewTypologyName] = useState('');
  const [newTypologyCode, setNewTypologyCode] = useState('');
  const [newTypologyDesc, setNewTypologyDesc] = useState('');

  // States for Editar Tipología Modal
  const [editingTypology, setEditingTypology] = useState<any | null>(null);
  const [editTypologyName, setEditTypologyName] = useState('');
  const [editTypologyCode, setEditTypologyCode] = useState('');
  const [editTypologyDesc, setEditTypologyDesc] = useState('');

  // State for Eliminar Tipología Confirmation
  const [typologyToDelete, setTypologyToDelete] = useState<any | null>(null);

  // Modal Step Properties State
  const [modalIconName, setModalIconName] = useState('FileText');
  const [modalIsInitial, setModalIsInitial] = useState(false);
  const [modalIsTerminal, setModalIsTerminal] = useState(false);
  const [modalAllowedTransitions, setModalAllowedTransitions] = useState<string[]>([]);
  const [modalHasSLA, setModalHasSLA] = useState(false);
  const [modalSlaTime, setModalSlaTime] = useState(48);
  const [modalSlaUnit, setModalSlaUnit] = useState<'Horas' | 'Días'>('Horas');
  const [modalCustomFields, setModalCustomFields] = useState<string[]>([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('Texto');
  const [modalProps, setModalProps] = useState({
    requiresApproval: false,
    requiresDocument: false,
    allowEditItems: false,
    verifyCounterparts: false,
    requiresPolicy: false,
    allowRollback: false,
    allowDownloadPdf: false,
    allowUnify: false,
    allowBulkAction: false
  });

  const availableIcons = [
    { name: 'Mail', icon: Mail },
    { name: 'Eye', icon: Eye },
    { name: 'ThumbsUp', icon: ThumbsUp },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'Bookmark', icon: Bookmark },
    { name: 'X', icon: X },
    { name: 'Check', icon: Check },
    { name: 'CheckSquare', icon: CheckSquare },
    { name: 'FileText', icon: FileText },
    { name: 'Shield', icon: Shield },
    { name: 'Send', icon: Send },
    { name: 'ArrowRight', icon: ArrowRight },
    { name: 'CheckCircle2', icon: CheckCircle2 },
    { name: 'Lock', icon: Lock },
    { name: 'Ban', icon: Ban },
    { name: 'AlertTriangle', icon: AlertTriangle },
    { name: 'Star', icon: Star },
    { name: 'Flag', icon: Flag },
    { name: 'Clock', icon: Clock },
    { name: 'DollarSign', icon: DollarSign },
    { name: 'Calendar', icon: Calendar },
    { name: 'Truck', icon: Truck },
    { name: 'Building', icon: Building },
    { name: 'Scale', icon: Scale },
    { name: 'Award', icon: Award }
  ];

  // Toast Feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 12-Color Palette (Matching the screenshot grid: 3 rows of 4 colors)
  const colorPalette = [
    '#f59e0b', // Amber / Naranja
    '#3b82f6', // Blue / Azul
    '#10b981', // Emerald / Verde
    '#8b5cf6', // Purple / Morado
    '#f97316', // Orange / Salmón
    '#ec4899', // Pink / Rosa
    '#06b6d4', // Cyan / Celeste
    '#84cc16', // Lime / Lima
    '#64748b', // Slate / Gris
    '#a855f7', // Violet / Violeta
    '#e11d48', // Rose / Rojo
    '#14b8a6'  // Teal / Turquesa
  ];

  // Helper to render icon for each step
  const renderStepIcon = (iconOrSlug?: string, className = 'w-5 h-5') => {
    if (!iconOrSlug) return <FileText className={className} />;
    const found = availableIcons.find((i) => i.name === iconOrSlug);
    if (found) {
      const Comp = found.icon;
      return <Comp className={className} />;
    }
    const slug = iconOrSlug.toLowerCase();
    if (slug.includes('solicitud') || slug.includes('minuta') || slug.includes('identificacion') || slug.includes('radicacion')) {
      return <Mail className={className} />;
    }
    if (slug.includes('revision') || slug.includes('contestacion') || slug.includes('investigacion') || slug.includes('analisis')) {
      return <Eye className={className} />;
    }
    if (slug.includes('aprobacion') || slug.includes('visto_bueno') || slug.includes('firma')) {
      return <ThumbsUp className={className} />;
    }
    if (slug.includes('audiencias') || slug.includes('medida') || slug.includes('tramite')) {
      return <Scale className={className} />;
    }
    if (slug.includes('vigente') || slug.includes('ejecutoriada') || slug.includes('emitido') || slug.includes('notificada')) {
      return <CheckCircle2 className={className} />;
    }
    if (slug.includes('rechaz') || slug.includes('archiv')) {
      return <X className={className} />;
    }
    return <FileText className={className} />;
  };

  // Convert hex color to CSS class helper or use hex inline
  const getHexFromStepColor = (color: string) => {
    if (color.startsWith('#')) return color;
    switch (color) {
      case 'amber': return '#f59e0b';
      case 'blue': return '#3b82f6';
      case 'emerald': return '#10b981';
      case 'purple': return '#8b5cf6';
      case 'indigo': return '#6366f1';
      case 'red': return '#e11d48';
      default: return '#64748b';
    }
  };

  // Update a single field in a step
  const handleUpdateStepField = (stepId: string, field: string, value: any) => {
    updateStep(currentSubModule.id, stepId, { [field]: value });
  };

  // Open Configure Modal (Gear icon)
  const handleOpenStepConfig = (step: JuridicaStep) => {
    setActiveStepConfig(step);
    setModalIconName(step.iconName || 'FileText');
    setModalIsInitial(!!step.isInitial);
    setModalIsTerminal(!!step.isTerminal);
    setModalAllowedTransitions(step.allowedTransitions || []);
    setModalHasSLA(!!step.properties.hasSLA);
    setModalSlaTime(step.properties.slaTime || 48);
    setModalSlaUnit(step.properties.slaUnit || 'Horas');
    setModalCustomFields(step.properties.requiredOutputFields || []);
    setNewFieldName('');
    setNewFieldType('Texto');
    setModalProps({
      requiresApproval: !!step.properties.requiresApproval,
      requiresDocument: !!step.properties.requiresDocument,
      allowEditItems: !!step.properties.allowEditItems,
      verifyCounterparts: !!step.properties.verifyCounterparts,
      requiresPolicy: !!step.properties.requiresPolicy,
      allowRollback: !!step.properties.allowRollback,
      allowDownloadPdf: !!step.properties.allowDownloadPdf,
      allowUnify: !!step.properties.allowUnify,
      allowBulkAction: !!step.properties.allowBulkAction
    });
  };

  const handleSaveStepConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStepConfig) return;

    updateStep(currentSubModule.id, activeStepConfig.id, {
      iconName: modalIconName,
      isInitial: modalIsInitial,
      isTerminal: modalIsTerminal,
      allowedTransitions: modalAllowedTransitions,
      properties: {
        ...modalProps,
        hasSLA: modalHasSLA,
        slaTime: modalSlaTime,
        slaUnit: modalSlaUnit,
        requiredOutputFields: modalCustomFields
      }
    });

    showToast(`Paso "${activeStepConfig.name}" actualizado`);
    setActiveStepConfig(null);
  };

  // Add new step
  const handleAddNewStep = () => {
    const nextIdx = steps.length + 1;
    const newStep: JuridicaStep = {
      id: `step-jur-${Date.now()}`,
      name: `Paso ${nextIdx}`,
      slug: `paso_${nextIdx}`,
      color: colorPalette[(nextIdx - 1) % colorPalette.length],
      isInitial: false,
      isTerminal: false,
      allowedTransitions: [],
      properties: {
        requiresApproval: true,
        requiresDocument: true,
        allowDownloadPdf: true,
        hasSLA: true,
        slaTime: 48,
        slaUnit: 'Horas'
      }
    };
    addStep(currentSubModule.id, newStep);
    showToast(`Paso "${newStep.name}" agregado al flujo`);
  };

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDropStep = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(dropIndex, 0, movedStep);
    reorderSteps(currentSubModule.id, newSteps);
    setDraggedIndex(null);
    setDragOverIndex(null);
    showToast('Orden de pasos actualizado');
  };

  // Typology Handlers
  const handleCreateTypology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypologyName.trim()) {
      showToast('Ingresa un nombre para la tipología');
      return;
    }

    const created = createSubModule({
      name: newTypologyName.trim(),
      code: newTypologyCode.trim() || newTypologyName.trim().slice(0, 3).toUpperCase(),
      description: newTypologyDesc.trim()
    });

    showToast(`Tipología "${created.name}" creada con éxito`);
    setIsNewTypologyModalOpen(false);
    setNewTypologyName('');
    setNewTypologyCode('');
    setNewTypologyDesc('');
  };

  const handleUpdateTypology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTypology || !editTypologyName.trim()) return;

    updateSubModule(editingTypology.id, {
      name: editTypologyName.trim(),
      code: (editTypologyCode.trim() || editTypologyName.trim().slice(0, 3)).toUpperCase().slice(0, 5),
      description: editTypologyDesc.trim()
    });

    showToast(`Tipología "${editTypologyName}" actualizada`);
    setEditingTypology(null);
  };

  const handleDeleteTypology = () => {
    if (!typologyToDelete) return;
    deleteSubModule(typologyToDelete.id);
    showToast(`Tipología "${typologyToDelete.name}" eliminada`);
    setTypologyToDelete(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 font-sans text-slate-800">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-12 right-6 z-50 bg-[#4338ca] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP BREADCRUMB & RETURN (Matching Screenshot Exactly) */}
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              setActiveMenu('workflow');
            }
          }}
          className="text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VOLVER A CONFIGURACIÓN</span>
        </button>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5 text-slate-400" />
          <span>FLUJOS DE TRABAJO</span>
          <span>›</span>
          <span className="text-slate-600 font-bold">
            FLUJO DE GESTIÓN JURÍDICA: {currentSubModule.name.toUpperCase()}
          </span>
        </div>
      </div>

      {/* HEADER ROW WITH ICON, TITLE & ACTION BUTTONS (Matching Screenshot Exactly) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#4338ca] text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Flujo de Gestión Jurídica
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Define los pasos, colores y transiciones del flujo de gestión jurídica de tu empresa.
            </p>
          </div>
        </div>

        {/* Action Buttons Top-Right */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => showToast('Flujo restaurado a valores por defecto')}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer bg-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar por Defecto</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Cambios del flujo guardados exitosamente')}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {/* SUB-FLOW SELECTOR PILLS (Tipologías Jurídicas Dinámicas y Configurables) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Tipología Jurídica:
          </span>

          {subModules.map((sm) => {
            const isSelected = sm.id === currentSubModule.id;
            return (
              <div
                key={sm.id}
                className={`group flex items-center rounded-xl transition-all ${
                  isSelected
                    ? 'bg-[#4338ca] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveSubModuleId(sm.id)}
                  className="flex items-center gap-2 pl-3.5 pr-2 py-1.5 text-xs font-bold cursor-pointer"
                >
                  <span>{sm.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {sm.code}
                  </span>
                </button>

                {/* Edit & Delete actions for this typology */}
                <div className="flex items-center pr-2 gap-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTypology(sm);
                      setEditTypologyName(sm.name);
                      setEditTypologyCode(sm.code);
                      setEditTypologyDesc(sm.description || '');
                    }}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isSelected
                        ? 'hover:bg-white/20 text-white/80 hover:text-white'
                        : 'hover:bg-slate-200 text-slate-400 hover:text-indigo-600'
                    }`}
                    title={`Editar nombre y código de "${sm.name}"`}
                  >
                    <Pencil className="w-3 h-3" />
                  </button>

                  {subModules.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTypologyToDelete(sm);
                      }}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isSelected
                          ? 'hover:bg-rose-500/40 text-white/80 hover:text-white'
                          : 'hover:bg-rose-100 text-slate-400 hover:text-rose-600'
                      }`}
                      title={`Eliminar tipología "${sm.name}"`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* "+ Nueva Tipología" Button */}
          <button
            type="button"
            onClick={() => {
              setNewTypologyName('');
              setNewTypologyCode('');
              setNewTypologyDesc('');
              setIsNewTypologyModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-indigo-300 text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 hover:border-indigo-400 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Crear una nueva tipología jurídica personalizada"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Tipología</span>
          </button>
        </div>
      </div>

      {/* TOP DARK PREVIEW CARD: "Vista Previa del Flujo" (Matching Screenshot Exactly) */}
      <div className="bg-[#0b1026] text-white rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Eye className="w-4 h-4" />
          <span>Vista Previa del Flujo</span>
        </div>

        {/* Pipeline Pills Row (Main Flow connected with '>') */}
        <div className="flex items-center flex-wrap gap-2 pt-1">
          {steps
            .filter((s) => !s.slug.includes('rechaz') && !s.slug.includes('archiv'))
            .map((s, idx, arr) => {
              const hexColor = getHexFromStepColor(s.color);
              return (
                <React.Fragment key={s.id}>
                  <div
                    style={{ borderColor: hexColor, color: hexColor }}
                    className="px-3 py-1.5 rounded-lg border font-semibold text-xs flex items-center gap-2 bg-slate-900/80 shadow-xs cursor-pointer hover:scale-102 transition-transform"
                    onClick={() => handleOpenStepConfig(s)}
                    title="Clic para configurar propiedades"
                  >
                    {renderStepIcon(s.iconName || s.slug, 'w-3.5 h-3.5')}
                    <span>{s.name}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <span className="text-slate-600 font-bold">&gt;</span>
                  )}
                </React.Fragment>
              );
            })}
        </div>

        {/* Second row: Rama de Rechazo / Archivo */}
        {steps.some((s) => s.slug.includes('rechaz') || s.slug.includes('archiv')) && (
          <div className="pt-2">
            {steps
              .filter((s) => s.slug.includes('rechaz') || s.slug.includes('archiv'))
              .map((s) => {
                const hexColor = getHexFromStepColor(s.color);
                return (
                  <div
                    key={s.id}
                    style={{ borderColor: hexColor, color: hexColor }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-xs bg-slate-900/80 cursor-pointer"
                    onClick={() => handleOpenStepConfig(s)}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{s.name}</span>
                  </div>
                );
              })}
          </div>
        )}

        {/* Footer of Dark Box (Matching Screenshot Exactly) */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="text-blue-400 font-medium">› Flujo principal</span>
            <span className="text-slate-400">--- Rama de rechazo</span>
          </div>
          <span className="text-slate-400">{steps.length} pasos</span>
        </div>
      </div>

      {/* STEPS LIST (Matching the exact card design of the screenshot!) */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const hexColor = getHexFromStepColor(step.color);
          const isInitial = !!step.isInitial;
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
              style={{ borderLeftColor: hexColor, borderLeftWidth: '5px' }}
              className={`bg-white rounded-xl border shadow-xs p-5 transition-all select-none ${
                isBeingDragged
                  ? 'opacity-70 scale-[1.01] shadow-2xl border-indigo-400 ring-2 ring-indigo-300 z-20 cursor-grabbing'
                  : isDragOver
                  ? 'border-indigo-400 ring-2 ring-indigo-300 ring-offset-2 bg-indigo-50/30'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: Drag Handle (6-dots handle only, no arrows) + Step Icon in soft colored box */}
                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Arrastra para reordenar libremente"
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div
                    style={{ backgroundColor: `${hexColor}18`, color: hexColor }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0"
                  >
                    {renderStepIcon(step.iconName || step.slug, 'w-6 h-6')}
                  </div>
                </div>

                {/* Middle Columns: NOMBRE + SLUG (ID INTERNO) */}
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
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                    />
                  </div>

                  {/* SLUG (ID INTERNO) */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      SLUG (ID INTERNO)
                    </label>
                    <input
                      type="text"
                      disabled={isInitial}
                      value={step.slug}
                      onChange={(e) => handleUpdateStepField(step.id, 'slug', e.target.value)}
                      className={`w-full text-xs font-mono px-3 py-2 rounded-lg border ${
                        isInitial
                          ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                          : 'border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800'
                      }`}
                    />
                    {isInitial && (
                      <div className="text-[10px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Estado inicial — slug bloqueado</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Columns: COLOR SWATCH GRID + CATEGORÍA + ACTIONS */}
                <div className="flex items-center gap-6 self-end lg:self-auto shrink-0">
                  {/* Color Palette Grid: 3 rows of 4 colors (Matching screenshot exactly) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      COLOR
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 w-24">
                      {colorPalette.map((c) => {
                        const isSelected = hexColor.toLowerCase() === c.toLowerCase();
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleUpdateStepField(step.id, 'color', c)}
                            style={{ backgroundColor: c }}
                            className={`w-4 h-4 rounded-sm transition-transform cursor-pointer ${
                              isSelected
                                ? 'ring-2 ring-slate-900 ring-offset-1 scale-110'
                                : 'hover:scale-105 opacity-90 hover:opacity-100'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* CATEGORÍA SELECT */}
                  <div className="space-y-1 w-32">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      CATEGORÍA
                    </label>
                    <div className="relative">
                      <select
                        value={
                          isInitial
                            ? 'Entrada'
                            : step.isTerminal
                            ? 'Cerrado'
                            : step.slug.includes('rechaz')
                            ? 'Rechazado'
                            : 'Revisión'
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Entrada') {
                            handleUpdateStepField(step.id, 'isInitial', true);
                            handleUpdateStepField(step.id, 'isTerminal', false);
                          } else if (val === 'Cerrado') {
                            handleUpdateStepField(step.id, 'isInitial', false);
                            handleUpdateStepField(step.id, 'isTerminal', true);
                          } else {
                            handleUpdateStepField(step.id, 'isInitial', false);
                            handleUpdateStepField(step.id, 'isTerminal', false);
                          }
                        }}
                        className="w-full text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white appearance-none pr-7 cursor-pointer"
                      >
                        <option value="Entrada">Entrada</option>
                        <option value="Revisión">Revisión</option>
                        <option value="Aprobación">Aprobación</option>
                        <option value="Trámite">Trámite</option>
                        <option value="Cerrado">Cerrado</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Action Buttons: Gear (Settings) & Trash with Tooltip */}
                  <div className="flex flex-col gap-1.5 pt-4">
                    {/* Settings Gear */}
                    <button
                      type="button"
                      onClick={() => handleOpenStepConfig(step)}
                      className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                      title="Configurar propiedades del paso"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>

                    {/* Trash */}
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredTrashId(step.id)}
                        onMouseLeave={() => setHoveredTrashId(null)}
                        onClick={() => {
                          if (isInitial) {
                            showToast('El estado inicial no se puede eliminar');
                            return;
                          }
                          setStepToDelete(step);
                        }}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                          isInitial
                            ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                            : 'bg-slate-50 border-slate-200/60 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                        }`}
                        title={isInitial ? 'No se puede eliminar' : 'Eliminar paso'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Tooltip on hover */}
                      {hoveredTrashId === step.id && (
                        <div className="absolute right-8 top-0 z-30 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap font-medium animate-in fade-in">
                          {isInitial ? 'Estado inicial bloqueado' : 'Eliminar paso'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM BUTTON: "+ Agregar Nuevo Paso a este Flujo" */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={handleAddNewStep}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 text-indigo-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nuevo Paso a este Flujo</span>
        </button>
      </div>

      {/* MODAL 1: "Configurar Propiedades del Paso" (Matching System Screenshot) */}
      {activeStepConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full p-6 space-y-5 animate-in zoom-in-95 max-h-[92vh] flex flex-col">
            {/* Header matching screenshot */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4338ca] shrink-0 shadow-2xs">
                  {renderStepIcon(modalIconName, 'w-6 h-6')}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-1.5 tracking-tight">
                    <span>Configurar:</span>
                    <span>{activeStepConfig.name}</span>
                  </h3>
                  <div className="text-xs font-mono text-slate-400">
                    {activeStepConfig.slug}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStepConfig(null)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: 2 Columns */}
            <form onSubmit={handleSaveStepConfig} className="flex-1 overflow-y-auto space-y-6 pr-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left Column: Ícono del Paso + Transiciones Permitidas + SLA */}
                <div className="space-y-5">
                  {/* 1. Ícono del Paso (Grid matching screenshot) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>ÍCONO DEL PASO</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2 p-3 bg-slate-50/70 rounded-2xl border border-slate-200">
                      {availableIcons.map((ic) => {
                        const IconComp = ic.icon;
                        const isSelected = modalIconName === ic.name;
                        return (
                          <button
                            key={ic.name}
                            type="button"
                            onClick={() => setModalIconName(ic.name)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#4338ca] text-white shadow-xs scale-105'
                                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                            }`}
                            title={ic.name}
                          >
                            <IconComp className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Transiciones Permitidas */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>TRANSICIONES PERMITIDAS</span>
                    </div>
                    <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-1.5 max-h-56 overflow-y-auto">
                      {steps
                        .filter((s) => s.id !== activeStepConfig.id)
                        .map((targetStep) => {
                          const isChecked = modalAllowedTransitions.includes(targetStep.id);
                          const targetHex = getHexFromStepColor(targetStep.color);
                          return (
                            <label
                              key={targetStep.id}
                              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setModalAllowedTransitions([...modalAllowedTransitions, targetStep.id]);
                                    } else {
                                      setModalAllowedTransitions(
                                        modalAllowedTransitions.filter((id) => id !== targetStep.id)
                                      );
                                    }
                                  }}
                                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <div
                                  style={{ backgroundColor: `${targetHex}20`, color: targetHex }}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                >
                                  {renderStepIcon(targetStep.iconName || targetStep.slug, 'w-3.5 h-3.5')}
                                </div>
                                <span className="font-semibold text-xs text-slate-800">
                                  {targetStep.name}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                    </div>
                  </div>

                  {/* 3. Políticas del Paso (Matching screenshot) */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <Scale className="w-3.5 h-3.5 text-slate-400" />
                      <span>POLÍTICAS DEL PASO</span>
                    </div>
                    <p className="text-slate-400 italic text-[11px]">
                      No hay políticas disponibles. Créalas en Configuración → Políticas.
                    </p>
                  </div>
                </div>

                {/* Right Column: Propiedades Posibles del Paso (Styled matching screenshot cards) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 relative">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      PROPIEDADES POSIBLES DEL PASO:
                    </label>

                    {/* Info Icon with Tooltip */}
                    <div className="relative inline-flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPropTooltip(!showPropTooltip)}
                        onMouseEnter={() => setShowPropTooltip(true)}
                        onMouseLeave={() => setShowPropTooltip(false)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5 rounded-full hover:bg-slate-100 cursor-pointer focus:outline-none"
                        title="Selecciona una o varias propiedades que quieras que este paso cumpla"
                        aria-label="Más información"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      {showPropTooltip && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 pointer-events-none animate-in fade-in zoom-in-95">
                          <div className="bg-slate-900 text-white text-[11px] font-medium leading-relaxed p-2.5 rounded-xl shadow-xl border border-slate-700 text-center">
                            Selecciona una o varias propiedades que quieras que este paso cumpla durante su ejecución.
                          </div>
                          <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1 mx-auto border-r border-b border-slate-700"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* 1. Estado Inicial */}
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      modalIsInitial ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalIsInitial}
                          onChange={(e) => {
                            setModalIsInitial(e.target.checked);
                            if (e.target.checked) setModalIsTerminal(false);
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Estado Inicial</div>
                          <div className="text-[11px] text-slate-400">Primera etapa de los expedientes nuevos</div>
                        </div>
                      </div>
                      <Flag className={`w-4 h-4 ${modalIsInitial ? 'text-indigo-600' : 'text-slate-300'}`} />
                    </label>

                    {/* 2. Estado Terminal */}
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      modalIsTerminal ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalIsTerminal}
                          onChange={(e) => {
                            setModalIsTerminal(e.target.checked);
                            if (e.target.checked) setModalIsInitial(false);
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Estado Terminal</div>
                          <div className="text-[11px] text-slate-400">Sin transiciones de salida</div>
                        </div>
                      </div>
                      <Lock className="w-4 h-4 text-slate-400" />
                    </label>

                    {/* 3. Requiere Comprobante */}
                    <label className="p-3 rounded-xl border border-blue-200 bg-blue-50/20 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalProps.requiresDocument}
                          onChange={(e) =>
                            setModalProps({ ...modalProps, requiresDocument: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Requiere Comprobante</div>
                          <div className="text-[11px] text-slate-400">Obliga a adjuntar archivo o memorial obligatorio</div>
                        </div>
                      </div>
                      <Paperclip className="w-4 h-4 text-blue-500" />
                    </label>

                    {/* 4. Requiere Asignación */}
                    <label className="p-3 rounded-xl border border-amber-200 bg-amber-50/20 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalProps.requiresApproval}
                          onChange={(e) =>
                            setModalProps({ ...modalProps, requiresApproval: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Requiere Asignación</div>
                          <div className="text-[11px] text-slate-400">Obliga a asignar a un abogado/rol aprobador</div>
                        </div>
                      </div>
                      <User className="w-4 h-4 text-amber-500" />
                    </label>

                    {/* 5. Cuenta con Límite de Tiempo (SLA) */}
                    <div className={`p-3 rounded-xl border transition-colors ${
                      modalHasSLA ? 'border-purple-200 bg-purple-50/20' : 'border-slate-200 bg-white hover:border-slate-300'
                    } space-y-2.5`}>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={modalHasSLA}
                            onChange={(e) => setModalHasSLA(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs">Cuenta con Límite de Tiempo (SLA)</div>
                            <div className="text-[11px] text-slate-400">Establece un plazo máximo permitido para resolver este paso</div>
                          </div>
                        </div>
                        <Clock className={`w-4 h-4 ${modalHasSLA ? 'text-purple-500' : 'text-slate-400'}`} />
                      </label>

                      {modalHasSLA && (
                        <div className="flex items-center gap-2 pt-1 pl-7 border-t border-purple-100">
                          <span className="text-xs text-slate-600 font-medium">Tiempo máximo en estado:</span>
                          <input
                            type="number"
                            min="1"
                            value={modalSlaTime}
                            onChange={(e) => setModalSlaTime(Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                          />
                          <select
                            value={modalSlaUnit}
                            onChange={(e) => setModalSlaUnit(e.target.value as 'Horas' | 'Días')}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-medium cursor-pointer focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                          >
                            <option value="Horas">Horas</option>
                            <option value="Días">Días</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* 6. Permite Acción Masiva */}
                    <label className="p-3 rounded-xl border border-blue-200 bg-blue-50/20 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalProps.allowBulkAction}
                          onChange={(e) =>
                            setModalProps({ ...modalProps, allowBulkAction: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Permite Acción Masiva</div>
                          <div className="text-[11px] text-slate-400">Habilita checkboxes para gestionar múltiples expedientes a la vez</div>
                        </div>
                      </div>
                      <Layers className="w-4 h-4 text-blue-500" />
                    </label>

                    {/* 7. Permite Modificar Cláusulas o Pretensiones */}
                    <label className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalProps.allowEditItems}
                          onChange={(e) =>
                            setModalProps({ ...modalProps, allowEditItems: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Permite Modificar Cláusulas o Pretensiones</div>
                          <div className="text-[11px] text-slate-400">Habilita modificar los términos solicitados en este paso</div>
                        </div>
                      </div>
                      <Pencil className="w-4 h-4 text-emerald-500" />
                    </label>

                    {/* 8. Verificación sobre Listas Restrictivas */}
                    <label className="p-3 rounded-xl border border-teal-200 bg-teal-50/20 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalProps.verifyCounterparts}
                          onChange={(e) =>
                            setModalProps({ ...modalProps, verifyCounterparts: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Verificación sobre Listas Restrictivas</div>
                          <div className="text-[11px] text-slate-400">Consulta Sarlaft, OFAC y genera alertas de cumplimiento</div>
                        </div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                    </label>

                    {/* 9. Requiere Póliza o Garantía Legal */}
                    <label className="p-3 rounded-xl border border-amber-200 bg-amber-50/20 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalProps.requiresPolicy}
                          onChange={(e) =>
                            setModalProps({ ...modalProps, requiresPolicy: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Requiere Póliza o Garantía Legal</div>
                          <div className="text-[11px] text-slate-400">Exige aprobación de póliza antes de continuar</div>
                        </div>
                      </div>
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                    </label>

                    {/* 10. Permite Devolver al Paso Anterior */}
                    <label className="p-3 rounded-xl border border-rose-200 bg-rose-50/20 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalProps.allowRollback}
                          onChange={(e) =>
                            setModalProps({ ...modalProps, allowRollback: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Permite Devolver al Paso Anterior</div>
                          <div className="text-[11px] text-slate-400">Habilita retroceso con observación requerida</div>
                        </div>
                      </div>
                      <Undo2 className="w-4 h-4 text-rose-500" />
                    </label>

                    {/* 11. Permite Descargar el Expediente (PDF) */}
                    <label className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/20 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={modalProps.allowDownloadPdf}
                          onChange={(e) =>
                            setModalProps({ ...modalProps, allowDownloadPdf: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Permite Descargar el Expediente (PDF)</div>
                          <div className="text-[11px] text-slate-400">Habilita botón para exportar minuta o memorial formal</div>
                        </div>
                      </div>
                      <FileText className="w-4 h-4 text-indigo-500" />
                    </label>
                  </div>

                  {/* CAMPOS REQUERIDOS DE SALIDA (Matching screenshot) */}
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>CAMPOS REQUERIDOS DE SALIDA</span>
                    </div>

                    {modalCustomFields.length === 0 ? (
                      <p className="text-slate-400 italic text-[11px]">
                        No hay campos requeridos configurados.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {modalCustomFields.map((cf, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                          >
                            <span>{cf}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setModalCustomFields(modalCustomFields.filter((_, i) => i !== idx));
                              }}
                              className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Eliminar campo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formulario Agregar Campo Nuevo */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        AGREGAR CAMPO NUEVO
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(e.target.value)}
                          placeholder="Nombre (ej: Orden Compra)"
                          className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                        />
                        <select
                          value={newFieldType}
                          onChange={(e) => setNewFieldType(e.target.value)}
                          className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                        >
                          <option value="Texto">Texto</option>
                          <option value="Número">Número</option>
                          <option value="Moneda (COP)">Moneda (COP)</option>
                          <option value="Fecha">Fecha</option>
                          <option value="Lógico (Sí/No)">Lógico (Sí/No)</option>
                          <option value="Archivo">Archivo</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (newFieldName.trim()) {
                            setModalCustomFields([
                              ...modalCustomFields,
                              `${newFieldName.trim()} (${newFieldType})`
                            ]);
                            setNewFieldName('');
                          }
                        }}
                        className="w-full py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Campo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer matching screenshot */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setActiveStepConfig(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Listo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Nueva Tipología Jurídica */}
      {isNewTypologyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4338ca] font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Nueva Tipología Jurídica
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Crea un tipo de proceso y personaliza su flujo a tu necesidad
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTypologyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTypology} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  NOMBRE DE LA TIPOLOGÍA *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Actas y Poderes, Auditorías Legales, Garantías..."
                  value={newTypologyName}
                  onChange={(e) => {
                    setNewTypologyName(e.target.value);
                    if (!newTypologyCode) {
                      setNewTypologyCode(e.target.value.slice(0, 3).toUpperCase());
                    }
                  }}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  CÓDIGO (PREFIJO RADICADO) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="Ej. ACT"
                  value={newTypologyCode}
                  onChange={(e) => setNewTypologyCode(e.target.value.toUpperCase())}
                  className="w-full text-xs font-mono font-bold uppercase px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Prefijo para generar los consecutivos de radicado (Ej. {newTypologyCode || 'TIP'}-2026-0001)
                </span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  DESCRIPCIÓN
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe el alcance u objetivo de los radicados en esta tipología..."
                  value={newTypologyDesc}
                  onChange={(e) => setNewTypologyDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTypologyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Tipología</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Editar Tipología Jurídica */}
      {editingTypology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 font-bold">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Configurar Tipología
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Edita el nombre y código de esta categoría jurídica
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingTypology(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTypology} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  NOMBRE DE LA TIPOLOGÍA *
                </label>
                <input
                  type="text"
                  required
                  value={editTypologyName}
                  onChange={(e) => setEditTypologyName(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  CÓDIGO (PREFIJO RADICADO) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={editTypologyCode}
                  onChange={(e) => setEditTypologyCode(e.target.value.toUpperCase())}
                  className="w-full text-xs font-mono font-bold uppercase px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  DESCRIPCIÓN
                </label>
                <textarea
                  rows={2}
                  value={editTypologyDesc}
                  onChange={(e) => setEditTypologyDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTypology(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Eliminar Paso */}
      {stepToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-sm w-full text-center animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-rose-500" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Eliminar Paso
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              ¿Estás seguro de eliminar &quot;{stepToDelete.name}&quot;? Esta acción se aplicará al guardar.
            </p>

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
                  deleteStep(currentSubModule.id, stepToDelete.id);
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

      {/* MODAL 5: Eliminar Tipología */}
      {typologyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-sm w-full text-center animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-rose-500" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Eliminar Tipología
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              ¿Estás seguro de eliminar la tipología &quot;{typologyToDelete.name}&quot; y todos sus pasos configurados?
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTypologyToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDeleteTypology}
                className="flex-1 py-2.5 px-4 bg-[#be123c] hover:bg-[#9f1239] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
