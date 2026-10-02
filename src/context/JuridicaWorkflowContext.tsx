import React, { createContext, useContext, useState, useEffect } from 'react';

export interface JuridicaStepProperty {
  requiresApproval?: boolean;
  requiresDocument?: boolean;
  allowEditItems?: boolean;
  verifyCounterparts?: boolean;
  requiresPolicy?: boolean;
  allowRollback?: boolean;
  allowDownloadPdf?: boolean;
  allowUnify?: boolean;
  allowBulkAction?: boolean;
  hasSLA?: boolean;
  slaTime?: number;
  slaUnit?: 'Horas' | 'Días';
  requiredOutputFields?: string[];
}

export interface JuridicaStep {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  isInitial?: boolean;
  isTerminal?: boolean;
  color: string; // 'amber' | 'purple' | 'emerald' | 'blue' | 'indigo' | 'red'
  allowedTransitions: string[]; // step IDs it can transition to
  properties: JuridicaStepProperty;
}

export interface JuridicaSubModule {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  steps: JuridicaStep[];
}

export interface JuridicaAdjunto {
  id: string;
  name: string;
  type: string; // 'PDF' | 'XML' | 'DOC' | 'PÓLIZA'
  size: string;
  date: string;
  url?: string;
}

export interface JuridicaTrazabilidad {
  id: string;
  stepName: string;
  stepColor?: string;
  date: string;
  actor: string;
  comment: string;
}

export interface JuridicaExpediente {
  id: string;
  radicado: string;
  subModuleId: string;
  titulo: string;
  contraparte: string;
  nit?: string;
  cufe?: string;
  cuantia: number;
  abogadoResponsable: string;
  fechaRadicacion: string;
  fechaLimiteSla: string;
  diasVencida?: string | null;
  tipoPago?: 'CONTADO' | 'CREDITO';
  claseCC?: string | null;
  currentStepId: string;
  prioridad: 'ALTA' | 'MEDIA' | 'URGENTE';
  observaciones?: string;
  adjuntosCount: number;

  // Rich legal concept fields (Contratos, Demandas, Tutelas, PQRSF, Conceptos)
  objetoJuridico?: string;
  representanteLegal?: string;
  despachoJudicial?: string;
  jurisdiccion?: string;
  valorSubtotal?: number;
  valorRetencion?: number;
  alertaJuridica?: {
    tipo: 'warning' | 'danger' | 'info';
    mensaje: string;
  };
  adjuntosList?: JuridicaAdjunto[];
  trazabilidadList?: JuridicaTrazabilidad[];
}

interface JuridicaContextType {
  subModules: JuridicaSubModule[];
  activeSubModuleId: string;
  setActiveSubModuleId: (id: string) => void;
  addSubModule: (id: string) => void;
  removeSubModule: (id: string) => void;
  createSubModule: (data: { name: string; code: string; description?: string }) => JuridicaSubModule;
  updateSubModule: (id: string, updated: Partial<JuridicaSubModule>) => void;
  deleteSubModule: (id: string) => void;
  updateStep: (subModuleId: string, stepId: string, updated: Partial<JuridicaStep>) => void;
  addStep: (subModuleId: string, newStep: JuridicaStep) => void;
  deleteStep: (subModuleId: string, stepId: string) => void;
  reorderSteps: (subModuleId: string, steps: JuridicaStep[]) => void;
  expedientes: JuridicaExpediente[];
  crearExpediente: (exp: Omit<JuridicaExpediente, 'id' | 'radicado' | 'fechaRadicacion' | 'currentStepId'>) => void;
  avanzarExpediente: (expedienteId: string, nextStepId: string, nota?: string, actor?: string) => void;
  agregarAdjuntoExpediente: (expedienteId: string, adjunto: { name: string; type: string; size: string }) => void;
  actualizarExpediente: (expedienteId: string, updated: Partial<JuridicaExpediente>) => void;
}

