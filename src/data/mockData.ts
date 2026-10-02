import { Factura, Proveedor, UsuarioGexto, ReglaWorkflow, PoliticaEmpresa, ModuloPersonalizado } from '../types';

export const CURRENT_USER: UsuarioGexto = {
  id: 'usr-karen-01',
  nombre: 'Karen Garcia',
  email: 'karenyinet.0216@gmail.com',
  rol: 'ADMINISTRADOR',
  cargo: 'Administrador de Plataforma',
  empresa: 'Disfarma SAS',
  activo: true,
  avatarLetra: 'K'
};

export const INITIAL_PROVEEDORES: Proveedor[] = [
  {
    id: 'prov-01',
    nombre: 'COMUNICACION CELULAR S A COMCEL S A',
    nit: '800153993',
    correo: 'facturacion.electronica@claro.com.co',
    telefono: '(601) 744-0000',
    ciudad: 'Bogotá D.C.',
    regimen: 'GRAN_CONTRIBUYENTE',
    banco: 'Bancolombia',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '001-992144-88',
    totalFacturado: 39900,
    facturasCount: 1,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-02',
    nombre: 'CAJASAN',
    nit: '890200106',
    correo: 'facturas@cajasan.com',
    telefono: '(607) 643-4444',
    ciudad: 'Bucaramanga',
    regimen: 'GRAN_CONTRIBUYENTE',
    banco: 'Banco de Bogotá',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '124-009182-12',
    totalFacturado: 15865,
    facturasCount: 1,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-03',
    nombre: 'TECNOQUIMICAS S.A.',
    nit: '890300188',
    correo: 'servicioalcliente@tecnoquimicas.com',
    telefono: '(602) 524-2300',
    ciudad: 'Cali',
    regimen: 'GRAN_CONTRIBUYENTE',
    banco: 'Bancolombia',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '048-119283-99',
    totalFacturado: 4500000,
    facturasCount: 8,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-04',
    nombre: 'SANOFI AVENTIS DE COLOMBIA S.A.',
    nit: '860002170',
    correo: 'cuentasporcobrar@sanofi.com',
    telefono: '(601) 628-8000',
    ciudad: 'Bogotá D.C.',
    regimen: 'GRAN_CONTRIBUYENTE',
    banco: 'Citibank',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '992-102938-00',
    totalFacturado: 3820000,
    facturasCount: 6,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-05',
    nombre: 'GENFAR S.A.',
    nit: '860025900',
    correo: 'facturacion@genfar.com',
    telefono: '(601) 745-8800',
    ciudad: 'Bogotá D.C.',
    regimen: 'COMUN',
    banco: 'Davivienda',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '055-881920-44',
    totalFacturado: 2150000,
    facturasCount: 4,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-06',
    nombre: 'LAFRANCOL S.A.S.',
    nit: '890300244',
    correo: 'ventas@lafrancol.com',
    telefono: '(602) 685-9000',
    ciudad: 'Cali',
    regimen: 'GRAN_CONTRIBUYENTE',
    banco: 'Bancolombia',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '102-449102-77',
    totalFacturado: 1980000,
    facturasCount: 5,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-07',
    nombre: 'DISTRIBUIDORA FARMACOLOMBIA S.A.S.',
    nit: '900441920',
    correo: 'contabilidad@farmacolombia.com.co',
    telefono: '(607) 635-1234',
    ciudad: 'Bucaramanga',
    regimen: 'COMUN',
    banco: 'Banco de Occidente',
    tipoCuenta: 'AHORROS',
    numeroCuenta: '440-192837-55',
    totalFacturado: 940000,
    facturasCount: 3,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-08',
    nombre: 'ENVIA COLVANES S.A.S.',
    nit: '800171291',
    correo: 'facturacion@envia.co',
    telefono: '(601) 423-0000',
    ciudad: 'Bogotá D.C.',
    regimen: 'COMUN',
    banco: 'Bancolombia',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '302-881920-33',
    totalFacturado: 620000,
    facturasCount: 7,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-09',
    nombre: 'SERVIENTREGA S.A.',
    nit: '860512330',
    correo: 'facturacionelectronica@servientrega.com',
    telefono: '(601) 770-0200',
    ciudad: 'Bogotá D.C.',
    regimen: 'GRAN_CONTRIBUYENTE',
    banco: 'Banco de Bogotá',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '009-881920-11',
    totalFacturado: 540000,
    facturasCount: 6,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-10',
    nombre: 'ASEGURADORA SOLIDARIA DE COLOMBIA',
    nit: '860002167',
    correo: 'polizas@solidaria.com.co',
    telefono: '(601) 291-2000',
    ciudad: 'Bogotá D.C.',
    regimen: 'GRAN_CONTRIBUYENTE',
    banco: 'Bancolombia',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '119-283940-22',
    totalFacturado: 480000,
    facturasCount: 2,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-11',
    nombre: 'SUMINISTROS Y DOTACIONES DE SANTANDER S.A.S.',
    nit: '901229341',
    correo: 'ventas@sumisantander.com',
    telefono: '(607) 671-9988',
    ciudad: 'Floridablanca',
    regimen: 'COMUN',
    banco: 'Bancolombia',
    tipoCuenta: 'AHORROS',
    numeroCuenta: '772-918293-88',
    totalFacturado: 390000,
    facturasCount: 4,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-12',
    nombre: 'ELECTRIFICADORA DE SANTANDER S.A. E.S.P. (ESSA)',
    nit: '890201211',
    correo: 'facturas@essa.com.co',
    telefono: '(607) 633-9737',
    ciudad: 'Bucaramanga',
    regimen: 'GRAN_CONTRIBUYENTE',
    banco: 'Banco de Bogotá',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '109-293847-19',
    totalFacturado: 580000,
    facturasCount: 5,
    estado: 'ACTIVO'
  },
  {
    id: 'prov-13',
    nombre: 'ACUEDUCTO METROPOLITANO DE BUCARAMANGA S.A. E.S.P.',
    nit: '890200329',
    correo: 'recaudos@amb.com.co',
    telefono: '(607) 632-0220',
    ciudad: 'Bucaramanga',
    regimen: 'GRAN_CONTRIBUYENTE',
    banco: 'Bancolombia',
    tipoCuenta: 'CORRIENTE',
    numeroCuenta: '003-882910-44',
    totalFacturado: 242000,
    facturasCount: 6,
    estado: 'ACTIVO'
  }
];

