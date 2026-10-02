import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  useJuridicaWorkflow,
  JuridicaExpediente,
  JuridicaStep,
  JuridicaAdjunto,
  JuridicaTrazabilidad
} from '../context/JuridicaWorkflowContext';
import {
  Scale,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Settings,
  X,
  Check,
  ChevronDown,
  Download,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  Layers,
  Sparkles,
  User,
  Paperclip,
  Mail,
  ThumbsUp,
  CreditCard,
  Building2,
  Flag,
  Lock,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  UploadCloud,
  FileCheck,
  RotateCcw,
  Edit3
} from 'lucide-react';

export const GestionJuridicaView: React.FC = () => {
  const { setActiveMenu } = useApp();
  const {
    subModules,
    expedientes,
    crearExpediente,
    avanzarExpediente,
    agregarAdjuntoExpediente,
    actualizarExpediente,
    setActiveSubModuleId
  } = useJuridicaWorkflow();

  // Active Sub-module (Typology) tab: default to 'contratos'
  const [selectedSubModuleId, setSelectedSubModuleId] = useState<string>('contratos');

  // Active step filter in pipeline: 'todas' | step.id
  const [activeStepFilter, setActiveStepFilter] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpedientes, setSelectedExpedientes] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // SELECTED EXPEDIENTE FOR FULL SCREEN DETAIL VIEW (matching screenshot!)
  const [selectedDetailExpedienteId, setSelectedDetailExpedienteId] = useState<string | null>(null);

  // Modals
  const [showNewModal, setShowNewModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showEditExpedienteModal, setShowEditExpedienteModal] = useState(false);

  // New Document form state
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('PDF');
  const [newDocSize, setNewDocSize] = useState('1.8 MB');

  // Edit Expediente form state
  const [editTitulo, setEditTitulo] = useState('');
  const [editContraparte, setEditContraparte] = useState('');
  const [editNit, setEditNit] = useState('');
  const [editRepresentante, setEditRepresentante] = useState('');
  const [editCuantia, setEditCuantia] = useState('');
  const [editAbogado, setEditAbogado] = useState('');
  const [editPrioridad, setEditPrioridad] = useState<'ALTA' | 'MEDIA' | 'URGENTE'>('ALTA');
  const [editTipoPago, setEditTipoPago] = useState<'CONTADO' | 'CREDITO'>('CONTADO');
  const [editClaseCC, setEditClaseCC] = useState('');
  const [editFechaLimite, setEditFechaLimite] = useState('');
  const [editObjeto, setEditObjeto] = useState('');

  // Flow Action State
  const [flowAuditNote, setFlowAuditNote] = useState('');
  const [flowCheckApproval, setFlowCheckApproval] = useState(false);
  const [flowCheckDocs, setFlowCheckDocs] = useState(false);
  const [flowCheckSarlaft, setFlowCheckSarlaft] = useState(false);

  // New Expediente form state
  const [newTitulo, setNewTitulo] = useState('');
  const [newContraparte, setNewContraparte] = useState('');
  const [newNit, setNewNit] = useState('');
  const [newRepresentante, setNewRepresentante] = useState('');
  const [newCuantia, setNewCuantia] = useState('');
  const [newAbogado, setNewAbogado] = useState('Dra. Marcela Mendoza');
  const [newPrioridad, setNewPrioridad] = useState<'ALTA' | 'MEDIA' | 'URGENTE'>('ALTA');
  const [newTipoPago, setNewTipoPago] = useState<'CONTADO' | 'CREDITO'>('CONTADO');
  const [newClaseCC, setNewClaseCC] = useState('Suministro / CC-101');
  const [newFechaLimite, setNewFechaLimite] = useState('2026-10-25');
  const [newObservaciones, setNewObservaciones] = useState('');

  // Toast Feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Current active sub-module
  const currentSubModule =
    subModules.find((sm) => sm.id === selectedSubModuleId) || subModules[0];
  const steps = currentSubModule ? currentSubModule.steps : [];

  // Active detail expediente
  const activeDetailExpediente = selectedDetailExpedienteId
    ? expedientes.find((e) => e.id === selectedDetailExpedienteId) || null
    : null;

  // Available icons lookup helper
  const availableIcons = [
    { name: 'Mail', icon: Mail },
    { name: 'Eye', icon: Eye },
    { name: 'ThumbsUp', icon: ThumbsUp },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'FileText', icon: FileText },
    { name: 'Scale', icon: Scale },
    { name: 'CheckCircle2', icon: CheckCircle2 },
    { name: 'ShieldCheck', icon: ShieldCheck },
    { name: 'ShieldAlert', icon: ShieldAlert },
    { name: 'Clock', icon: Clock },
    { name: 'Lock', icon: Lock },
    { name: 'Flag', icon: Flag },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Building2', icon: Building2 },
    { name: 'X', icon: X }
  ];

  const renderStepIcon = (iconOrSlug?: string, className = 'w-4 h-4') => {
    if (!iconOrSlug) return <FileText className={className} />;
    const found = availableIcons.find((i) => i.name === iconOrSlug);
    if (found) {
      const Comp = found.icon;
      return <Comp className={className} />;
    }
    const slug = iconOrSlug.toLowerCase();
    if (slug.includes('recib') || slug.includes('solicitud') || slug.includes('minuta')) {
      return <Mail className={className} />;
    }
    if (slug.includes('revis') || slug.includes('estudio')) {
      return <Eye className={className} />;
    }
    if (slug.includes('aprob') || slug.includes('firma')) {
      return <ThumbsUp className={className} />;
    }
    if (slug.includes('debit') || slug.includes('pago') || slug.includes('tramite')) {
      return <CreditCard className={className} />;
    }
    if (slug.includes('concili') || slug.includes('vigent') || slug.includes('ejecut')) {
      return <CheckCircle2 className={className} />;
    }
    if (slug.includes('contestacion') || slug.includes('audiencia') || slug.includes('litigio')) {
      return <Scale className={className} />;
    }
    if (slug.includes('rechaz') || slug.includes('archiv')) {
      return <X className={className} />;
    }
    return <FileText className={className} />;
  };

  const getHexFromStepColor = (color: string) => {
    if (!color) return '#64748b';
    if (color.startsWith('#')) return color;
    switch (color) {
      case 'amber': return '#f59e0b';
      case 'blue': return '#3b82f6';
      case 'emerald': return '#10b981';
      case 'purple': return '#8b5cf6';
      case 'indigo': return '#6366f1';
      case 'red': return '#ef4444';
      default: return '#64748b';
    }
  };

  // Expedientes for active sub-module
  const subModuleExpedientes = expedientes.filter(
    (e) => e.subModuleId === currentSubModule.id
  );

  // Filtered expedientes by step and search
  const filteredExpedientes = subModuleExpedientes.filter((exp) => {
    // Step filter
    if (activeStepFilter !== 'todas') {
      const matchStep = exp.currentStepId === activeStepFilter;
      if (!matchStep) return false;
    }

    // Priority filter
    if (priorityFilter !== 'all' && exp.prioridad !== priorityFilter) {
      return false;
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchRadicado = exp.radicado.toLowerCase().includes(q);
      const matchContraparte = exp.contraparte.toLowerCase().includes(q);
      const matchNit = exp.nit ? exp.nit.includes(q) : false;
      const matchTitulo = exp.titulo.toLowerCase().includes(q);
      const matchAbogado = exp.abogadoResponsable.toLowerCase().includes(q);
      return matchRadicado || matchContraparte || matchNit || matchTitulo || matchAbogado;
    }

    return true;
  });

  // Calculate step counts for the active workflow
  const stepCounts = steps.map((step) => {
    const count = subModuleExpedientes.filter((e) => e.currentStepId === step.id).length;
    return {
      ...step,
      count
    };
  });

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedExpedientes.length === filteredExpedientes.length) {
      setSelectedExpedientes([]);
    } else {
      setSelectedExpedientes(filteredExpedientes.map((e) => e.id));
    }
  };

  const handleToggleExpediente = (id: string) => {
    if (selectedExpedientes.includes(id)) {
      setSelectedExpedientes(selectedExpedientes.filter((i) => i !== id));
    } else {
      setSelectedExpedientes([...selectedExpedientes, id]);
    }
  };

  // Open Edit Modal for an Expediente
  const handleStartEditExpediente = (exp: JuridicaExpediente) => {
    setEditTitulo(exp.titulo);
    setEditContraparte(exp.contraparte);
    setEditNit(exp.nit || '');
    setEditRepresentante(exp.representanteLegal || '');
    setEditCuantia(exp.cuantia.toString());
    setEditAbogado(exp.abogadoResponsable);
    setEditPrioridad(exp.prioridad);
    setEditTipoPago(exp.tipoPago || 'CONTADO');
    setEditClaseCC(exp.claseCC || '');
    setEditFechaLimite(exp.fechaLimiteSla);
    setEditObjeto(exp.objetoJuridico || '');
    setShowEditExpedienteModal(true);
  };

  // Save Edited Expediente
  const handleSaveEditExpediente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDetailExpediente) return;

    actualizarExpediente(activeDetailExpediente.id, {
      titulo: editTitulo.trim(),
      contraparte: editContraparte.trim(),
      nit: editNit.trim(),
      representanteLegal: editRepresentante.trim(),
      cuantia: parseFloat(editCuantia) || activeDetailExpediente.cuantia,
      abogadoResponsable: editAbogado,
      prioridad: editPrioridad,
      tipoPago: editTipoPago,
      claseCC: editClaseCC.trim(),
      fechaLimiteSla: editFechaLimite,
      objetoJuridico: editObjeto.trim()
    });

    showToast('Información jurídica actualizada exitosamente.');
    setShowEditExpedienteModal(false);
  };

  // Handle Add Document to Active Expediente
  const handleAddDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDetailExpediente || !newDocName.trim()) return;

    agregarAdjuntoExpediente(activeDetailExpediente.id, {
      name: newDocName.trim().endsWith(`.${newDocType.toLowerCase()}`)
        ? newDocName.trim()
        : `${newDocName.trim()}.${newDocType.toLowerCase()}`,
      type: newDocType,
      size: newDocSize
    });

    showToast(`Documento "${newDocName}" anexado al expediente.`);
    setNewDocName('');
    setShowAddDocModal(false);
  };

  // Handle Quick Advance in Detail View
  const handleDetailAdvance = (targetStepId: string, targetStepName: string) => {
    if (!activeDetailExpediente) return;

    avanzarExpediente(
      activeDetailExpediente.id,
      targetStepId,
      flowAuditNote.trim() || undefined,
      activeDetailExpediente.abogadoResponsable
    );

    showToast(`Expediente avanzado exitosamente a "${targetStepName}"`);
    setFlowAuditNote('');
    setFlowCheckApproval(false);
    setFlowCheckDocs(false);
    setFlowCheckSarlaft(false);
  };

  // Handle Rollback if allowed
  const handleDetailRollback = () => {
    if (!activeDetailExpediente) return;
    const currentStepIndex = steps.findIndex((s) => s.id === activeDetailExpediente.currentStepId);
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      avanzarExpediente(
        activeDetailExpediente.id,
        prevStep.id,
        flowAuditNote.trim() || 'Devolución al paso anterior por revisión de antecedentes.',
        activeDetailExpediente.abogadoResponsable
      );
      showToast(`Expediente devuelto a "${prevStep.name}"`);
      setFlowAuditNote('');
    }
  };

  // Create new Expediente
  const handleCreateNewExpediente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitulo.trim() || !newContraparte.trim()) {
      alert('Por favor completa el título y la contraparte.');
      return;
    }

    const firstStep = steps.find((s) => s.isInitial) || steps[0];

    crearExpediente({
      subModuleId: currentSubModule.id,
      titulo: newTitulo.trim(),
      contraparte: newContraparte.trim(),
      nit: newNit.trim() || '900580962',
      representanteLegal: newRepresentante.trim() || newContraparte.trim(),
      cufe: `exp-${Date.now().toString(16).slice(-8)}`,
      cuantia: parseFloat(newCuantia) || 0,
      valorSubtotal: (parseFloat(newCuantia) || 0) * 0.9,
      valorRetencion: (parseFloat(newCuantia) || 0) * 0.1,
      abogadoResponsable: newAbogado,
      prioridad: newPrioridad,
      tipoPago: newTipoPago,
      claseCC: newClaseCC,
      fechaLimiteSla: newFechaLimite,
      diasVencida: null,
      observaciones: newObservaciones.trim(),
      objetoJuridico: newObservaciones.trim() || newTitulo.trim(),
      adjuntosCount: 2,
      adjuntosList: [
        {
          id: `adj-${Date.now()}-1`,
          name: `Minuta_Inicial_${newContraparte.replace(/\s+/g, '_')}.pdf`,
          type: 'PDF',
          size: '1.8 MB',
          date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
        },
        {
          id: `adj-${Date.now()}-2`,
          name: `RUT_Camara_Comercio_${newContraparte.replace(/\s+/g, '_')}.pdf`,
          type: 'PDF',
          size: '950 KB',
          date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
        }
      ]
    });

    showToast(`Expediente radicado en "${firstStep?.name || 'Recibida'}"`);
    setShowNewModal(false);

    // Reset Form
    setNewTitulo('');
    setNewContraparte('');
    setNewNit('');
    setNewRepresentante('');
    setNewCuantia('');
    setNewObservaciones('');
  };

  // Active step name for search label
  const activeStepObj = steps.find((s) => s.id === activeStepFilter);
  const activeStepNameLabel = activeStepObj ? activeStepObj.name : 'TODAS';

  // Helper icon for subModule
  const getSubModuleIcon = (subModId: string) => {
    switch (subModId) {
      case 'contratos': return <FileText className="w-7 h-7" />;
      case 'demandas': return <Scale className="w-7 h-7" />;
      case 'tutelas': return <ShieldAlert className="w-7 h-7" />;
      case 'pqrsf': return <Mail className="w-7 h-7" />;
      case 'conceptos': return <Briefcase className="w-7 h-7" />;
      default: return <FileText className="w-7 h-7" />;
    }
  };

  // =========================================================================
  // VIEW MODE A: FULL SCREEN DETAIL & MANAGEMENT (Matching uploaded screenshots!)
  // =========================================================================
  if (activeDetailExpediente) {
    const currentStepObj = steps.find((s) => s.id === activeDetailExpediente.currentStepId) || steps[0];
    const currentStepHex = currentStepObj ? getHexFromStepColor(currentStepObj.color) : '#6366f1';
    const allowedNextStepIds = currentStepObj?.allowedTransitions || [];
    const allowedNextSteps = steps.filter((s) => allowedNextStepIds.includes(s.id));
    const nextStepObj = allowedNextSteps[0] || null;

    // Document attachments
    const adjuntos = activeDetailExpediente.adjuntosList && activeDetailExpediente.adjuntosList.length > 0
      ? activeDetailExpediente.adjuntosList
      : [
          { id: 'adj-def-1', name: `Minuta_Contrato_${activeDetailExpediente.radicado}.pdf`, type: 'PDF', size: '2.4 MB', date: activeDetailExpediente.fechaRadicacion },
          { id: 'adj-def-2', name: `Poliza_Garantia_Cumplimiento_${activeDetailExpediente.radicado}.pdf`, type: 'PDF', size: '1.2 MB', date: activeDetailExpediente.fechaRadicacion }
        ];

    // Traceability timeline
    const trazabilidad = activeDetailExpediente.trazabilidadList && activeDetailExpediente.trazabilidadList.length > 0
      ? activeDetailExpediente.trazabilidadList
      : [
          {
            id: 'tr-def-1',
            stepName: currentStepObj?.name || 'Recibida',
            stepColor: currentStepHex,
            date: '18/09 10:43 AM',
            actor: 'Sistema Web Jurídico',
            comment: 'Expediente recibido y procesado automáticamente con soportes legales validados.'
          }
        ];

    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-800 animate-in fade-in">
        {/* Toast Feedback */}
        {toastMsg && (
          <div className="fixed top-12 right-6 z-50 bg-[#4338ca] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 1. TOP BREADCRUMB NAVIGATION */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
          <button
            type="button"
            onClick={() => setSelectedDetailExpedienteId(null)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>GESTIÓN JURÍDICA</span>
          </button>
          <span>›</span>
          <button
            type="button"
            onClick={() => setSelectedDetailExpedienteId(null)}
            className="hover:text-indigo-600 transition-colors uppercase tracking-wider text-slate-600 cursor-pointer"
          >
            {currentSubModule.name}
          </button>
          <span>›</span>
          <span className="text-slate-900 font-extrabold">#{activeDetailExpediente.radicado}</span>
        </div>

        {/* 2. TOP MAIN HEADER CARD (1:1 Layout with Screenshot) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Left: Big Icon + Contraparte Title + Metadata */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
              {getSubModuleIcon(currentSubModule.id)}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                {activeDetailExpediente.contraparte}
              </h2>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>NIT / ID: {activeDetailExpediente.nit || '890900943'}</span>
                </span>
                {activeDetailExpediente.despachoJudicial && (
                  <span className="text-slate-400">· {activeDetailExpediente.despachoJudicial}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAddDocModal(true)}
                className="text-xs text-slate-400 hover:text-indigo-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer pt-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar documentos</span>
              </button>
            </div>
          </div>

          {/* Center: Legal Metrics / Financials depending on Typology */}
          <div className="border-t xl:border-t-0 xl:border-l xl:border-r border-slate-100 pt-4 xl:pt-0 xl:px-8 flex items-center gap-8 flex-wrap">
            {currentSubModule.id === 'contratos' ? (
              <>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    SUBTOTAL
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-800">
                    ${(activeDetailExpediente.valorSubtotal || activeDetailExpediente.cuantia * 0.92).toLocaleString('es-CO')}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                    IVA / RET (8.6%)
                  </div>
                  <div className="text-sm font-bold font-mono text-rose-600">
                    ${(activeDetailExpediente.valorRetencion || activeDetailExpediente.cuantia * 0.086).toLocaleString('es-CO')}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                    TOTAL A PAGAR
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight flex items-baseline gap-1">
                    <span>$</span>
                    <span>{activeDetailExpediente.cuantia.toLocaleString('es-CO')}</span>
                    <span className="text-xs text-slate-400 font-normal">COP</span>
                  </div>
                </div>
              </>
            ) : currentSubModule.id === 'demandas' ? (
              <>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    CUANTÍA PRINCIPAL
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-800">
                    ${(activeDetailExpediente.valorSubtotal || activeDetailExpediente.cuantia * 0.9).toLocaleString('es-CO')}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                    INTERESES MORATORIOS
                  </div>
                  <div className="text-sm font-bold font-mono text-rose-600">
                    ${(activeDetailExpediente.valorRetencion || 40000000).toLocaleString('es-CO')}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                    TOTAL PRETENSIONES
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight flex items-baseline gap-1">
                    <span>$</span>
                    <span>{activeDetailExpediente.cuantia.toLocaleString('es-CO')}</span>
                    <span className="text-xs text-slate-400 font-normal">COP</span>
                  </div>
                </div>
              </>
            ) : currentSubModule.id === 'tutelas' ? (
              <>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TÉRMINO RESTANTE
                  </div>
                  <div className="text-sm font-bold font-mono text-rose-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>18 Horas (Perentorio)</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    MEDIDA CAUTELAR
                  </div>
                  <div className="text-sm font-bold font-mono text-amber-600">
                    SOLICITADA
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                    TRÁMITE JUDICIAL
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    ACCIÓN CONSTITUCIONAL
                  </div>
                </div>
              </>
            ) : currentSubModule.id === 'pqrsf' ? (
              <>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TÉRMINO LEGAL SLA
                  </div>
                  <div className="text-sm font-bold font-mono text-amber-600">
                    4 Días Hábiles
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    CANAL RADICACIÓN
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    Ventanilla Digital
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                    TIPO REQUERIMIENTO
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    REGULATORIO CPACA
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ÁREA SOLICITANTE
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    Dirección Financiera
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    COMPLEJIDAD
                  </div>
                  <div className="text-sm font-bold text-purple-700">
                    ALTA / NORMATIVA
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                    TÉRMINO ENTREGA
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    48 HORAS
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Radicado Number + Badges + Edit Button */}
          <div className="flex flex-col items-start xl:items-end justify-between gap-3">
            <div className="font-mono font-bold text-base text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>#{activeDetailExpediente.radicado}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                📄 {currentSubModule.name.toUpperCase()}
              </span>

              <span
                style={{
                  backgroundColor: `${currentStepHex}15`,
                  color: currentStepHex,
                  borderColor: `${currentStepHex}40`
                }}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1"
              >
                {renderStepIcon(currentStepObj?.iconName || currentStepObj?.slug, 'w-3 h-3')}
                <span>{currentStepObj?.name.toUpperCase()}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                📁 RADICADO VIRTUAL
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleStartEditExpediente(activeDetailExpediente)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs self-start xl:self-end"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Editar</span>
            </button>
          </div>
        </div>

        {/* 3. TWO COLUMNS LAYOUT (Matching Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: 8 COLS (Cards 1 to 5)                       */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: ¿A quién va dirigida? (Receptor / Contraparte / Sujetos) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <User className="w-4 h-4 text-indigo-600" />
                <span>¿A QUIÉN VA DIRIGIDA? (CONTRAPARTE / INTERVINIENTES)</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NOMBRE / RAZÓN SOCIAL
                </span>
                <div className="text-base font-bold text-slate-900">
                  {activeDetailExpediente.representanteLegal || activeDetailExpediente.contraparte}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  IDENTIFICACIÓN (NIT / CÉDULA / DESPACHO)
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold text-xs rounded-xl">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{activeDetailExpediente.nit || '890900943'}</span>
                </div>
              </div>

              {/* Warning Alert Banner (1:1 with Screenshot) */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">¡Atención! </strong>
                  <span>
                    {activeDetailExpediente.alertaJuridica?.mensaje ||
                      'El NIT del receptor no coincide con la razón social registrada en la base corporativa principal.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Información Jurídica y Procesal */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>INFORMACIÓN JURÍDICA Y PROCESAL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    FECHA RADICACIÓN / EMISIÓN
                  </span>
                  <div className="font-mono text-slate-800 font-semibold mt-1">
                    {activeDetailExpediente.fechaRadicacion}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    MONEDA / JURISDICCIÓN
                  </span>
                  <div className="font-mono text-slate-800 font-semibold mt-1">
                    COP · {activeDetailExpediente.jurisdiccion || 'Ordinaria Civil'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    MODALIDAD / TIPO DE PAGO
                  </span>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      💵 {activeDetailExpediente.tipoPago || 'CONTADO'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    ABOGADO RESPONSABLE
                  </span>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5 mt-1">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{activeDetailExpediente.abogadoResponsable}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    FECHA LÍMITE SLA / VENCIMIENTO
                  </span>
                  <div className="font-mono text-slate-800 font-semibold mt-1">
                    {activeDetailExpediente.fechaLimiteSla}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    CENTRO DE COSTOS / RADICADO PROCESAL
                  </span>
                  <div className="font-mono text-slate-800 font-semibold mt-1">
                    {activeDetailExpediente.despachoJudicial || activeDetailExpediente.claseCC || 'CC-101'}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: OBJETO JURÍDICO Y ANTECEDENTES (Notas de la Factura equivalent) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>NOTAS DEL EXPEDIENTE Y OBJETO JURÍDICO</span>
              </div>

              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl">
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &quot;{activeDetailExpediente.objetoJuridico || activeDetailExpediente.titulo}&quot;
                </p>
              </div>
            </div>

            {/* Card 4: Archivos y Soportes Jurídicos Principales (Archivos Adjuntos DIAN) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Paperclip className="w-4 h-4 text-indigo-600" />
                  <span>Archivos y Soportes Jurídicos Principales</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddDocModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Gestionar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {adjuntos.map((file, idx) => (
                  <div
                    key={file.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/20 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border border-emerald-200">
                        {file.type || 'PDF'}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-mono font-bold text-slate-900 truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {file.size} · {file.date}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast(`Descargando ${file.name}...`)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Descargar documento"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 5: Documentos y Actuaciones Adicionales */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>Documentos Adicionales</span>
              </div>

              {/* Dashed Dropzone */}
              <div
                onClick={() => setShowAddDocModal(true)}
                className="border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-50/70 rounded-2xl p-6 text-center transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-center gap-2 text-amber-800 font-bold text-xs">
                  <UploadCloud className="w-4 h-4 text-amber-700" />
                  <span>Subir Documento</span>
                </div>
              </div>

              {/* Sub-text Box */}
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-slate-300" />
                <span>Sube contratos, órdenes de compra u otros soportes.</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: 4 COLS (Acciones de Flujo + Trazabilidad)  */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. DARK NAVY CARD: Acciones de Flujo (1:1 with Screenshot) */}
            <div className="bg-[#1e1b4b] text-white rounded-2xl p-6 shadow-xl space-y-5 border border-indigo-900">
              <div className="flex items-center gap-2 font-bold text-base text-white">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Acciones de Flujo</span>
              </div>

              {/* Stepper Progress Bar */}
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: '45%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="font-bold text-amber-400">{currentStepObj?.name.toUpperCase()}</span>
                  <span className="text-slate-400">{nextStepObj ? nextStepObj.name.toUpperCase() : 'FINALIZADO'}</span>
                </div>
              </div>

              {/* Audit Comment Textarea */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  COMENTARIO DE AUDITORÍA
                </label>
                <textarea
                  rows={3}
                  value={flowAuditNote}
                  onChange={(e) => setFlowAuditNote(e.target.value)}
                  placeholder="Motivo del cambio (opcional)..."
                  className="w-full text-xs p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>

              {/* Step Requirements checklist if applicable */}
              {nextStepObj?.properties && (
                <div className="space-y-2 pt-1 border-t border-white/10 text-xs">
                  {nextStepObj.properties.requiresApproval && (
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flowCheckApproval}
                        onChange={(e) => setFlowCheckApproval(e.target.checked)}
                        className="rounded bg-white/10 border-white/20 text-indigo-500 cursor-pointer"
                      />
                      <span className="text-[11px]">Aprobación del Abogado Responsable</span>
                    </label>
                  )}
                  {nextStepObj.properties.requiresDocument && (
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flowCheckDocs}
                        onChange={(e) => setFlowCheckDocs(e.target.checked)}
                        className="rounded bg-white/10 border-white/20 text-indigo-500 cursor-pointer"
                      />
                      <span className="text-[11px]">Comprobante y soportes validados</span>
                    </label>
                  )}
                  {nextStepObj.properties.verifyCounterparts && (
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flowCheckSarlaft}
                        onChange={(e) => setFlowCheckSarlaft(e.target.checked)}
                        className="rounded bg-white/10 border-white/20 text-indigo-500 cursor-pointer"
                      />
                      <span className="text-[11px]">Consulta Sarlaft sin novedades</span>
                    </label>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {allowedNextSteps.length > 0 ? (
                  allowedNextSteps.map((target) => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => handleDetailAdvance(target.id, target.name)}
                      className="w-full py-3.5 px-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {renderStepIcon(target.iconName || target.slug, 'w-4 h-4')}
                      <span>Pasar a {target.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 bg-white/10 rounded-xl text-center text-xs text-slate-300">
                    Este expediente ha completado el ciclo del workflow.
                  </div>
                )}

                {/* Rollback button if step allows returning */}
                {currentStepObj?.properties.allowRollback && (
                  <button
                    type="button"
                    onClick={handleDetailRollback}
                    className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Devolver al Paso Anterior</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2. TRAZABILIDAD (Timeline Card matching Screenshot) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Trazabilidad</span>
              </div>

              <div className="space-y-5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {trazabilidad.map((item, idx) => (
                  <div key={item.id || idx} className="relative pl-7 space-y-1.5">
                    {/* Node Dot */}
                    <div
                      style={{ backgroundColor: item.stepColor || currentStepHex }}
                      className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ring-indigo-50"
                    />

                    {/* Badge + Timestamp */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        ✉ {item.stepName.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.date}
                      </span>
                    </div>

                    {/* Actor */}
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{item.actor}</span>
                    </div>

                    {/* Note Box */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
                      &quot;{item.comment}&quot;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: SUBIR DOCUMENTO JURÍDICO */}
        {showAddDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Anexar Documento</h3>
                    <p className="text-[11px] text-slate-400 font-mono">#{activeDetailExpediente.radicado}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDocumentSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nombre del Documento *</label>
                  <input
                    type="text"
                    required
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Ej: Minuta_Contrato_Original_Firmada"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Tipo de Documento</label>
                    <select
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="PDF">PDF</option>
                      <option value="XML">XML</option>
                      <option value="DOC">DOCX</option>
                      <option value="PÓLIZA">PÓLIZA</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Tamaño Estimado</label>
                    <input
                      type="text"
                      value={newDocSize}
                      onChange={(e) => setNewDocSize(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900">
                  El documento será indexado con firma digital en la trazabilidad del expediente.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddDocModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Subir y Anexar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDITAR INFORMACIÓN DEL EXPEDIENTE */}
        {showEditExpedienteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Editar Expediente</h3>
                    <p className="text-[11px] text-slate-400 font-mono">#{activeDetailExpediente.radicado}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditExpedienteModal(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditExpediente} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Título / Objeto del Expediente *</label>
                  <input
                    type="text"
                    required
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Contraparte / Entidad *</label>
                    <input
                      type="text"
                      required
                      value={editContraparte}
                      onChange={(e) => setEditContraparte(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">NIT / Identificación</label>
                    <input
                      type="text"
                      value={editNit}
                      onChange={(e) => setEditNit(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Representante Legal / Apoderado</label>
                  <input
                    type="text"
                    value={editRepresentante}
                    onChange={(e) => setEditRepresentante(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Cuantía (COP)</label>
                    <input
                      type="number"
                      value={editCuantia}
                      onChange={(e) => setEditCuantia(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Tipo de Pago / Modalidad</label>
                    <select
                      value={editTipoPago}
                      onChange={(e) => setEditTipoPago(e.target.value as 'CONTADO' | 'CREDITO')}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="CONTADO">Contado</option>
                      <option value="CREDITO">Crédito</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Abogado Responsable</label>
                    <select
                      value={editAbogado}
                      onChange={(e) => setEditAbogado(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Dra. Marcela Mendoza">Dra. Marcela Mendoza</option>
                      <option value="Dr. Camilo Echeverri">Dr. Camilo Echeverri</option>
                      <option value="Dra. Karen García">Dra. Karen García</option>
                      <option value="Dr. Andrés Serrano">Dr. Andrés Serrano</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Prioridad</label>
                    <select
                      value={editPrioridad}
                      onChange={(e) => setEditPrioridad(e.target.value as 'ALTA' | 'MEDIA' | 'URGENTE')}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="ALTA">Alta</option>
                      <option value="MEDIA">Media</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Objeto Jurídico Detallado</label>
                  <textarea
                    rows={3}
                    value={editObjeto}
                    onChange={(e) => setEditObjeto(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditExpedienteModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
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
  }

  // =========================================================================
  // VIEW MODE B: EXPEDIENTES LIST & PIPELINE (Standard view)
  // =========================================================================
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-800">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-12 right-6 z-50 bg-[#4338ca] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER: Exactly matching the system layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Módulo de Gestión Jurídica
          </h1>
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
            RECEPCIÓN Y GESTIÓN DE EXPEDIENTES, PROCESOS Y DOCUMENTOS LEGALES
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveSubModuleId(currentSubModule.id);
              setActiveMenu('workflow-juridica');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
            title="Configurar los pasos y reglas de este workflow"
          >
            <Settings className="w-4 h-4 text-indigo-600" />
            <span>Configurar Workflow</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Expediente</span>
          </button>
        </div>
      </div>

      {/* SUB-MODULE / TYPOLOGY TABS (Contratos, Demandas, Tutelas, PQRSF, Conceptos) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {subModules
            .filter((sm) => sm.isActive)
            .map((sm) => {
              const count = expedientes.filter((e) => e.subModuleId === sm.id).length;
              const isSelected = selectedSubModuleId === sm.id;

              return (
                <button
                  key={sm.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubModuleId(sm.id);
                    setActiveStepFilter('todas');
                    setSelectedDetailExpedienteId(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#4338ca] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{sm.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Prioridad:
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-600"
          >
            <option value="all">Todas</option>
            <option value="URGENTE">Urgente</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
          </select>
        </div>
      </div>

      {/* THE PIPELINE STEPPER CARD (Matching Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        {/* Top Strip with "Todas" Pill & "FLUJO DE TRABAJO" */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveStepFilter('todas')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeStepFilter === 'todas'
                ? 'bg-slate-100 text-slate-900 border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Todas</span>
            <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full ml-1">
              {subModuleExpedientes.length}
            </span>
          </button>

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2 border-l border-slate-200">
            FLUJO DE TRABAJO: {currentSubModule.name.toUpperCase()}
          </span>
        </div>

        {/* Stepper Pipeline Circles */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-between min-w-[750px] px-6 relative">
            {/* Horizontal line connector */}
            <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-200 -z-0" />

            {stepCounts.map((step, idx) => {
              const isActive = activeStepFilter === step.id;
              const hexColor = getHexFromStepColor(step.color);
              const stepNumber = String(idx + 1).padStart(2, '0');

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepFilter(step.id)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                >
                  {/* Circle Node */}
                  <div
                    style={{
                      backgroundColor: isActive ? hexColor : '#ffffff',
                      borderColor: hexColor,
                      color: isActive ? '#ffffff' : hexColor
                    }}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-xs transition-transform ${
                      isActive
                        ? 'scale-110 shadow-md ring-4 ring-indigo-50'
                        : 'hover:scale-105'
                    }`}
                  >
                    {stepNumber}
                  </div>

                  {/* Step Icon + Name */}
                  <div className="text-xs font-semibold text-slate-700 mt-2 flex items-center gap-1.5">
                    {renderStepIcon(step.iconName || step.slug, 'w-3.5 h-3.5 text-slate-500')}
                    <span className="group-hover:text-slate-900 transition-colors">
                      {step.name}
                    </span>
                  </div>

                  {/* Count Pill Badge */}
                  <div
                    style={{ color: hexColor }}
                    className="text-[10px] font-mono font-bold mt-0.5 px-2 py-0.2 rounded-full bg-slate-50 border border-slate-100"
                  >
                    {step.count}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEARCH, FILTERS & DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Search Strip */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              BUSCAR EN {activeStepNameLabel.toUpperCase()}
            </span>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Contraparte, NIT o # Expediente..."
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-end pt-5">
            <button
              type="button"
              onClick={() => showToast('Filtros avanzados activos')}
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

        {/* Table */}
        {filteredExpedientes.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              No se encontraron expedientes en estado &quot;{activeStepNameLabel}&quot;
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
                        selectedExpedientes.length === filteredExpedientes.length &&
                        filteredExpedientes.length > 0
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded text-indigo-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">EXPEDIENTE</th>
                  <th className="py-3.5 px-4">CONTRAPARTE</th>
                  <th className="py-3.5 px-4">EMISIÓN / RADICACIÓN</th>
                  <th className="py-3.5 px-4">VENCIMIENTO</th>
                  <th className="py-3.5 px-4 text-center">PAGO / ESTADO</th>
                  <th className="py-3.5 px-4 text-center">CLASE / CC</th>
                  <th className="py-3.5 px-4 text-right">TOTAL</th>
                  <th className="py-3.5 px-4 text-center">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpedientes.map((exp) => {
                  const stepInfo = steps.find((s) => s.id === exp.currentStepId);
                  const hexColor = stepInfo ? getHexFromStepColor(stepInfo.color) : '#64748b';

                  return (
                    <tr
                      key={exp.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedDetailExpedienteId(exp.id)}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedExpedientes.includes(exp.id)}
                          onChange={() => handleToggleExpediente(exp.id)}
                          className="rounded text-indigo-600 cursor-pointer"
                        />
                      </td>

                      {/* EXPEDIENTE */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold font-mono text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {exp.radicado}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-50 text-indigo-600 border border-purple-100 rounded">
                                ZIP
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                              {exp.titulo}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CONTRAPARTE */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="font-bold text-slate-900 truncate">
                          {exp.contraparte}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          NIT: {exp.nit || '890900943'}
                        </div>
                      </td>

                      {/* EMISIÓN / RADICACIÓN */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                        {exp.fechaRadicacion}
                      </td>

                      {/* VENCIMIENTO */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {exp.diasVencida ? (
                          <div>
                            <div className="font-mono text-slate-800">{exp.fechaLimiteSla}</div>
                            <div className="text-[10px] font-semibold text-rose-600">
                              {exp.diasVencida}
                            </div>
                          </div>
                        ) : exp.fechaLimiteSla ? (
                          <span className="font-mono text-slate-700">{exp.fechaLimiteSla}</span>
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                      </td>

                      {/* PAGO / ESTADO */}
                      <td className="py-3.5 px-4 text-center">
                        {exp.tipoPago === 'CONTADO' ? (
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
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                        {exp.claseCC || '—'}
                      </td>

                      {/* TOTAL */}
                      <td className="py-3.5 px-4 text-right font-bold font-mono text-slate-900 whitespace-nowrap">
                        ${exp.cuantia.toLocaleString('es-CO')}
                        <span className="text-[10px] font-normal text-slate-400 ml-1">COP</span>
                      </td>

                      {/* ACCIÓN (Chevron) */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDetailExpedienteId(exp.id);
                        }}
                      >
                        <button
                          type="button"
                          className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer mx-auto"
                          title="Gestionar expediente jurídico"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: RADICAR NUEVO EXPEDIENTE */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4338ca] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Radicar Expediente en {currentSubModule.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Inicia el flujo en el paso: {steps[0]?.name || 'Recibida'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewExpediente} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Título / Objeto del Expediente *</label>
                <input
                  type="text"
                  required
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  placeholder="Ej: Contrato Marco de Suministro y Distribución Farmacéutica"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Contraparte *</label>
                  <input
                    type="text"
                    required
                    value={newContraparte}
                    onChange={(e) => setNewContraparte(e.target.value)}
                    placeholder="Ej: COLOMBIANA DE COMERCIO S.A."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">NIT / Identificación</label>
                  <input
                    type="text"
                    value={newNit}
                    onChange={(e) => setNewNit(e.target.value)}
                    placeholder="890900943"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Representante Legal / Apoderado</label>
                <input
                  type="text"
                  value={newRepresentante}
                  onChange={(e) => setNewRepresentante(e.target.value)}
                  placeholder="Ej: MARIA DELOSANGELES RIVERO DUARTE"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Cuantía (COP)</label>
                  <input
                    type="number"
                    value={newCuantia}
                    onChange={(e) => setNewCuantia(e.target.value)}
                    placeholder="61835"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tipo de Pago / Modalidad</label>
                  <select
                    value={newTipoPago}
                    onChange={(e) => setNewTipoPago(e.target.value as 'CONTADO' | 'CREDITO')}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                  >
                    <option value="CONTADO">Contado</option>
                    <option value="CREDITO">Crédito</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Abogado Responsable</label>
                  <select
                    value={newAbogado}
                    onChange={(e) => setNewAbogado(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                  >
                    <option value="Dra. Marcela Mendoza">Dra. Marcela Mendoza</option>
                    <option value="Dr. Camilo Echeverri">Dr. Camilo Echeverri</option>
                    <option value="Dra. Karen García">Dra. Karen García</option>
                    <option value="Dr. Andrés Serrano">Dr. Andrés Serrano</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Clase / Centro de Costos</label>
                  <input
                    type="text"
                    value={newClaseCC}
                    onChange={(e) => setNewClaseCC(e.target.value)}
                    placeholder="Suministro / CC-101"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Fecha Límite / Vencimiento SLA</label>
                <input
                  type="date"
                  value={newFechaLimite}
                  onChange={(e) => setNewFechaLimite(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Notas / Objeto Jurídico</label>
                <textarea
                  rows={2}
                  value={newObservaciones}
                  onChange={(e) => setNewObservaciones(e.target.value)}
                  placeholder="Detalles sobre el alcance, pretensiones o antecedentes..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Radicar Expediente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
