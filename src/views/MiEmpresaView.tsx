import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  GitFork,
  Paperclip,
  ClipboardList,
  Store,
  Layers,
  Phone,
  Globe,
  MapPin,
  Check,
  CheckCircle2,
  Mail,
  Shield,
  Key,
  AtSign,
  Send,
  Power,
  Info,
  Filter,
  Link,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const MiEmpresaView: React.FC = () => {
  const { setActiveMenu } = useApp();

  // Active Tab: 'info-basica' | 'branding' | 'smtp' | 'integraciones'
  const [activeTab, setActiveTab] = useState<'info-basica' | 'branding' | 'smtp' | 'integraciones'>('info-basica');

  // Tab 1: Información Básica
  const [nombreEmpresa, setNombreEmpresa] = useState('Disfarma SAS');
  const [nit, setNit] = useState('900580962');
  const [telefono, setTelefono] = useState('3167015964');
  const [sitioWeb, setSitioWeb] = useState('https://disfarma.com.co/');
  const [direccion, setDireccion] = useState('Anillo Vial');

  // Tab 2: Branding y Marca
  const [mostrarNombre, setMostrarNombre] = useState(true);
  const [colorPrincipal, setColorPrincipal] = useState('#188C2F');
  const [colorSecundario, setColorSecundario] = useState('#7C3AED');
  const [piePagina, setPiePagina] = useState(
    '© - 2024 Concepto, Diseño y Desarrollo por AMD Agencia Digital Bogotá, Colombia'
  );

  // Tab 3: Configuración Correo (SMTP)
  const [servidorHost, setServidorHost] = useState('smtp.gmail.com');
  const [puerto, setPuerto] = useState('587');
  const [seguridad, setSeguridad] = useState('TLS (Recomendado)');
  const [usuarioEmail, setUsuarioEmail] = useState('super@admin.com');
  const [password, setPassword] = useState('12344321');
  const [responderA, setResponderA] = useState('noreply@empresa.com');
  const [organizacion, setOrganizacion] = useState('Mi Empresa S.A.');
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpSuccess, setSmtpSuccess] = useState(false);

  // Tab 4: Integraciones
  const [googleConnected, setGoogleConnected] = useState(true);
  const [filtrarPorNit, setFiltrarPorNit] = useState(false);
  const [googleChatWebhook, setGoogleChatWebhook] = useState(
    'https://chat.googleapis.com/v1/spaces/AAAA12345/messages?key=AIzaSy...'
  );

  // Toast saved
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleTestSmtp = () => {
    setSmtpTesting(true);
    setTimeout(() => {
      setSmtpTesting(false);
      setSmtpSuccess(true);
      setTimeout(() => setSmtpSuccess(false), 4000);
    }, 1200);
  };

  // Disfarma Logo Graphic
  const DisfarmaLogoIcon = () => (
    <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-2 shrink-0">
      <svg viewBox="0 0 100 60" className="w-full h-full">
        {/* Green swoosh */}
        <path
          d="M 10 25 C 25 10, 75 10, 90 25 C 75 20, 35 22, 10 25 Z"
          fill="#188C2F"
        />
        {/* Blue/Cyan swoosh */}
        <path
          d="M 20 32 C 40 45, 70 45, 85 30 C 70 40, 35 38, 20 32 Z"
          fill="#0284C7"
        />
      </svg>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-14 font-sans text-slate-800">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-12 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          <span>Configuración guardada exitosamente</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Mi Empresa
          </h1>
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
            ADMINISTRA LA INFORMACIÓN Y CONFIGURACIÓN DE TU ORGANIZACIÓN
          </p>
        </div>

        {/* Small Disfarma Logo in Header Top Right */}
        <div className="w-12 h-9 rounded-lg bg-white border border-slate-200/90 shadow-xs flex items-center justify-center p-1.5 self-start sm:self-auto">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <path d="M 10 25 C 25 10, 75 10, 90 25 C 75 20, 35 22, 10 25 Z" fill="#188C2F" />
            <path d="M 20 32 C 40 45, 70 45, 85 30 C 70 40, 35 38, 20 32 Z" fill="#0284C7" />
          </svg>
        </div>
      </div>

      {/* Quick Navigation Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setActiveMenu('workflow')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium transition-colors shrink-0 shadow-2xs"
        >
          <GitFork className="w-3.5 h-3.5 text-slate-500" />
          <span>Flujo de Trabajo</span>
        </button>

        <button
          onClick={() => setActiveMenu('tipos-adjuntos')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium transition-colors shrink-0 shadow-2xs"
        >
          <Paperclip className="w-3.5 h-3.5 text-slate-500" />
          <span>Tipos de Adjuntos</span>
        </button>

        <button
          onClick={() => setActiveMenu('clases-factura')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium transition-colors shrink-0 shadow-2xs"
        >
          <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
          <span>Clases de Factura</span>
        </button>

        <button
          onClick={() => setActiveMenu('centros-costos')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium transition-colors shrink-0 shadow-2xs"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Centros de Costos</span>
        </button>

        <button
          onClick={() => setActiveMenu('sedes')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium transition-colors shrink-0 shadow-2xs"
        >
          <Store className="w-3.5 h-3.5 text-slate-500" />
          <span>Sedes</span>
        </button>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center border-b border-slate-200 px-6 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info-basica')}
            className={`flex items-center gap-2 py-4 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'info-basica'
                ? 'border-[#4338ca] text-[#4338ca]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Información Básica</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-2 py-4 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'branding'
                ? 'border-[#4338ca] text-[#4338ca]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Branding y Marca</span>
          </button>

          <button
            onClick={() => setActiveTab('smtp')}
            className={`flex items-center gap-2 py-4 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'smtp'
                ? 'border-[#4338ca] text-[#4338ca]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Configuración Correo (SMTP)</span>
          </button>

          <button
            onClick={() => setActiveTab('integraciones')}
            className={`flex items-center gap-2 py-4 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'integraciones'
                ? 'border-[#4338ca] text-[#4338ca]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Integraciones</span>
          </button>
        </div>

        {/* Tab 1: Información Básica */}
        {activeTab === 'info-basica' && (
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Detalles de la Organización
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Información corporativa general visible en documentos.
                </p>
              </div>

              {/* Status pill */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Activa</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* NOMBRE DE LA EMPRESA */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  NOMBRE DE LA EMPRESA *
                </label>
                <input
                  type="text"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium"
                />
              </div>

              {/* NIT / ID FISCAL */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  NIT / ID FISCAL
                </label>
                <input
                  type="text"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-mono font-medium"
                />
              </div>

              {/* TELÉFONO */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  TELÉFONO
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              {/* SITIO WEB */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  SITIO WEB
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={sitioWeb}
                    onChange={(e) => setSitioWeb(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-mono text-indigo-700"
                  />
                </div>
              </div>

              {/* DIRECCIÓN */}
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  DIRECCIÓN
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Branding y Marca */}
        {activeTab === 'branding' && (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Identidad Visual
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Personaliza cómo se ve tu empresa en correos y accesos públicos.
              </p>
            </div>

            {/* LOGOTIPO */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                LOGOTIPO
              </label>

              <div className="flex items-center gap-4">
                <DisfarmaLogoIcon />

                <div className="flex-1 bg-slate-50/80 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="px-3.5 py-1.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors">
                      Seleccionar archivo
                    </button>
                    <span className="text-xs text-slate-500">Ningún archivo seleccionado</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                FORMATOS: PNG, JPG O SVG. MÁXIMO 2MB.
              </div>

              {/* Toggle switch: Mostrar nombre junto al logo */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setMostrarNombre(!mostrarNombre)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    mostrarNombre ? 'bg-[#4338ca]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      mostrarNombre ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Mostrar nombre junto al logo
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Renderiza el título de empresa en encabezados
                  </div>
                </div>
              </div>
            </div>

            {/* Colores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* COLOR PRINCIPAL */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  COLOR PRINCIPAL
                </label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                  <div
                    style={{ backgroundColor: colorPrincipal }}
                    className="w-8 h-8 rounded-lg shadow-2xs border border-black/10 shrink-0"
                  />
                  <input
                    type="text"
                    value={colorPrincipal}
                    onChange={(e) => setColorPrincipal(e.target.value)}
                    className="w-full text-xs font-mono font-bold text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">
                  BOTONES Y ÁREAS PROMINENTES
                </div>
              </div>

              {/* COLOR SECUNDARIO */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  COLOR SECUNDARIO
                </label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                  <div
                    style={{ backgroundColor: colorSecundario }}
                    className="w-8 h-8 rounded-lg shadow-2xs border border-black/10 shrink-0"
                  />
                  <input
                    type="text"
                    value={colorSecundario}
                    onChange={(e) => setColorSecundario(e.target.value)}
                    className="w-full text-xs font-mono font-bold text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">
                  ACENTOS Y GRADIENTES
                </div>
              </div>
            </div>

            {/* PIE DE PÁGINA DE EMAILS */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  PIE DE PÁGINA DE EMAILS
                </label>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  SOPORTA HTML
                </span>
              </div>
              <textarea
                rows={3}
                value={piePagina}
                onChange={(e) => setPiePagina(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-mono text-slate-700"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Configuración Correo (SMTP) - Dark Navy Card */}
        {activeTab === 'smtp' && (
          <div className="p-8 space-y-6">
            <div className="bg-[#0b1026] text-white rounded-2xl p-7 shadow-xl space-y-6 border border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Conexión Saliente
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Integra tú proveedor de correo SMTP corporativo.
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-500/40">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BÓVEDA ENCRIPTADA</span>
                </span>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* SERVIDOR HOST */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    SERVIDOR HOST
                  </label>
                  <input
                    type="text"
                    value={servidorHost}
                    onChange={(e) => setServidorHost(e.target.value)}
                    className="w-full bg-[#141b3d] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* PUERTO */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    PUERTO
                  </label>
                  <input
                    type="text"
                    value={puerto}
                    onChange={(e) => setPuerto(e.target.value)}
                    className="w-full bg-[#141b3d] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* SEGURIDAD */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    SEGURIDAD
                  </label>
                  <select
                    value={seguridad}
                    onChange={(e) => setSeguridad(e.target.value)}
                    className="w-full bg-[#141b3d] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="TLS (Recomendado)">TLS (Recomendado)</option>
                    <option value="SSL">SSL</option>
                    <option value="Ninguna">Ninguna</option>
                  </select>
                </div>

                {/* USUARIO / EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    USUARIO / EMAIL
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={usuarioEmail}
                      onChange={(e) => setUsuarioEmail(e.target.value)}
                      className="w-full bg-[#141b3d] border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* CONTRASEÑA APP */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    CONTRASEÑA APP
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#141b3d] border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* RESPONDER A (REMITENTE OFICIAL) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    RESPONDER A (REMITENTE OFICIAL)
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={responderA}
                      onChange={(e) => setResponderA(e.target.value)}
                      className="w-full bg-[#141b3d] border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* ORGANIZACIÓN REMITENTE EN INBOX */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    ORGANIZACIÓN REMITENTE EN INBOX
                  </label>
                  <input
                    type="text"
                    value={organizacion}
                    onChange={(e) => setOrganizacion(e.target.value)}
                    className="w-full bg-[#141b3d] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Bottom Test Connection Strip */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    ⚗️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Test de Conexión</div>
                    <div className="text-[11px] text-slate-400">
                      Se requiere guardar los cambios antes de probar.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestSmtp}
                  disabled={smtpTesting}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{smtpTesting ? 'Probando...' : 'Despachar Correo de Prueba'}</span>
                </button>
              </div>

              {smtpSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Correo de prueba enviado con éxito a {usuarioEmail}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Integraciones */}
        {activeTab === 'integraciones' && (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Integraciones y Automatización
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Conecta servicios externos para automatizar flujos de trabajo.
              </p>
            </div>

            <div className="space-y-5">
              {/* Google Workspace / Gmail Card */}
              <div className="p-6 rounded-2xl border-2 border-emerald-500/40 bg-white space-y-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Google Workspace colored icon */}
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg border border-emerald-200 shrink-0">
                      M
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">Google Workspace / Gmail</h3>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Recolectando facturas XML automáticamente
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGoogleConnected(!googleConnected)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-red-300 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{googleConnected ? 'Desconectar' : 'Conectar'}</span>
                  </button>
                </div>

                {/* 3 Columns Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      CUENTA VINCULADA
                    </span>
                    <span className="font-medium text-slate-800">
                      karen.garcia@hexasolutions.co
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      CONECTADO DESDE
                    </span>
                    <span className="font-mono text-slate-700">
                      30 Sep 2026, 11:10 AM
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      ESTADO DE CONEXIÓN
                    </span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verificado 30 Sep, 03:40 PM
                    </span>
                  </div>
                </div>

                {/* Sincronización Automática Activa callout */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-950 flex items-start gap-3">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-blue-900 mb-0.5">
                      Sincronización Automática Activa
                    </div>
                    <p className="text-blue-800 text-[11px] leading-relaxed">
                      El sistema revisa tu buzón cada 5 minutos buscando nuevas facturas. Los emails con archivos XML o PDF se procesan automáticamente y aparecen en tu panel de facturas.
                    </p>
                  </div>
                </div>

                {/* Filtrar facturas por NIT toggle */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                      <Filter className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Filtrar facturas por NIT
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Solo importar facturas donde el NIT del receptor coincida con el de tu empresa (<strong>{nit}</strong>)
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFiltrarPorNit(!filtrarPorNit)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                      filtrarPorNit ? 'bg-[#4338ca]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        filtrarPorNit ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Google Chat Card */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg border border-slate-200 shrink-0">
                    G
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Google Chat</h3>
                    <p className="text-xs text-slate-500">
                      Recibe notificaciones del workflow (asignaciones, transiciones) en un espacio de Google Chat.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    WEBHOOK URL DEL ESPACIO
                  </label>
                  <div className="relative">
                    <Link className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={googleChatWebhook}
                      onChange={(e) => setGoogleChatWebhook(e.target.value)}
                      placeholder="https://chat.googleapis.com/v1/spaces/..."
                      className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                    <strong className="text-slate-600">ℹ️ ¿Cómo obtener la URL?</strong> En Google Chat, abre el espacio → haz clic en el nombre del espacio → <em>Apps e integraciones</em> → <em>Administrar webhooks</em> → Crea uno y copia la URL.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Action Footer */}
        <div className="p-6 bg-slate-50/80 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setActiveMenu('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Descartar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar y Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
};