const DEFAULT_SUBMODULES: JuridicaSubModule[] = [
  {
    id: 'contratos',
    code: 'CTR',
    name: 'Contratos',
    description: 'Creación de minutas, revisión de cláusulas, pólizas, garantías y firmas digitales.',
    icon: 'FileText',
    isActive: true,
    steps: [
      {
        id: 'ctr-step-1',
        name: 'Recibida',
        slug: 'recibida',
        iconName: 'Mail',
        isInitial: true,
        isTerminal: false,
        color: '#f59e0b',
        allowedTransitions: ['ctr-step-2', 'ctr-step-6'],
        properties: {
          allowEditItems: true,
          allowDownloadPdf: true,
          requiresDocument: true,
          hasSLA: true,
          slaTime: 24,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'ctr-step-2',
        name: 'Revisada',
        slug: 'revisada',
        iconName: 'Eye',
        isInitial: false,
        isTerminal: false,
        color: '#3b82f6',
        allowedTransitions: ['ctr-step-3', 'ctr-step-6'],
        properties: {
          requiresApproval: true,
          requiresDocument: true,
          verifyCounterparts: true,
          allowRollback: true,
          allowDownloadPdf: true,
          allowUnify: true,
          hasSLA: true,
          slaTime: 48,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'ctr-step-3',
        name: 'Aprobada',
        slug: 'aprobada',
        iconName: 'ThumbsUp',
        isInitial: false,
        isTerminal: false,
        color: '#8b5cf6',
        allowedTransitions: ['ctr-step-4', 'ctr-step-6'],
        properties: {
          requiresApproval: true,
          requiresDocument: true,
          requiresPolicy: true,
          allowRollback: true,
          allowDownloadPdf: true,
          hasSLA: true,
          slaTime: 48,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'ctr-step-4',
        name: 'Debitada',
        slug: 'debitada',
        iconName: 'CreditCard',
        isInitial: false,
        isTerminal: false,
        color: '#6366f1',
        allowedTransitions: ['ctr-step-5', 'ctr-step-6'],
        properties: {
          requiresApproval: true,
          requiresDocument: true,
          hasSLA: true,
          slaTime: 48,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'ctr-step-5',
        name: 'Conciliada',
        slug: 'conciliada',
        iconName: 'CheckCircle2',
        isInitial: false,
        isTerminal: true,
        color: '#10b981',
        allowedTransitions: [],
        properties: {
          allowDownloadPdf: true,
          allowUnify: true,
          hasSLA: false
        }
      },
      {
        id: 'ctr-step-6',
        name: 'Rechazada',
        slug: 'rechazada',
        iconName: 'X',
        isInitial: false,
        isTerminal: true,
        color: '#ef4444',
        allowedTransitions: [],
        properties: {
          allowRollback: true
        }
      }
    ]
  },
  {
    id: 'demandas',
    code: 'DEM',
    name: 'Demandas y Litigios',
    description: 'Procesos judiciales ordinarios, ejecutivos, laborales y contencioso administrativos.',
    icon: 'Scale',
    isActive: true,
    steps: [
      {
        id: 'dem-step-1',
        name: 'Notificación y Radicación Judicial',
        slug: 'identificacion',
        isInitial: true,
        isTerminal: false,
        color: 'amber',
        allowedTransitions: ['dem-step-2'],
        properties: {
          requiresDocument: true,
          allowDownloadPdf: true,
          hasSLA: true,
          slaTime: 24,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'dem-step-2',
        name: 'Contestación y Decretación de Pruebas',
        slug: 'contestacion_pruebas',
        isInitial: false,
        isTerminal: false,
        color: 'purple',
        allowedTransitions: ['dem-step-3'],
        properties: {
          requiresApproval: true,
          requiresDocument: true,
          allowRollback: true,
          allowDownloadPdf: true,
          hasSLA: true,
          slaTime: 72,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'dem-step-3',
        name: 'Audiencias y Alegatos de Conclusión',
        slug: 'audiencias_alegatos',
        isInitial: false,
        isTerminal: false,
        color: 'indigo',
        allowedTransitions: ['dem-step-4'],
        properties: {
          requiresApproval: true,
          allowRollback: true,
          hasSLA: true,
          slaTime: 120,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'dem-step-4',
        name: 'Fallo y Sentencia Ejecutoriada',
        slug: 'sentencia_ejecutoriada',
        isInitial: false,
        isTerminal: true,
        color: 'emerald',
        allowedTransitions: [],
        properties: {
          allowDownloadPdf: true,
          allowUnify: true
        }
      }
    ]
  },
  {
    id: 'tutelas',
    code: 'TUT',
    name: 'Tutelas y Medidas Cautelares',
    description: 'Acciones de tutela con términos perentorios constitucionales de estricto cumplimiento.',
    icon: 'ShieldAlert',
    isActive: true,
    steps: [
      {
        id: 'tut-step-1',
        name: 'Notificación Inmediata y Admisión',
        slug: 'admision_tutela',
        isInitial: true,
        isTerminal: false,
        color: 'red',
        allowedTransitions: ['tut-step-2'],
        properties: {
          requiresDocument: true,
          hasSLA: true,
          slaTime: 4,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'tut-step-2',
        name: 'Respuesta Jurídica y Medida Cautelar',
        slug: 'respuesta_tutela',
        isInitial: false,
        isTerminal: false,
        color: 'purple',
        allowedTransitions: ['tut-step-3'],
        properties: {
          requiresApproval: true,
          requiresDocument: true,
          allowDownloadPdf: true,
          hasSLA: true,
          slaTime: 24,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'tut-step-3',
        name: 'Decisión Judicial 1ra/2da Instancia',
        slug: 'fallo_tutela',
        isInitial: false,
        isTerminal: true,
        color: 'emerald',
        allowedTransitions: [],
        properties: {
          allowDownloadPdf: true,
          allowUnify: true
        }
      }
    ]
  },
  {
    id: 'pqrsf',
    code: 'PQR',
    name: 'PQRSF Jurídicas',
    description: 'Peticiones, quejas, reclamos, solicitudes y felicitaciones de índole regulatoria y legal.',
    icon: 'Mail',
    isActive: true,
    steps: [
      {
        id: 'pqr-step-1',
        name: 'Radicación y Asignación Temática',
        slug: 'radicacion_pqr',
        isInitial: true,
        isTerminal: false,
        color: 'amber',
        allowedTransitions: ['pqr-step-2'],
        properties: {
          requiresDocument: true,
          hasSLA: true,
          slaTime: 24,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'pqr-step-2',
        name: 'Investigación y Proyección de Respuesta',
        slug: 'proyeccion_pqr',
        isInitial: false,
        isTerminal: false,
        color: 'purple',
        allowedTransitions: ['pqr-step-3'],
        properties: {
          requiresApproval: true,
          allowRollback: true,
          allowDownloadPdf: true,
          hasSLA: true,
          slaTime: 72,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'pqr-step-3',
        name: 'Respuesta Notificada al Ciudadano',
        slug: 'notificacion_pqr',
        isInitial: false,
        isTerminal: true,
        color: 'emerald',
        allowedTransitions: [],
        properties: {
          allowDownloadPdf: true
        }
      }
    ]
  },
  {
    id: 'conceptos',
    code: 'CON',
    name: 'Conceptos Jurídicos',
    description: 'Consultas doctrinales internas, análisis de viabilidad normativa y legal compliance.',
    icon: 'BookOpen',
    isActive: true,
    steps: [
      {
        id: 'con-step-1',
        name: 'Solicitud de Concepto y Antecedentes',
        slug: 'solicitud_concepto',
        isInitial: true,
        isTerminal: false,
        color: 'amber',
        allowedTransitions: ['con-step-2'],
        properties: {
          requiresDocument: true,
          hasSLA: true,
          slaTime: 24,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'con-step-2',
        name: 'Análisis Normativo y Dictamen',
        slug: 'analisis_dictamen',
        isInitial: false,
        isTerminal: false,
        color: 'purple',
        allowedTransitions: ['con-step-3'],
        properties: {
          requiresApproval: true,
          allowRollback: true,
          allowDownloadPdf: true,
          hasSLA: true,
          slaTime: 48,
          slaUnit: 'Horas'
        }
      },
      {
        id: 'con-step-3',
        name: 'Concepto Jurídico Emitido',
        slug: 'concepto_emitido',
        isInitial: false,
        isTerminal: true,
        color: 'emerald',
        allowedTransitions: [],
        properties: {
          allowDownloadPdf: true
        }
      }
    ]
  }
];

const DEFAULT_EXPEDIENTES: JuridicaExpediente[] = [
  // 1. CONTRATOS
  {
    id: 'exp-1',
    radicado: 'Z0344002846',
    subModuleId: 'contratos',
    titulo: 'Contrato Marco de Suministro y Distribución Farmacéutica',
    contraparte: 'COLOMBIANA DE COMERCIO S.A.',
    nit: '890900943',
    cufe: 'fe98a12c4b890900943...',
    cuantia: 61835,
    valorSubtotal: 56920,
    valorRetencion: 4915,
    abogadoResponsable: 'Dra. Marcela Mendoza',
    fechaRadicacion: '17 Ago, 2026',
    fechaLimiteSla: '25 Ago, 2026',
    diasVencida: null,
    tipoPago: 'CONTADO',
    claseCC: 'Suministro / CC-101',
    currentStepId: 'ctr-step-1', // Recibida
    prioridad: 'ALTA',
    adjuntosCount: 4,
    representanteLegal: 'MARIA DELOSANGELES RIVERO DUARTE',
    jurisdiccion: 'Comercial y Civil Ordinaria',
    alertaJuridica: {
      tipo: 'danger',
      mensaje: '¡Atención! El NIT del contratista requiere validación cruzada con el registro mercantil RUES y listas restrictivas Sarlaft.'
    },
    objetoJuridico: 'Responsable I.V.A. Somos Grandes Contribuyentes Resoluc. 000200 Dic. 27 de 2024 RETENEDORES DE IVA Autorretenedores de Renta Res. No. 0008327 Ago. 24 2.010. Contrato comercial de suministro de insumos farmacéuticos y distribución logística nacional sujeto a póliza de cumplimiento del 20% y garantía de indemnidad.',
    adjuntosList: [
      { id: 'adj-1', name: 'fv089090094300626010C510...', type: 'XML', size: '245 KB', date: '17 Ago, 2026' },
      { id: 'adj-2', name: 'ad0890900943006260112FBA...', type: 'PDF', size: '1.8 MB', date: '17 Ago, 2026' },
      { id: 'adj-3', name: 'Poliza_Seguros_Solidaria_Garantia_Cumplimiento.pdf', type: 'PDF', size: '3.2 MB', date: '17 Ago, 2026' },
      { id: 'adj-4', name: 'Certificado_Existencia_Representacion_Legal_Camara.pdf', type: 'PDF', size: '920 KB', date: '15 Ago, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-1',
        stepName: 'Recibida',
        stepColor: '#f59e0b',
        date: '18/09 10:43 AM',
        actor: 'Sistema Web Jurídico',
        comment: 'Contrato radicado en plataforma jurídica con soporte DIAN y minuta firmada.'
      }
    ]
  },
  {
    id: 'exp-2',
    radicado: 'PQ0263785',
    subModuleId: 'contratos',
    titulo: 'Convenio de Prestación de Servicios de Salud Ocupacional',
    contraparte: 'CAJASAN',
    nit: '890200106',
    cufe: 'a8b7c6d5e4...',
    cuantia: 15865,
    valorSubtotal: 14600,
    valorRetencion: 1265,
    abogadoResponsable: 'Dr. Camilo Echeverri',
    fechaRadicacion: '11 Ago, 2026',
    fechaLimiteSla: '20 Ago, 2026',
    diasVencida: null,
    tipoPago: 'CONTADO',
    claseCC: 'Servicios / CC-204',
    currentStepId: 'ctr-step-1', // Recibida
    prioridad: 'MEDIA',
    adjuntosCount: 2,
    representanteLegal: 'Dr. César Augusto Morales',
    objetoJuridico: 'Convenio interinstitucional de prestación de servicios especializados en medicina preventiva, salud en el trabajo y valoraciones médicas periódicas para colaboradores.',
    adjuntosList: [
      { id: 'adj-caj-1', name: 'Minuta_Convenio_Salud_CAJASAN.pdf', type: 'PDF', size: '2.1 MB', date: '11 Ago, 2026' },
      { id: 'adj-caj-2', name: 'Tarifario_Institucional_Servicios.pdf', type: 'PDF', size: '1.4 MB', date: '11 Ago, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-2',
        stepName: 'Recibida',
        stepColor: '#f59e0b',
        date: '11/08 09:15 AM',
        actor: 'Dra. Marcela Mendoza',
        comment: 'Documentación inicial recibida y cargada para estudio de minutas.'
      }
    ]
  },
  {
    id: 'exp-3',
    radicado: 'E6089917659',
    subModuleId: 'contratos',
    titulo: 'Acuerdo de Conectividad Corporativa y Telefonía IP',
    contraparte: 'COMUNICACION CELULAR S A COMCEL S A',
    nit: '800153993',
    cufe: 'c3d4e5f6a1...',
    cuantia: 39900,
    valorSubtotal: 35000,
    valorRetencion: 4900,
    abogadoResponsable: 'Dra. Karen García',
    fechaRadicacion: '07 Ago, 2026',
    fechaLimiteSla: '14 Ago, 2026',
    diasVencida: 'hace 49 días',
    tipoPago: 'CREDITO',
    claseCC: 'Telecom / CC-305',
    currentStepId: 'ctr-step-1', // Recibida
    prioridad: 'URGENTE',
    adjuntosCount: 3,
    representanteLegal: 'Dra. Andrea Salgado V.',
    objetoJuridico: 'Acuerdo de provisión y licenciamiento de enlaces de fibra óptica dedicados, ancho de banda garantizado 99.8% y conmutadores IP para la sede principal.',
    adjuntosList: [
      { id: 'adj-com-1', name: 'Acuerdo_Maestro_Telecomunicaciones.pdf', type: 'PDF', size: '3.5 MB', date: '07 Ago, 2026' },
      { id: 'adj-com-2', name: 'Anexo_Tecnico_SLA_Disponibilidad.pdf', type: 'PDF', size: '1.2 MB', date: '07 Ago, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-3',
        stepName: 'Recibida',
        stepColor: '#f59e0b',
        date: '07/08 11:00 AM',
        actor: 'Dra. Karen García',
        comment: 'Recepción del pliego contractual con requerimiento urgente de revisión de cláusulas penales.'
      }
    ]
  },
  {
    id: 'exp-22',
    radicado: 'CTR-2026-0042',
    subModuleId: 'contratos',
    titulo: 'Contrato de Suministro Farmacéutico y Distribución Nacional',
    contraparte: 'LABORATORIOS BAXTER COLOMBIA S.A.S.',
    nit: '860002130',
    cufe: 'b1c2d3e4f5...',
    cuantia: 850000,
    valorSubtotal: 780000,
    valorRetencion: 70000,
    abogadoResponsable: 'Dra. Marcela Mendoza',
    fechaRadicacion: '24 Sep, 2026',
    fechaLimiteSla: '03 Oct, 2026',
    diasVencida: null,
    tipoPago: 'CREDITO',
    claseCC: 'Suministro / CC-101',
    currentStepId: 'ctr-step-2', // Revisada
    prioridad: 'ALTA',
    adjuntosCount: 4,
    representanteLegal: 'Dr. Juan Carlos Pardo',
    objetoJuridico: 'Suministro mayorista de soluciones intravenosas, fluidoterapia y nutrición parenteral con certificación de buenas prácticas de manufactura INVIMA.',
    adjuntosList: [
      { id: 'bax-1', name: 'Contrato_Distribucion_Baxter_Final.pdf', type: 'PDF', size: '4.8 MB', date: '24 Sep, 2026' },
      { id: 'bax-2', name: 'Certificacion_BPM_INVIMA_Vigente.pdf', type: 'PDF', size: '1.9 MB', date: '24 Sep, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-22-1',
        stepName: 'Revisada',
        stepColor: '#3b82f6',
        date: '25/09 02:30 PM',
        actor: 'Dra. Marcela Mendoza',
        comment: 'Revisión técnica de cláusula de exclusividad y pólizas aprobada.'
      },
      {
        id: 'tr-22-2',
        stepName: 'Recibida',
        stepColor: '#f59e0b',
        date: '24/09 10:00 AM',
        actor: 'Sistema Web Jurídico',
        comment: 'Expediente radicado con anexos técnicos completos.'
      }
    ]
  },
  {
    id: 'exp-23',
    radicado: 'CTR-2026-0035',
    subModuleId: 'contratos',
    titulo: 'Acuerdo de Distribución Institucional de Medicamentos Hospitalarios',
    contraparte: 'DROGUERIAS Y FARMACIAS CRUZ VERDE',
    nit: '800149695',
    cufe: 'f6e5d4c3b2...',
    cuantia: 320000,
    valorSubtotal: 295000,
    valorRetencion: 25000,
    abogadoResponsable: 'Dr. Camilo Echeverri',
    fechaRadicacion: '10 Sep, 2026',
    fechaLimiteSla: '30 Sep, 2026',
    diasVencida: null,
    tipoPago: 'CREDITO',
    claseCC: 'Institucional / CC-603',
    currentStepId: 'ctr-step-4', // Debitada
    prioridad: 'ALTA',
    adjuntosCount: 5,
    representanteLegal: 'Dra. Mónica Silva Herrera',
    objetoJuridico: 'Convenio de dispensación institucional de medicamentos pos y no pos en sucursales autorizadas a nivel departamental.',
    adjuntosList: [
      { id: 'cv-1', name: 'Convenio_Dispensacion_CruzVerde.pdf', type: 'PDF', size: '3.6 MB', date: '10 Sep, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-23-1',
        stepName: 'Debitada',
        stepColor: '#6366f1',
        date: '28/09 04:00 PM',
        actor: 'Dr. Camilo Echeverri',
        comment: 'Póliza debidamente radicada y validada ante aseguradora.'
      }
    ]
  },

  // 2. DEMANDAS Y LITIGIOS
  {
    id: 'exp-dem-1',
    radicado: 'DEM-2026-0015',
    subModuleId: 'demandas',
    titulo: 'Proceso Ejecutivo Singular de Cobro de Facturas Cambiarias y Títulos Valores',
    contraparte: 'Clínica Los Comuneros Bucaramanga S.A.',
    nit: '890205831',
    cufe: 'dem-fact-831',
    cuantia: 420000000,
    valorSubtotal: 380000000,
    valorRetencion: 40000000,
    despachoJudicial: 'Juzgado 15 Civil del Circuito de Bucaramanga',
    representanteLegal: 'Dr. Hernán Darío Velásquez (Apoderado Judicial)',
    jurisdiccion: 'Civil Ordinaria - Ejecutivos',
    abogadoResponsable: 'Dr. Camilo Echeverri',
    fechaRadicacion: '18 Sep, 2026',
    fechaLimiteSla: '05 Oct, 2026',
    diasVencida: null,
    tipoPago: 'CONTADO',
    claseCC: 'Litigios / CC-950',
    currentStepId: 'dem-step-2', // Contestación y Decretación de Pruebas
    prioridad: 'URGENTE',
    adjuntosCount: 6,
    alertaJuridica: {
      tipo: 'warning',
      mensaje: '¡Atención! El término judicial para radicación de excepciones previas y de mérito vence en 3 días hábiles ante el Juzgado 15 Civil del Circuito.'
    },
    objetoJuridico: 'Demanda ejecutiva singular instaurada por incumplimiento reiterado en el pago de 14 facturas cambiarias de compraventa debidamente aceptadas, solicitando mandamiento de pago por $420.000.000 COP, cobro de intereses moratorios a la tasa máxima certificada por la Superfinanciera, embargo preventivo de cuentas bancarias y remate judicial de bienes.',
    adjuntosList: [
      { id: 'dem-adj-1', name: 'Demanda_Radicada_Reparto_Judicial.pdf', type: 'PDF', size: '4.2 MB', date: '18 Sep, 2026' },
      { id: 'dem-adj-2', name: 'Auto_Mandamiento_de_Pago_Juzgado15.pdf', type: 'PDF', size: '1.1 MB', date: '22 Sep, 2026' },
      { id: 'dem-adj-3', name: 'Poder_Especial_Autenticado_Notaria.pdf', type: 'PDF', size: '850 KB', date: '18 Sep, 2026' },
      { id: 'dem-adj-4', name: 'Facturas_Titulos_Valores_Originales.pdf', type: 'PDF', size: '6.5 MB', date: '18 Sep, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-dem-1',
        stepName: 'Contestación y Decretación de Pruebas',
        stepColor: '#8b5cf6',
        date: '22/09 03:15 PM',
        actor: 'Dr. Camilo Echeverri',
        comment: 'Auto de mandamiento de pago notificado por estado judicial. Se estructura contestación y memorial de medidas cautelares.'
      },
      {
        id: 'tr-dem-2',
        stepName: 'Notificación y Radicación Judicial',
        stepColor: '#f59e0b',
        date: '18/09 09:30 AM',
        actor: 'Sistema Judicial Web',
        comment: 'Radicación en ventanilla virtual de la Rama Judicial con código de reparto 2026-0015.'
      }
    ]
  },
  {
    id: 'exp-dem-2',
    radicado: 'DEM-2026-0028',
    subModuleId: 'demandas',
    titulo: 'Demanda Ordinaria Laboral de Primera Instancia por Indemnización Moratoria',
    contraparte: 'Ex-colaborador Carlos Alberto Pinzón R.',
    nit: '91283741',
    cufe: 'dem-lab-028',
    cuantia: 85000000,
    valorSubtotal: 75000000,
    valorRetencion: 10000000,
    despachoJudicial: 'Juzgado 3ro Laboral del Circuito de Bucaramanga',
    representanteLegal: 'Dra. Yolanda Rueda (Abogada Demandante)',
    jurisdiccion: 'Laboral y de la Seguridad Social',
    abogadoResponsable: 'Dra. Marcela Mendoza',
    fechaRadicacion: '12 Sep, 2026',
    fechaLimiteSla: '02 Oct, 2026',
    diasVencida: null,
    tipoPago: 'CONTADO',
    claseCC: 'Laboral / CC-951',
    currentStepId: 'dem-step-1', // Notificación y Radicación
    prioridad: 'ALTA',
    adjuntosCount: 3,
    objetoJuridico: 'Demanda laboral reclamando reajuste de cesantías, primas extralegales e indemnización moratoria del artículo 65 del CST; contestación proyectando excepción de pago y prescripción trienal.',
    adjuntosList: [
      { id: 'dem-lab-1', name: 'Demanda_Laboral_Notificada_Personalmente.pdf', type: 'PDF', size: '3.1 MB', date: '12 Sep, 2026' },
      { id: 'dem-lab-2', name: 'Liquidacion_Contrato_Paz_y_Salvo.pdf', type: 'PDF', size: '1.2 MB', date: '12 Sep, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-dem2-1',
        stepName: 'Notificación y Radicación Judicial',
        stepColor: '#f59e0b',
        date: '12/09 08:30 AM',
        actor: 'Dra. Marcela Mendoza',
        comment: 'Notificación electrónica recibida del Despacho Laboral. Se solicitan antecedentes a Talento Humano.'
      }
    ]
  },

  // 3. TUTELAS Y MEDIDAS CAUTELARES
  {
    id: 'exp-tut-1',
    radicado: 'TUT-2026-0008',
    subModuleId: 'tutelas',
    titulo: 'Acción de Tutela por Derecho Fundamental a la Salud y Suministro de Medicamento No POS',
    contraparte: 'Juzgado 3ro Penal Municipal con Función de Garantías de Girón',
    nit: '000000000',
    cufe: 'tut-juz-003',
    cuantia: 0,
    despachoJudicial: 'Juzgado 3ro Penal Municipal de Girón',
    representanteLegal: 'Accionante: Pedro Nel Gómez / Accionado: Disfarma SAS',
    jurisdiccion: 'Constitucional (Art. 86 CP)',
    abogadoResponsable: 'Dra. Karen García',
    fechaRadicacion: '01 Oct, 2026',
    fechaLimiteSla: '03 Oct, 2026',
    diasVencida: null,
    tipoPago: 'CONTADO',
    claseCC: 'Constitucional / CC-960',
    currentStepId: 'tut-step-1', // Notificación Inmediata y Admisión
    prioridad: 'URGENTE',
    adjuntosCount: 3,
    alertaJuridica: {
      tipo: 'danger',
      mensaje: '🚨 ¡Término Perentorio Constitucional! Faltan menos de 24 horas para dar contestación formal al Despacho Judicial bajo apercibimiento de desacato.'
    },
    objetoJuridico: 'Acción constitucional de tutela invocando protección inmediata del derecho fundamental a la salud y a la vida digna; el accionante solicita suministro de medicamento de alta tecnología sin copago ni dilaciones administrativas.',
    adjuntosList: [
      { id: 'tut-adj-1', name: 'Auto_Admisorio_Tutela_Juzgado3.pdf', type: 'PDF', size: '1.2 MB', date: '01 Oct, 2026' },
      { id: 'tut-adj-2', name: 'Escrito_Accion_Tutela_Demanda.pdf', type: 'PDF', size: '2.5 MB', date: '01 Oct, 2026' },
      { id: 'tut-adj-3', name: 'Historia_Clinica_Epicrisis_Medica.pdf', type: 'PDF', size: '3.8 MB', date: '01 Oct, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-tut-1',
        stepName: 'Notificación Inmediata y Admisión',
        stepColor: '#ef4444',
        date: '01/10 11:20 AM',
        actor: 'Dra. Karen García',
        comment: 'Auto admisorio recibido por correo judicial con término perentorio de 48 horas.'
      }
    ]
  },
  {
    id: 'exp-tut-2',
    radicado: 'TUT-2026-0012',
    subModuleId: 'tutelas',
    titulo: 'Acción de Tutela por Vulneración al Derecho Fundamental de Petición',
    contraparte: 'Juzgado 8vo Civil Municipal de Bucaramanga',
    nit: '000000000',
    cufe: 'tut-juz-008',
    cuantia: 0,
    despachoJudicial: 'Juzgado 8vo Civil Municipal de Bucaramanga',
    representanteLegal: 'Accionante: Veeduría Ciudadana en Salud',
    jurisdiccion: 'Constitucional',
    abogadoResponsable: 'Dr. Camilo Echeverri',
    fechaRadicacion: '26 Sep, 2026',
    fechaLimiteSla: '28 Sep, 2026',
    diasVencida: null,
    tipoPago: 'CONTADO',
    claseCC: 'Constitucional / CC-960',
    currentStepId: 'tut-step-2', // Respuesta Jurídica y Medida Cautelar
    prioridad: 'ALTA',
    adjuntosCount: 2,
    objetoJuridico: 'Reclamación de presunta falta de respuesta a petición radicada el mes anterior; memorial de descargos acredita remisión oportuna por canal electrónico certificado.',
    adjuntosList: [
      { id: 'tut2-1', name: 'Auto_Admision_Tutela_Peticion.pdf', type: 'PDF', size: '980 KB', date: '26 Sep, 2026' },
      { id: 'tut2-2', name: 'Copia_Respuesta_Correo_Certificado.pdf', type: 'PDF', size: '1.4 MB', date: '27 Sep, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-tut2-1',
        stepName: 'Respuesta Jurídica y Medida Cautelar',
        stepColor: '#8b5cf6',
        date: '27/09 03:00 PM',
        actor: 'Dr. Camilo Echeverri',
        comment: 'Memorial de respuesta radicado con constancia de entrega del operador postal.'
      }
    ]
  },

  // 4. PQRSF JURÍDICAS
  {
    id: 'exp-pqr-1',
    radicado: 'PQR-2026-0104',
    subModuleId: 'pqrsf',
    titulo: 'Requerimiento Sancionatorio INVIMA sobre Farmacovigilancia y Trazabilidad de Lote',
    contraparte: 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA)',
    nit: '830000167',
    cufe: 'invima-req-104',
    cuantia: 0,
    representanteLegal: 'Dr. Carlos Julio Morales (Director Técnico Sanitario INVIMA)',
    jurisdiccion: 'Administrativo y Regulatorio Sanitario',
    abogadoResponsable: 'Dr. Andrés Felipe Serrano',
    fechaRadicacion: '28 Sep, 2026',
    fechaLimiteSla: '08 Oct, 2026',
    diasVencida: null,
    tipoPago: 'CONTADO',
    claseCC: 'Regulatorio / CC-970',
    currentStepId: 'pqr-step-2', // Investigación y Proyección
    prioridad: 'MEDIA',
    adjuntosCount: 3,
    alertaJuridica: {
      tipo: 'warning',
      mensaje: '⚠️ ¡Atención! Trámite regulatorio con término legal perentorio de 15 días hábiles conforme al CPACA.'
    },
    objetoJuridico: 'Requerimiento formal de información técnica y soporte de farmacovigilancia emitido por la Dirección de Medicamentos del INVIMA respecto al protocolo de almacenamiento, cadena de frío y trazabilidad de lote de biológicos.',
    adjuntosList: [
      { id: 'pqr-adj-1', name: 'Oficio_Requerimiento_Oficial_INVIMA.pdf', type: 'PDF', size: '1.5 MB', date: '28 Sep, 2026' },
      { id: 'pqr-adj-2', name: 'Informe_Tecnico_Farmacovigilancia_Lab.pdf', type: 'PDF', size: '4.1 MB', date: '30 Sep, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-pqr-1',
        stepName: 'Investigación y Proyección de Respuesta',
        stepColor: '#8b5cf6',
        date: '30/09 04:45 PM',
        actor: 'Dr. Andrés Felipe Serrano',
        comment: 'Consolidación de pruebas técnicas del laboratorio central para proyectar memorial de respuesta formal.'
      },
      {
        id: 'tr-pqr-2',
        stepName: 'Radicación y Asignación Temática',
        stepColor: '#f59e0b',
        date: '28/09 10:00 AM',
        actor: 'Sistema Web Jurídico',
        comment: 'Oficio INVIMA recibido y asignado a coordinación regulatoria.'
      }
    ]
  },

  // 5. CONCEPTOS JURÍDICOS
  {
    id: 'exp-con-1',
    radicado: 'CON-2026-0019',
    subModuleId: 'conceptos',
    titulo: 'Concepto sobre Régimen de Exención Tributaria de IVA en Dispositivos Médicos',
    contraparte: 'Dirección Financiera y Contable Interna',
    nit: '900580962',
    cufe: 'cpt-trib-019',
    cuantia: 185000000,
    valorSubtotal: 185000000,
    valorRetencion: 0,
    representanteLegal: 'Dra. Liliana Gómez (Directora Financiera)',
    jurisdiccion: 'Doctrinal y Compliance Tributario',
    abogadoResponsable: 'Dra. Marcela Mendoza',
    fechaRadicacion: '29 Sep, 2026',
    fechaLimiteSla: '06 Oct, 2026',
    diasVencida: null,
    tipoPago: 'CONTADO',
    claseCC: 'Tributario / CC-980',
    currentStepId: 'con-step-1', // Solicitud de Concepto
    prioridad: 'MEDIA',
    adjuntosCount: 2,
    alertaJuridica: {
      tipo: 'info',
      mensaje: 'ℹ️ Consulta interna prioritaria para fijación de políticas de precios y contratación comercial 2027.'
    },
    objetoJuridico: 'Análisis doctrinal y jurisprudencial sobre la exención de IVA en la comercialización de insumos biomédicos de alta complejidad conforme al Estatuto Tributario y fallos recientes de la Sección Cuarta del Consejo de Estado.',
    adjuntosList: [
      { id: 'con-adj-1', name: 'Solicitud_Formal_Consulta_Financiera.pdf', type: 'PDF', size: '640 KB', date: '29 Sep, 2026' },
      { id: 'con-adj-2', name: 'Sentencia_Consejo_Estado_Exencion_IVA.pdf', type: 'PDF', size: '2.1 MB', date: '29 Sep, 2026' }
    ],
    trazabilidadList: [
      {
        id: 'tr-con-1',
        stepName: 'Solicitud de Concepto y Antecedentes',
        stepColor: '#f59e0b',
        date: '29/09 09:15 AM',
        actor: 'Dra. Marcela Mendoza',
        comment: 'Recepción de antecedentes financieros y apertura de estudio normativo.'
      }
    ]
  }
];

const JuridicaWorkflowContext = createContext<JuridicaContextType | undefined>(undefined);

export const JuridicaWorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subModules, setSubModules] = useState<JuridicaSubModule[]>(() => {
    const saved = localStorage.getItem('gexto_juridica_submodules_v2');
    return saved ? JSON.parse(saved) : DEFAULT_SUBMODULES;
  });

  const [activeSubModuleId, setActiveSubModuleId] = useState<string>('contratos');

  const [expedientes, setExpedientes] = useState<JuridicaExpediente[]>(() => {
    const saved = localStorage.getItem('gexto_juridica_expedientes_v5');
    return saved ? JSON.parse(saved) : DEFAULT_EXPEDIENTES;
  });

  useEffect(() => {
    localStorage.setItem('gexto_juridica_submodules_v2', JSON.stringify(subModules));
  }, [subModules]);

  useEffect(() => {
    localStorage.setItem('gexto_juridica_expedientes_v5', JSON.stringify(expedientes));
  }, [expedientes]);

  const addSubModule = (id: string) => {
    setSubModules((prev) =>
      prev.map((sm) => (sm.id === id ? { ...sm, isActive: true } : sm))
    );
  };

  const removeSubModule = (id: string) => {
    setSubModules((prev) =>
      prev.map((sm) => (sm.id === id ? { ...sm, isActive: false } : sm))
    );
  };

  const createSubModule = (data: { name: string; code: string; description?: string }) => {
    const code = (data.code || 'TIP').toUpperCase().trim().slice(0, 5);
    const id = `tipologia-${Date.now()}`;
    const initialSteps: JuridicaStep[] = [
      {
        id: `step-${id}-1`,
        name: 'Solicitud y Radicación',
        slug: 'solicitud_radicacion',
        isInitial: true,
        isTerminal: false,
        color: '#f59e0b',
        allowedTransitions: [`step-${id}-2`],
        properties: {
          requiresDocument: true,
          hasSLA: true,
          slaTime: 24,
          slaUnit: 'Horas',
          allowDownloadPdf: true
        }
      },
      {
        id: `step-${id}-2`,
        name: 'Revisión y Análisis Legal',
        slug: 'revision_legal',
        isInitial: false,
        isTerminal: false,
        color: '#3b82f6',
        allowedTransitions: [`step-${id}-3`, `step-${id}-4`],
        properties: {
          requiresApproval: true,
          hasSLA: true,
          slaTime: 48,
          slaUnit: 'Horas'
        }
      },
      {
        id: `step-${id}-3`,
        name: 'Finalizado / Aprobado',
        slug: 'finalizado_aprobado',
        isInitial: false,
        isTerminal: true,
        color: '#10b981',
        allowedTransitions: [],
        properties: {
          allowDownloadPdf: true
        }
      },
      {
        id: `step-${id}-4`,
        name: 'Rechazado / Archivado',
        slug: 'rechazado_archivado',
        isInitial: false,
        isTerminal: true,
        color: '#e11d48',
        allowedTransitions: [],
        properties: {}
      }
    ];

    const newModule: JuridicaSubModule = {
      id,
      code,
      name: data.name.trim(),
      description: data.description?.trim() || `Gestión y flujo personalizado para ${data.name.trim()}`,
      icon: 'FileText',
      isActive: true,
      steps: initialSteps
    };

    setSubModules((prev) => [...prev, newModule]);
    setActiveSubModuleId(id);
    return newModule;
  };

  const updateSubModule = (id: string, updated: Partial<JuridicaSubModule>) => {
    setSubModules((prev) =>
      prev.map((sm) => (sm.id === id ? { ...sm, ...updated } : sm))
    );
  };

  const deleteSubModule = (id: string) => {
    setSubModules((prev) => {
      const filtered = prev.filter((sm) => sm.id !== id);
      if (activeSubModuleId === id && filtered.length > 0) {
        setActiveSubModuleId(filtered[0].id);
      }
      return filtered;
    });
  };

  const updateStep = (subModuleId: string, stepId: string, updated: Partial<JuridicaStep>) => {
    setSubModules((prev) =>
      prev.map((sm) => {
        if (sm.id !== subModuleId) return sm;
        return {
          ...sm,
          steps: sm.steps.map((s) => (s.id === stepId ? { ...s, ...updated } : s))
        };
      })
    );
  };

  const addStep = (subModuleId: string, newStep: JuridicaStep) => {
    setSubModules((prev) =>
      prev.map((sm) => {
        if (sm.id !== subModuleId) return sm;
        return {
          ...sm,
          steps: [...sm.steps, newStep]
        };
      })
    );
  };

  const deleteStep = (subModuleId: string, stepId: string) => {
    setSubModules((prev) =>
      prev.map((sm) => {
        if (sm.id !== subModuleId) return sm;
        return {
          ...sm,
          steps: sm.steps.filter((s) => s.id !== stepId)
        };
      })
    );
  };

  const reorderSteps = (subModuleId: string, newSteps: JuridicaStep[]) => {
    setSubModules((prev) =>
      prev.map((sm) => (sm.id === subModuleId ? { ...sm, steps: newSteps } : sm))
    );
  };

  const crearExpediente = (
    exp: Omit<JuridicaExpediente, 'id' | 'radicado' | 'fechaRadicacion' | 'currentStepId'>
  ) => {
    const sm = subModules.find((s) => s.id === exp.subModuleId) || subModules[0];
    const initialStep = sm.steps.find((st) => st.isInitial) || sm.steps[0];
    const prefix = sm.code;
    const year = new Date().getFullYear();
    const count = expedientes.filter((e) => e.subModuleId === exp.subModuleId).length + 1;
    const radicado = `${prefix}-${year}-${String(count).padStart(4, '0')}`;

    const newExp: JuridicaExpediente = {
      ...exp,
      id: `exp-${Date.now()}`,
      radicado,
      fechaRadicacion: new Date().toISOString().split('T')[0],
      currentStepId: initialStep ? initialStep.id : '',
      adjuntosList: exp.adjuntosList || [],
      trazabilidadList: [
        {
          id: `tr-${Date.now()}`,
          stepName: initialStep?.name || 'Radicación',
          stepColor: initialStep?.color || '#f59e0b',
          date: `${new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })} ${new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })}`,
          actor: exp.abogadoResponsable || 'Sistema Web Jurídico',
          comment: 'Expediente creado y radicado en el flujo.'
        }
      ]
    };

    setExpedientes([newExp, ...expedientes]);
  };

  const avanzarExpediente = (expedienteId: string, nextStepId: string, nota?: string, actor?: string) => {
    setExpedientes((prev) =>
      prev.map((e) => {
        if (e.id !== expedienteId) return e;
        const sm = subModules.find((s) => s.id === e.subModuleId);
        const targetStep = sm?.steps.find((s) => s.id === nextStepId);
        const stepName = targetStep?.name || 'Siguiente Paso';
        const stepColor = targetStep?.color || '#3b82f6';

        const now = new Date();
        const dateStr = `${now.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })} ${now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

        const newTrazabilidad: JuridicaTrazabilidad = {
          id: `tr-${Date.now()}`,
          stepName,
          stepColor,
          date: dateStr,
          actor: actor || e.abogadoResponsable || 'Dra. Marcela Mendoza',
          comment: nota || `Transición de estado hacia ${stepName} registrada en el workflow.`
        };

        const existingTraz = e.trazabilidadList || [];

        return {
          ...e,
          currentStepId: nextStepId,
          observaciones: nota ? `${nota} (${dateStr})` : e.observaciones,
          trazabilidadList: [newTrazabilidad, ...existingTraz]
        };
      })
    );
  };

  const agregarAdjuntoExpediente = (expedienteId: string, adjunto: { name: string; type: string; size: string }) => {
    setExpedientes((prev) =>
      prev.map((e) => {
        if (e.id !== expedienteId) return e;
        const now = new Date();
        const newAdj: JuridicaAdjunto = {
          id: `adj-${Date.now()}`,
          name: adjunto.name,
          type: adjunto.type,
          size: adjunto.size,
          date: now.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
        };
        const updatedList = e.adjuntosList ? [newAdj, ...e.adjuntosList] : [newAdj];
        return {
          ...e,
          adjuntosList: updatedList,
          adjuntosCount: updatedList.length
        };
      })
    );
  };

  const actualizarExpediente = (expedienteId: string, updated: Partial<JuridicaExpediente>) => {
    setExpedientes((prev) =>
      prev.map((e) => (e.id === expedienteId ? { ...e, ...updated } : e))
    );
  };

  return (
    <JuridicaWorkflowContext.Provider
      value={{
        subModules,
        activeSubModuleId,
        setActiveSubModuleId,
        addSubModule,
        removeSubModule,
        createSubModule,
        updateSubModule,
        deleteSubModule,
        updateStep,
        addStep,
        deleteStep,
        reorderSteps,
        expedientes,
        crearExpediente,
        avanzarExpediente,
        agregarAdjuntoExpediente,
        actualizarExpediente
      }}
    >
      {children}
    </JuridicaWorkflowContext.Provider>
  );
};

export const useJuridicaWorkflow = () => {
  const context = useContext(JuridicaWorkflowContext);
  if (!context) {
    throw new Error('useJuridicaWorkflow must be used within a JuridicaWorkflowProvider');
  }
  return context;
};