export const INITIAL_FACTURAS: Factura[] = [
  {
    id: 'fac-01',
    numero: 'SETP990001429',
    prefijo: 'SETP',
    cufe: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef',
    proveedorId: 'prov-01',
    proveedorNombre: 'COMUNICACION CELULAR S A COMCEL S A',
    proveedorNit: '800153993',
    fechaEmision: '2026-09-15',
    fechaVencimiento: '2026-10-15',
    fechaRecepcion: '2026-09-16 09:22:10',
    moneda: 'COP',
    subtotal: 33540,
    iva: 6360,
    retefuente: 0,
    reteica: 0,
    total: 39900,
    estado: 'RECIBIDA',
    tipoDocumento: 'FACTURA',
    categoria: 'Telecomunicaciones y Conectividad Sedes',
    descripcion: 'Servicios de conectividad de datos móviles y enlaces corporativos sedes Disfarma SAS',
    items: [
      {
        descripcion: 'Planes Corporativos Móviles Sedes Disfarma',
        cantidad: 1,
        valorUnitario: 33540,
        ivaPorcentaje: 19,
        subtotal: 33540
      }
    ],
    archivos: {
      pdfUrl: 'https://gextotest.hexalabs.com.co/storage/invoices/fac-01.pdf',
      xmlUrl: 'https://gextotest.hexalabs.com.co/storage/invoices/fac-01.xml'
    }
  },
  {
    id: 'fac-02',
    numero: 'FAC-CJ-2026-8812',
    prefijo: 'FAC',
    cufe: 'f9e8d7c6b5a403928172635485960718293049586716253443526172839405960718293a4b5c6d',
    proveedorId: 'prov-02',
    proveedorNombre: 'CAJASAN',
    proveedorNit: '890200106',
    fechaEmision: '2026-09-20',
    fechaVencimiento: '2026-10-20',
    fechaRecepcion: '2026-09-21 14:40:05',
    moneda: 'COP',
    subtotal: 15110,
    iva: 755,
    retefuente: 0,
    reteica: 0,
    total: 15865,
    estado: 'RECIBIDA',
    tipoDocumento: 'FACTURA',
    categoria: 'Bienestar y Servicios Operativos',
    descripcion: 'Servicios de bienestar corporativo y capacitaciones operativas Disfarma SAS',
    items: [
      {
        descripcion: 'Servicios Operativos Integrales Cajasan',
        cantidad: 1,
        valorUnitario: 15110,
        ivaPorcentaje: 5,
        subtotal: 15110
      }
    ],
    archivos: {
      pdfUrl: 'https://gextotest.hexalabs.com.co/storage/invoices/fac-02.pdf',
      xmlUrl: 'https://gextotest.hexalabs.com.co/storage/invoices/fac-02.xml'
    }
  },
  {
    id: 'fac-nc-01',
    numero: 'NC-99102',
    prefijo: 'NC',
    cufe: 'bb88cc11002233445566778899aabbccddeeff00112233445566778899aabbccddeeff',
    proveedorId: 'prov-01',
    proveedorNombre: 'COMUNICACION CELULAR S A COMCEL S A',
    proveedorNit: '800153993',
    fechaEmision: '2026-09-18',
    fechaVencimiento: '2026-09-18',
    fechaRecepcion: '2026-09-19 11:15:00',
    moneda: 'COP',
    subtotal: 5000,
    iva: 950,
    retefuente: 0,
    reteica: 0,
    total: 5950,
    estado: 'RECIBIDA',
    tipoDocumento: 'NOTA_CREDITO',
    categoria: 'Ajuste de Facturación',
    descripcion: 'Nota Crédito por descuento comercial en enlace de contingencia',
    items: [
      {
        descripcion: 'Descuento Comercial Factura Anterior',
        cantidad: 1,
        valorUnitario: 5000,
        ivaPorcentaje: 19,
        subtotal: 5000
      }
    ],
    archivos: {
      pdfUrl: 'https://gextotest.hexalabs.com.co/storage/invoices/nc-01.pdf',
      xmlUrl: 'https://gextotest.hexalabs.com.co/storage/invoices/nc-01.xml'
    }
  }
];

