import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Building2,
  Users,
  GitFork,
  Scale,
  CreditCard,
  Building,
  Receipt,
  FileSpreadsheet,
  Boxes,
  Paperclip,
  ClipboardList,
  Percent,
  Store,
  GitMerge,
  Network,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Palette,
  LogOut,
  Settings,
  Sparkles,
  Layers
} from 'lucide-react';

export const GextoSidebar: React.FC = () => {
  const {
    activeMenu,
    setActiveMenu,
    currentUser,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    menuSearchTerm,
    setMenuSearchTerm
  } = useApp();

  const principalItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'mi-empresa', label: 'Mi Empresa', icon: Building2 },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'workflow', label: 'Workflow', icon: GitFork },
    { id: 'politicas', label: 'Políticas', icon: Scale }
  ];

  const finanzasItems = [
    { id: 'gestion-pagos', label: 'Gestión de pagos', icon: CreditCard },
    { id: 'gestion-juridica', label: 'Gestión Jurídica', icon: Scale },
    { id: 'proveedores', label: 'Proveedores', icon: Building },
    { id: 'impuestos', label: 'Impuestos y Retenciones', icon: Receipt },
    { id: 'notas-cd', label: 'Notas Crédito/Débito', icon: FileSpreadsheet },
    { id: 'inventario', label: 'Inventario', icon: Boxes }
  ];

  const configuracionItems = [
    { id: 'tipos-adjuntos', label: 'Tipos de Adjuntos', icon: Paperclip },
    { id: 'clases-factura', label: 'Clases de Factura', icon: ClipboardList },
    { id: 'conceptos-impuestos', label: 'Conceptos de Impuestos', icon: Percent },
    { id: 'centros-costos', label: 'Centros de Costos', icon: Building2 },
    { id: 'sedes', label: 'Sedes', icon: Store },
    { id: 'areas', label: 'Áreas', icon: GitMerge },
    { id: 'departamentos', label: 'Departamentos', icon: Network }
  ];

  const modulosItems = [
    { id: 'nuevos-modulos', label: 'Nuevos Módulos', icon: Sparkles, badge: 'Extensible' }
  ];

  const filterItem = (item: { label: string }) => {
    if (!menuSearchTerm) return true;
    return item.label.toLowerCase().includes(menuSearchTerm.toLowerCase());
  };

  return (
    <aside
      className={`${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      } bg-[#0b0f24] text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800/80 transition-all duration-200 select-none relative z-30 font-sans`}
    >
      {/* Brand Header */}
      <div className="p-4 pb-3 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* G Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              G
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <div className="font-bold text-lg text-white tracking-tight leading-tight">
                  Gexto
                </div>
                <div className="text-[9px] uppercase font-semibold tracking-wider text-slate-400 truncate">
                  GESTIÓN INTELIGENTE DE FACT...
                </div>
              </div>
            )}
          </div>

          {/* Collapse Button tab */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-6 h-6 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs"
            title={isSidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Company Badge / Selector */}
        {!isSidebarCollapsed && (
          <div className="mt-3">
            <div className="bg-white text-slate-900 rounded-md px-3 py-1.5 flex items-center gap-2 shadow-xs cursor-pointer hover:bg-slate-100 transition-colors">
              <Building2 className="w-4 h-4 text-slate-700 shrink-0" />
              <span className="text-xs font-bold tracking-tight truncate">
                {currentUser.empresa}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Menu Search Bar */}
      {!isSidebarCollapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={menuSearchTerm}
              onChange={(e) => setMenuSearchTerm(e.target.value)}
              placeholder="Buscar en el menú..."
              className="w-full bg-[#13193a] text-slate-200 placeholder-slate-500 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-700/60 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 space-y-4 py-2 scrollbar-none text-xs">
        {/* SECTION: PRINCIPAL */}
        <div>
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
              <span>PRINCIPAL</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          )}
          <div className="space-y-1">
            {principalItems.filter(filterItem).map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-left ${
                    isActive
                      ? 'bg-[#3730a3] text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION: FINANZAS */}
        <div>
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
              <span>FINANZAS</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          )}
          <div className="space-y-1">
            {finanzasItems.filter(filterItem).map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-left ${
                    isActive
                      ? 'bg-[#3730a3] text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION: CONFIGURACIÓN */}
        <div>
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
              <span>CONFIGURACIÓN</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          )}
          <div className="space-y-1">
            {configuracionItems.filter(filterItem).map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-left ${
                    isActive
                      ? 'bg-[#3730a3] text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION: MODULOS GEXTO */}
        <div>
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-400/90 px-3 mb-1.5">
              <span>MÓDULOS A MEDIDA</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
          )}
          <div className="space-y-1">
            {modulosItems.filter(filterItem).map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all font-medium text-left ${
                    isActive
                      ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-semibold'
                      : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-900/20'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-amber-400" />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#090d1f] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Purple Avatar with 'K' */}
            <div className="w-8 h-8 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-purple-400/30">
              {currentUser.avatarLetra}
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white leading-tight truncate">
                  {currentUser.nombre}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {currentUser.email}
                </div>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button
              onClick={() => setActiveMenu('usuarios')}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              title="Ajustes de cuenta"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick action buttons */}
        {!isSidebarCollapsed && (
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-400">
            <button
              onClick={() => window.open('https://gextotest.hexalabs.com.co', '_blank')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual</span>
            </button>
            <button
              onClick={() => setActiveMenu('politicas')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Personalizar</span>
            </button>
          </div>
        )}

        {/* Logout button */}
        {!isSidebarCollapsed && (
          <button
            onClick={() => alert('Sesión de prueba activa para Karen Garcia')}
            className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] font-semibold text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/20 rounded transition-colors pt-1"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>CERRAR SESIÓN</span>
          </button>
        )}
      </div>
    </aside>
  );
};
