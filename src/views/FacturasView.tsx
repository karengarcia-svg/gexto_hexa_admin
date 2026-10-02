import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Factura, InvoiceStatus } from '../types';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Calendar,
  Building,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

export const FacturasView: React.FC = () => {
  const { facturas, cambiarEstadoFactura, selectedFactura, setSelectedFactura } = useApp();

  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState('');

  const statusList = [
    { id: 'TODAS', label: 'Todas' },
    { id: 'RECIBIDA', label: 'Recibida', badge: '2' },
    { id: 'REVISADA', label: 'Revisada', badge: '0' },
    { id: 'APROBADA', label: 'Aprobada', badge: '0' },
    { id: 'DEBITADA', label: 'Debitada', badge: '0' },
    { id: 'CONCILIADA', label: 'Conciliada', badge: '0' },
    { id: 'RECHAZADA', label: 'Rechazada', badge: '0' }
  ];

  const filteredFacturas = facturas.filter((f) => {
    const matchStatus = activeStatusFilter === 'TODAS' || f.estado === activeStatusFilter;
    const matchSearch =
      f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.proveedorNit.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (estado: InvoiceStatus) => {
    switch (estado) {
      case 'RECIBIDA':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">Recibida</span>;
      case 'REVISADA':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">Revisada</span>;
      case 'APROBADA':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Aprobada</span>;
      case 'DEBITADA':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">Debitada</span>;
      case 'CONCILIADA':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-300">Conciliada</span>;
      case 'RECHAZADA':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-800 border border-red-200">Rechazada</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestión de Facturas Electrónicas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Disfarma SAS · Recepción de Facturas con CUFE, validación DIAN y ciclo de workflow
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statusList.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                activeStatusFilter === st.id
                  ? 'bg-[#3730a3] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{st.label}</span>
              {st.badge !== undefined && (
                <span className={`text-[10px] px-1.5 rounded-full ${activeStatusFilter === st.id ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {st.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número de factura, proveedor o NIT..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Factura / Documento</th>
                <th className="py-3 px-4 font-semibold">Proveedor</th>
                <th className="py-3 px-4 font-semibold">Fecha Emisión</th>
                <th className="py-3 px-4 font-semibold">Vencimiento</th>
                <th className="py-3 px-4 font-semibold text-right">Subtotal</th>
                <th className="py-3 px-4 font-semibold text-right">IVA</th>
                <th className="py-3 px-4 font-semibold text-right">Total</th>
                <th className="py-3 px-4 font-semibold text-center">Estado</th>
                <th className="py-3 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFacturas.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 font-mono flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{fac.numero}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]" title={fac.cufe}>
                      CUFE: {fac.cufe.substring(0, 16)}...
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{fac.proveedorNombre}</div>
                    <div className="text-[10px] text-slate-400 font-mono">NIT: {fac.proveedorNit}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {fac.fechaEmision}
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {fac.fechaVencimiento}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-slate-700">
                    ${fac.subtotal.toLocaleString('es-CO')}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-slate-500">
                    ${fac.iva.toLocaleString('es-CO')}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    ${fac.total.toLocaleString('es-CO')}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(fac.estado)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedFactura(fac)}
                        className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detalle</span>
                      </button>

                      {fac.estado === 'RECIBIDA' && (
                        <button
                          onClick={() => cambiarEstadoFactura(fac.id, 'APROBADA')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                          title="Aprobar para pago"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Aprobar</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedFactura && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-5 bg-[#0b0f24] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-base">Factura Electrónica: {selectedFactura.numero}</h3>
                  <div className="text-xs text-slate-400">Emisor: {selectedFactura.proveedorNombre}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedFactura(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 text-xs text-slate-700">
              {/* DIAN CUFE Verification Box */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span>Documento Electrónico Validado por DIAN</span>
                </div>
                <div className="text-[10px] font-mono text-indigo-800 break-all">
                  CUFE: {selectedFactura.cufe}
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Proveedor:</span>
                  <strong className="text-slate-900 text-sm">{selectedFactura.proveedorNombre}</strong>
                  <div className="text-slate-500 font-mono">NIT: {selectedFactura.proveedorNit}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Cliente Receptora:</span>
                  <strong className="text-slate-900 text-sm">Disfarma SAS</strong>
                  <div className="text-slate-500 font-mono">NIT: 900.542.118-4</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Fecha de Emisión:</span>
                  <span className="font-mono text-slate-800">{selectedFactura.fechaEmision}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Fecha de Vencimiento:</span>
                  <span className="font-mono text-slate-800">{selectedFactura.fechaVencimiento}</span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-2">Desglose de Ítems / Conceptos:</span>
                <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Descripción</th>
                      <th className="py-2 px-3 text-center">Cant.</th>
                      <th className="py-2 px-3 text-right">Unitario</th>
                      <th className="py-2 px-3 text-right">IVA</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedFactura.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-medium text-slate-900">{it.descripcion}</td>
                        <td className="py-2 px-3 text-center font-mono">{it.cantidad}</td>
                        <td className="py-2 px-3 text-right font-mono">${it.valorUnitario.toLocaleString('es-CO')}</td>
                        <td className="py-2 px-3 text-right font-mono">{it.ivaPorcentaje}%</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">${it.subtotal.toLocaleString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="font-mono text-slate-800">${selectedFactura.subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">IVA (19% / 5%):</span>
                    <span className="font-mono text-slate-800">${selectedFactura.iva.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-sm">
                    <span>Total a Pagar:</span>
                    <span className="font-mono text-indigo-700">${selectedFactura.total.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>

              {/* Workflow Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-slate-500">
                  Estado actual: {getStatusBadge(selectedFactura.estado)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      cambiarEstadoFactura(selectedFactura.id, 'RECHAZADA');
                      setSelectedFactura(null);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 font-medium"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => {
                      cambiarEstadoFactura(selectedFactura.id, 'APROBADA');
                      setSelectedFactura(null);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                  >
                    Aprobar Factura
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