export const INITIAL_USUARIOS: UsuarioGexto[] = [
  CURRENT_USER,
  {
    id: 'usr-02',
    nombre: 'Andrés Camilo Morales',
    email: 'andres.morales@disfarma.com.co',
    rol: 'APROBADOR',
    cargo: 'Director de Compras & Operaciones',
    empresa: 'Disfarma SAS',
    activo: true,
    avatarLetra: 'A'
  },
  {
    id: 'usr-03',
    nombre: 'Laura Sofía Gómez',
    email: 'laura.gomez@disfarma.com.co',
    rol: 'CONTADOR',
    cargo: 'Contadora General',
    empresa: 'Disfarma SAS',
    activo: true,
    avatarLetra: 'L'
  },
  {
    id: 'usr-04',
    nombre: 'Carlos Mendoza',
    email: 'carlos.mendoza@disfarma.com.co',
    rol: 'AUDITOR',
    cargo: 'Auditor Financiero',
    empresa: 'Disfarma SAS',
    activo: true,
    avatarLetra: 'C'
  }
];

export const INITIAL_REGLAS_WORKFLOW: ReglaWorkflow[] = [
  {
    id: 'wf-01',
    nombre: 'Facturas Menores a $1.000.000 COP',
    montoMinimo: 0,
    montoMaximo: 1000000,
    aprobadorRequerido: 'Coordinador de Área',
    ordenAprobacion: 1,
    activa: true
  },
  {
    id: 'wf-02',
    nombre: 'Facturas Medianas ($1.000.000 - $10.000.000 COP)',
    montoMinimo: 1000001,
    montoMaximo: 10000000,
    aprobadorRequerido: 'Director de Operaciones / Karen Garcia',
    ordenAprobacion: 2,
    activa: true
  },
  {
    id: 'wf-03',
    nombre: 'Facturas Mayores a $10.000.000 COP (Laboratorios)',
    montoMinimo: 10000001,
    montoMaximo: 999999999,
    aprobadorRequerido: 'Gerencia General / Karen Garcia',
    ordenAprobacion: 3,
    activa: true
  }
];

