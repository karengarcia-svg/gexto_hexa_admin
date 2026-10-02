export type InvoiceStatus = 'RECIBIDA' | 'REVISADA' | 'APROBADA' | 'DEBITADA' | 'CONCILIADA' | 'RECHAZADA';

export interface Factura {
  id: string;
  numero: string; // e.g., 'FE-99401'
  prefijo?: string;
  cufe: string;
  proveedorId: string;
  proveedorNombre: string;
  proveedorNit: string;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaRecepcion: string;
  moneda: string;
  subtotal: number;
  iva: number;
  retefuente: number;
  reteica: number;
  total: number;
  estado: InvoiceStatus;
  tipoDocumento: 'FACTURA' | 'NOTA_CREDITO' | 'NOTA_DEBITO';
  categoria: string;
  descripcion: string;
  aprobadoPor?: string;
  fechaAprobacion?: string;
  items: {
    descripcion: string;
    cantidad: number;
    valorUnitario: number;
    ivaPorcentaje: number;
    subtotal: number;
  }[];
  archivos: {
    pdfUrl?: string;
    xmlUrl?: string;
  };
}

export interface Proveedor {
  id: string;
  nombre: string;
  nit: string;
  correo: string;
  telefono: string;
  ciudad: string;
  regimen: 'COMUN' | 'SIMPLIFICADO' | 'GRAN_CONTRIBUYENTE';
  banco?: string;
  tipoCuenta?: 'AHORROS' | 'CORRIENTE';
  numeroCuenta?: string;
  totalFacturado: number;
  facturasCount: number;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface UsuarioGexto {
  id: string;
  nombre: string;
  email: string;
  rol: 'ADMINISTRADOR' | 'APROBADOR' | 'CONTADOR' | 'AUDITOR';
  cargo: string;
  empresa: string;
  activo: boolean;
  avatarLetra: string;
}

export interface ReglaWorkflow {
  id: string;
  nombre: string;
  montoMinimo: number;
  montoMaximo: number;
  aprobadorRequerido: string;
  ordenAprobacion: number;
  activa: boolean;
}

export interface PoliticaEmpresa {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  aplicaA: string;
  estado: 'ACTIVA' | 'EN_REVISION';
}

export interface ModuloPersonalizado {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  icono: string;
  autor: string;
  fechaCreacion: string;
  estado: 'ACTIVO' | 'EN_DESARROLLO' | 'PLANIFICADO';
  campos: {
    nombre: string;
    etiqueta: string;
    tipo: 'texto' | 'numero' | 'fecha' | 'select' | 'boolean';
    opciones?: string[];
  }[];
  registros: Record<string, any>[];
}
