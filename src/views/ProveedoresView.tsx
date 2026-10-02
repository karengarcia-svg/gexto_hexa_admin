import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  Search,
  Download,
  Plus,
  Eye,
  Pencil,
  Ban,
  Check,
  CheckCircle2,
  X,
  CreditCard,
  FileText,
  ArrowLeft,
  Upload,
  Package,
  Building2,
  Calendar,
  Folder,
  Clock,
  Inbox,
  Percent,
  Landmark
} from 'lucide-react';

interface ProveedorItem {
  id: string;
  razonSocial: string;
  nit: string;
  ciudad?: string;
  email?: string;
  telefono?: string;
  contacto?: string;
  direccion?: string;
  notas?: string;
  facturasCount: number;
  totalFacturado: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export const ProveedoresView: React.FC = () => {
  // Filter tab: 'todos' | 'activos' | 'inactivos'
  const [filterTab, setFilterTab] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Suppliers state with exact real data from screenshot
  const [suppliers, setSuppliers] = useState<ProveedorItem[]>([
    {
      id: 'prov-1',
      razonSocial: '',
      nit: '900481856',
      ciudad: 'Bogotá',
      facturasCount: 6,
      totalFacturado: '$488.391',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-2',
      razonSocial: 'CAJA COLOMBIANA DE SUBSIDIO FAMILIAR',
      nit: '860007336',
      ciudad: 'Bogotá',
      email: 'facturacion@colsubsidio.com',
      facturasCount: 3,
      totalFacturado: '$10.915',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-3',
      razonSocial: 'CAJASAN',
      nit: '890200106',
      ciudad: 'Bucaramanga',
      email: 'tesoreria@cajasan.com',
      facturasCount: 7,
      totalFacturado: '$102.132',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-4',
      razonSocial: 'CINE COLOMBIA S.A.S.',
      nit: '890900076',
      ciudad: 'Medellín',
      facturasCount: 6,
      totalFacturado: '$175.600',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-5',
      razonSocial: 'COLOMBIA TELECOMUNICACIONES S.A. E....',
      nit: '830122566',
      ciudad: 'Bogotá',
      facturasCount: 6,
      totalFacturado: '$197.591',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-6',
      razonSocial: 'COLOMBIANA DE COMERCIO S.A.',
      nit: '890900943',
      ciudad: 'Medellín',
      facturasCount: 7,
      totalFacturado: '$7.951.583',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-7',
      razonSocial: 'COMUNICACION CELULAR S A COMCEL S A',
      nit: '800153993',
      ciudad: 'Bogotá',
      facturasCount: 14,
      totalFacturado: '$539.003',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-8',
      razonSocial: 'DISTRIBUIDORA EL HUECO SAS',
      nit: '900479120',
      ciudad: 'Medellín',
      facturasCount: 1,
      totalFacturado: '$96.425',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-9',
      razonSocial: 'GESTIMEDIC IPS SAS',
      nit: '900205284',
      ciudad: 'Cali',
      facturasCount: 1,
      totalFacturado: '$249.460',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-10',
      razonSocial: 'GOMEZ MANCILLA LUZ MARINA',
      nit: '63271907',
      ciudad: 'Bucaramanga',
      facturasCount: 1,
      totalFacturado: '$160.000',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-11',
      razonSocial: 'SEGUROS COMERCIALES BOLIVAR SA',
      nit: '860002180',
      ciudad: 'Bogotá',
      facturasCount: 1,
      totalFacturado: '$278.200',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-12',
      razonSocial: 'DISTRIBUIDORA FARMACEUTICA DEL SUR',
      nit: '901234567',
      ciudad: 'Pasto',
      facturasCount: 2,
      totalFacturado: '$350.000',
      estado: 'ACTIVO'
    },
    {
      id: 'prov-13',
      razonSocial: 'LABORATORIOS SYNTHESIS COLOMBIA',
      nit: '800456789',
      ciudad: 'Barranquilla',
      facturasCount: 4,
      totalFacturado: '$1.120.000',
      estado: 'ACTIVO'
    }
  ]);

  // Form State
  const [formRazonSocial, setFormRazonSocial] = useState('');
  const [formNit, setFormNit] = useState('');
  const [formCiudad, setFormCiudad] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formContacto, setFormContacto] = useState('');
  const [formDireccion, setFormDireccion] = useState('');
  const [formNotas, setFormNotas] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal detail
  const [selectedSupplierForDetail, setSelectedSupplierForDetail] = useState<ProveedorItem | null>(null);