export const INITIAL_POLITICAS: PoliticaEmpresa[] = [
  {
    id: 'pol-01',
    codigo: 'POL-DIAN-01',
    titulo: 'Validación Previa Electrónica DIAN (CUFE y Eventos Radian)',
    descripcion: 'Toda factura recibida debe contar con acuse de recibo y recepción de bienes/servicios en DIAN para ser autorizada a pago.',
    aplicaA: 'Todas las facturas electrónicas',
    estado: 'ACTIVA'
  },
  {
    id: 'pol-02',
    codigo: 'POL-RET-02',
    titulo: 'Aplicación Automática de Retefuente y ReteICA Municipal',
    descripcion: 'Disfarma SAS como agente retenedor aplica el 2.5% o 3.5% de Retefuente y tarifas según municipio de la sede receptora.',
    aplicaA: 'Proveedores régimen común',
    estado: 'ACTIVA'
  },
  {
    id: 'pol-03',
    codigo: 'POL-PLA-03',
    titulo: 'Plazos de Revisión y Visto Bueno (Máximo 72 Horas)',
    descripcion: 'Los aprobadores de área deben revisar y dar concepto técnico dentro de los 3 días hábiles posteriores a la radicación.',
    aplicaA: 'Flujo de revisión',
    estado: 'ACTIVA'
  }
];

export const INITIAL_MODULOS_GEXTO: ModuloPersonalizado[] = [
  {
    id: 'mod-radian-eventos',
    codigo: 'MOD-RADIAN-01',
    titulo: 'Eventos RADIAN & Título Valor DIAN',
    descripcion: 'Gestión y transmisión automática de eventos DIAN: Acuse de Recibo, Recibo del Bien/Servicio y Aceptación Expresa de Facturas Electrónicas.',
    icono: 'CheckCheck',
    autor: 'Gexto / Hexa Labs',
    fechaCreacion: '2026-09-28',
    estado: 'ACTIVO',
    campos: [
      { nombre: 'numeroFactura', etiqueta: 'Número de Factura', tipo: 'texto' },
      { nombre: 'cufe', etiqueta: 'Código CUFE', tipo: 'texto' },
      { nombre: 'tipoEvento', etiqueta: 'Tipo de Evento', tipo: 'select', opciones: ['030 - Acuse de Recibo', '032 - Recibo del Bien o Prestación del Servicio', '033 - Aceptación Expresa', '034 - Reclamo de Factura'] },
      { nombre: 'fechaTransmision', etiqueta: 'Fecha Transmisión DIAN', tipo: 'fecha' },
      { nombre: 'estadoDian', etiqueta: 'Estado DIAN', tipo: 'select', opciones: ['Aceptado por DIAN', 'Pendiente', 'Rechazado con Observaciones'] }
    ],
    registros: [
      {
        id: 'ev-01',
        numeroFactura: 'SETP990001429',
        cufe: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef',
        tipoEvento: '030 - Acuse de Recibo',
        fechaTransmision: '2026-09-16',
        estadoDian: 'Aceptado por DIAN'
      }
    ]
  },
  {
    id: 'mod-conciliacion-bancaria',
    codigo: 'MOD-CONC-02',
    titulo: 'Conciliación Bancaria Automática con Extractos',
    descripcion: 'Cruce automático de pagos debitados en cuentas Bancolombia y Banco de Bogotá de Disfarma SAS frente a facturas aprobadas.',
    icono: 'Landmark',
    autor: 'Gexto / Hexa Labs',
    fechaCreacion: '2026-09-29',
    estado: 'ACTIVO',
    campos: [
      { nombre: 'cuentaBancaria', etiqueta: 'Cuenta de Origen', tipo: 'texto' },
      { nombre: 'referenciaDebito', etiqueta: 'Referencia de Débito', tipo: 'texto' },
      { nombre: 'valorDebitado', etiqueta: 'Valor Debitado', tipo: 'numero' },
      { nombre: 'facturaAsociada', etiqueta: 'Factura Relacionada', tipo: 'texto' },
      { nombre: 'fechaConciliacion', etiqueta: 'Fecha de Conciliación', tipo: 'fecha' }
    ],
    registros: []
  }
];