  // Invoices for supplier detail view (matching screenshot 2)
  const supplierInvoices = [
    {
      numero: '#KN030470141',
      fecha: '18/09/2023',
      total: '$2.715',
      estado: 'RECIBIDA'
    },
    {
      numero: '#KN030469031',
      fecha: '13/09/2023',
      total: '$4.100',
      estado: 'RECIBIDA'
    },
    {
      numero: '#KN030468955',
      fecha: '13/09/2023',
      total: '$4.100',
      estado: 'RECIBIDA'
    }
  ];

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNit.trim()) return;

    if (editingId) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                razonSocial: formRazonSocial.trim(),
                nit: formNit.trim(),
                ciudad: formCiudad.trim(),
                email: formEmail.trim(),
                telefono: formTelefono.trim(),
                contacto: formContacto.trim(),
                direccion: formDireccion.trim(),
                notas: formNotas.trim()
              }
            : s
        )
      );
      showToast(`Proveedor ${formRazonSocial || formNit} actualizado`);
      setEditingId(null);
    } else {
      const newSupplier: ProveedorItem = {
        id: `prov-${Date.now()}`,
        razonSocial: formRazonSocial.trim(),
        nit: formNit.trim(),
        ciudad: formCiudad.trim() || 'Bogotá',
        email: formEmail.trim(),
        telefono: formTelefono.trim(),
        contacto: formContacto.trim(),
        direccion: formDireccion.trim(),
        notas: formNotas.trim(),
        facturasCount: 0,
        totalFacturado: '$0',
        estado: 'ACTIVO'
      };
      setSuppliers([newSupplier, ...suppliers]);
      showToast(`Proveedor ${formRazonSocial || formNit} registrado`);
    }

    // Reset Form
    setFormRazonSocial('');
    setFormNit('');
    setFormCiudad('');
    setFormEmail('');
    setFormTelefono('');
    setFormContacto('');
    setFormDireccion('');
    setFormNotas('');
  };

  const handleStartEdit = (s: ProveedorItem) => {
    setEditingId(s.id);
    setFormRazonSocial(s.razonSocial);
    setFormNit(s.nit);
    setFormCiudad(s.ciudad || '');
    setFormEmail(s.email || '');
    setFormTelefono(s.telefono || '');
    setFormContacto(s.contacto || '');
    setFormDireccion(s.direccion || '');
    setFormNotas(s.notas || '');
  };

  const handleToggleEstado = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, estado: s.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
          : s
      )
    );
    showToast('Estado del proveedor modificado');
  };

  const handleExportCSV = () => {
    const headers = 'ID,Razon Social,NIT,Ciudad,Facturas,Total Facturado,Estado\n';
    const rows = suppliers
      .map(
        (s) =>
          `"${s.id}","${s.razonSocial}","${s.nit}","${s.ciudad || ''}","${s.facturasCount}","${s.totalFacturado}","${s.estado}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'proveedores_gexto.csv';
    link.click();
    showToast('CSV de proveedores descargado');
  };

  // Filtered suppliers
  const filteredSuppliers = suppliers.filter((s) => {
    if (filterTab === 'activos' && s.estado !== 'ACTIVO') return false;
    if (filterTab === 'inactivos' && s.estado !== 'INACTIVO') return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.razonSocial.toLowerCase().includes(q) ||
        s.nit.toLowerCase().includes(q) ||
        (s.ciudad && s.ciudad.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getInitials = (name: string, nit: string) => {
    if (!name.trim()) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const activosCount = suppliers.filter((s) => s.estado === 'ACTIVO').length;
  const inactivosCount = suppliers.filter((s) => s.estado === 'INACTIVO').length;

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
      {/* VIEW: DETALLE DEL PROVEEDOR (Screenshots 1 & 2)           */}
      {/* ======================================================== */}
      {selectedSupplierForDetail ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setSelectedSupplierForDetail(null)}
              className="hover:text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>PROVEEDORES</span>
            </button>
            <span>&gt;</span>
            <span className="text-slate-700">
              {selectedSupplierForDetail.razonSocial || 'Proveedor'}
            </span>
          </div>

          {/* Hero Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-teal-500 to-emerald-500" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
              {/* Left: Avatar + Title + NIT */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center font-mono shrink-0">
                  {getInitials(selectedSupplierForDetail.razonSocial, selectedSupplierForDetail.nit)}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                    {selectedSupplierForDetail.razonSocial || 'Proveedor sin razón social'}
                  </h2>
                  <div className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1.5">
                    <span>📇</span>
                    <span>NIT: {selectedSupplierForDetail.nit}</span>
                  </div>
                </div>
              </div>

              {/* Middle: Total Facturado */}
              <div className="text-center md:text-left border-y md:border-y-0 md:border-x border-slate-100 py-3 md:py-0 md:px-8">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  TOTAL FACTURADO
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-1">
                  $ {selectedSupplierForDetail.totalFacturado.replace('$', '')}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedSupplierForDetail.facturasCount} facturas
                </div>
              </div>

              {/* Right: Estado + Editar */}
              <div className="flex items-center md:flex-col items-end gap-3 justify-between md:justify-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {selectedSupplierForDetail.estado}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    handleStartEdit(selectedSupplierForDetail);
                    setSelectedSupplierForDetail(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Metric KPI Cards (Matching Screenshot) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Facturas */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 leading-tight">
                  {selectedSupplierForDetail.facturasCount || 3}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  FACTURAS
                </div>
              </div>
            </div>

            {/* Card 2: Impuestos */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 leading-tight">
                  $0
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  IMPUESTOS
                </div>
              </div>
            </div>

            {/* Card 3: Última Factura */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold font-mono text-slate-900 leading-tight">
                  18/09/2023
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  ÚLTIMA FACTURA
                </div>
              </div>
            </div>

            {/* Card 4: Documentos */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 leading-tight">
                  0
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  DOCUMENTOS
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Split: Left (8 cols) vs Right (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Documentos + Productos + Facturas Recientes (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Documentos del Proveedor */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Folder className="w-4 h-4 text-indigo-600" />
                    <span>Documentos del Proveedor</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Subir documento al proveedor')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Documento</span>
                  </button>
                </div>

                <div className="py-12 flex flex-col items-center justify-center text-center space-y-1.5 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <FileText className="w-8 h-8 text-slate-300" />
                  <div className="font-semibold text-xs text-slate-700">
                    No hay documentos adjuntos.
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Sube certificados bancarios, RUT, cámara de comercio u otros.
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Package className="w-4 h-4 text-indigo-600" />
                    <span>Productos</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Asociar producto')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>

                <div className="py-12 flex flex-col items-center justify-center text-center space-y-1.5 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Package className="w-8 h-8 text-slate-300" />
                  <div className="font-semibold text-xs text-slate-700">
                    Este proveedor aún no tiene productos.
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Agrega los artículos del inventario que maneja.
                  </div>
                </div>
              </div>

              {/* Facturas Recientes (Matching Screenshot 2) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Facturas Recientes</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    3 total
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-3">FACTURA</th>
                        <th className="py-3 px-3">FECHA</th>
                        <th className="py-3 px-3 text-right">TOTAL ESTADO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {supplierInvoices.map((inv, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-indigo-600 cursor-pointer hover:underline">
                            {inv.numero}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-600">
                            {inv.fecha}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <span className="font-bold font-mono text-slate-900 mr-2">
                              {inv.total}
                            </span>
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                              {inv.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Cuentas Bancarias + Info Contacto + Facturas por Estado (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Cuentas Bancarias */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Landmark className="w-4 h-4 text-indigo-600" />
                    <span>Cuentas Bancarias</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Agregar cuenta bancaria')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>

                <div className="py-8 flex flex-col items-center justify-center text-center space-y-1 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Landmark className="w-6 h-6 text-slate-300" />
                  <div className="text-xs text-slate-500 font-medium">
                    Sin cuentas registradas
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Información de Contacto</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    REMITENTE FACTURA
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-800 break-all">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedSupplierForDetail.email || 'recepcion.facturaelectronica@colsubsidio.com'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 italic">
                    Email extraído de la factura electrónica
                  </div>
                </div>
              </div>

              {/* Facturas por Estado */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Facturas por Estado</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    RECIBIDA
                  </span>
                  <span className="font-bold font-mono text-slate-900 text-xs">
                    {selectedSupplierForDetail.facturasCount || 3}
                  </span>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-500 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase">CREADO</span>
                  <span className="font-medium text-slate-700">30/09/2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase">PRIMERA FACTURA</span>
                  <span className="font-medium text-slate-700">13/09/2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* VIEW: LISTADO PRINCIPAL DE PROVEEDORES                  */
        /* ======================================================== */
        <>
          {/* Header + Filter Pills (Matching Screenshot) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Proveedores
              </h1>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
                GESTIONA LOS PROVEEDORES DE TU EMPRESA
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterTab('todos')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterTab === 'todos'
                    ? 'bg-[#4338ca] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos <span className="font-mono ml-1">{suppliers.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('activos')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterTab === 'activos'
                    ? 'bg-[#4338ca] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Activos <span className="font-mono ml-1">{activosCount}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('inactivos')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterTab === 'inactivos'
                    ? 'bg-[#4338ca] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inactivos <span className="font-mono ml-1">{inactivosCount}</span>
              </button>
            </div>
          </div>

      {/* Main 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Form "Nuevo Proveedor" (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900">
                {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormRazonSocial('');
                  setFormNit('');
                  setFormCiudad('');
                  setFormEmail('');
                  setFormTelefono('');
                  setFormContacto('');
                  setFormDireccion('');
                  setFormNotas('');
                }}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 underline"
              >
                Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleCreateSupplier} className="space-y-3.5 text-xs">
            {/* RAZÓN SOCIAL */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                RAZÓN SOCIAL *
              </label>
              <input
                type="text"
                value={formRazonSocial}
                onChange={(e) => setFormRazonSocial(e.target.value)}
                placeholder="Nombre o razón social"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium text-slate-900"
              />
            </div>

            {/* NIT & CIUDAD (2 cols) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NIT *
                </label>
                <input
                  type="text"
                  required
                  value={formNit}
                  onChange={(e) => setFormNit(e.target.value)}
                  placeholder="900.123.456-7"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CIUDAD
                </label>
                <input
                  type="text"
                  value={formCiudad}
                  onChange={(e) => setFormCiudad(e.target.value)}
                  placeholder="Bogotá"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* EMAIL & TELÉFONO (2 cols) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="contacto@proveedor.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TELÉFONO
                </label>
                <input
                  type="text"
                  value={formTelefono}
                  onChange={(e) => setFormTelefono(e.target.value)}
                  placeholder="+57 300 123 4567"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* PERSONA DE CONTACTO */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                PERSONA DE CONTACTO
              </label>
              <input
                type="text"
                value={formContacto}
                onChange={(e) => setFormContacto(e.target.value)}
                placeholder="Nombre del contacto"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* DIRECCIÓN */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                DIRECCIÓN
              </label>
              <input
                type="text"
                value={formDireccion}
                onChange={(e) => setFormDireccion(e.target.value)}
                placeholder="Calle 123 #45-67"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* NOTAS */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                NOTAS
              </label>
              <textarea
                rows={2}
                value={formNotas}
                onChange={(e) => setFormNotas(e.target.value)}
                placeholder="Observaciones internas..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{editingId ? 'GUARDAR CAMBIOS' : 'CREAR PROVEEDOR'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Table of Suppliers (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search + Export Bar (Matching Screenshot) */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por nombre, NIT o ciudad..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              />
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Exportar CSV</span>
            </button>
          </div>

          {/* Suppliers Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">PROVEEDOR</th>
                    <th className="py-3.5 px-4 text-right">FACTURAS</th>
                    <th className="py-3.5 px-4 text-center">ESTADO</th>
                    <th className="py-3.5 px-5 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuppliers.map((s) => {
                    const initials = getInitials(s.razonSocial, s.nit);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* PROVEEDOR */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3.5">
                            {/* Avatar Square */}
                            <div className="w-9 h-9 rounded-xl bg-indigo-50/90 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 font-mono">
                              {initials}
                            </div>
                            <div>
                              {s.razonSocial ? (
                                <div className="font-bold text-slate-900 leading-tight">
                                  {s.razonSocial}
                                </div>
                              ) : (
                                <div className="font-bold text-slate-400 italic">
                                  Sin razón social
                                </div>
                              )}
                              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                                <span>📇</span>
                                <span>{s.nit}</span>
                                {s.ciudad && (
                                  <>
                                    <span>·</span>
                                    <span>{s.ciudad}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* FACTURAS */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-bold font-mono text-slate-900 text-xs">
                            {s.facturasCount}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {s.totalFacturado}
                          </div>
                        </td>

                        {/* ESTADO */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                              s.estado === 'ACTIVO'
                                ? 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {s.estado}
                          </span>
                        </td>

                        {/* ACCIONES (Eye, Pencil, Ban) */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedSupplierForDetail(s)}
                              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="Ver detalle"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleStartEdit(s)}
                              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="Editar proveedor"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Inactivate Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleEstado(s.id)}
                              className="w-7 h-7 rounded-lg border border-amber-200 text-amber-500 hover:bg-amber-50 flex items-center justify-center transition-colors cursor-pointer"
                              title={s.estado === 'ACTIVO' ? 'Inactivar proveedor' : 'Activar proveedor'}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
