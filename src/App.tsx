import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AmbientePruebasBanner } from './components/AmbientePruebasBanner';
import { GextoSidebar } from './components/GextoSidebar';
import { GextoDashboardView } from './views/GextoDashboardView';
import { FacturasView } from './views/FacturasView';
import { MiEmpresaView } from './views/MiEmpresaView';
import { UsuariosView } from './views/UsuariosView';
import { WorkflowView } from './views/WorkflowView';
import { PoliticasView } from './views/PoliticasView';
import { GestionPagosView } from './views/GestionPagosView';
import { ProveedoresView } from './views/ProveedoresView';
import { ImpuestosRetencionesView } from './views/ImpuestosRetencionesView';
import { NotasCreditoDebitoView } from './views/NotasCreditoDebitoView';
import { InventarioView } from './views/InventarioView';
import { TiposAdjuntosView } from './views/TiposAdjuntosView';
import { ClasesFacturaView } from './views/ClasesFacturaView';
import { ConceptosImpuestosView } from './views/ConceptosImpuestosView';
import { CentrosCostosView } from './views/CentrosCostosView';
import { SedesView } from './views/SedesView';
import { GestionJuridicaView } from './views/GestionJuridicaView';
import { WorkflowJuridicaView } from './views/WorkflowJuridicaView';
import { NuevosModulosView } from './views/NuevosModulosView';
import { JuridicaWorkflowProvider } from './context/JuridicaWorkflowContext';
import { AlertTriangle } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { activeMenu, setActiveMenu } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans select-none">
      {/* Top Striped Warning Banner */}
      <AmbientePruebasBanner />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dark Sidebar */}
        <GextoSidebar />

        {/* Content Container */}
        <div className="flex-1 flex flex-col overflow-y-auto relative">
          <main className="flex-1 p-6 md:p-8">
            {activeMenu === 'dashboard' && <GextoDashboardView />}
            {activeMenu === 'facturas' && <FacturasView />}
            {activeMenu === 'mi-empresa' && <MiEmpresaView />}
            {activeMenu === 'usuarios' && <UsuariosView />}
            {activeMenu === 'workflow' && <WorkflowView />}
            {activeMenu === 'workflow-juridica' && <WorkflowJuridicaView />}
            {activeMenu === 'politicas' && <PoliticasView />}
            {activeMenu === 'gestion-pagos' && <GestionPagosView />}
            {activeMenu === 'gestion-juridica' && <GestionJuridicaView />}
            {activeMenu === 'proveedores' && <ProveedoresView />}
            {activeMenu === 'impuestos' && <ImpuestosRetencionesView />}
            {activeMenu === 'notas-cd' && <NotasCreditoDebitoView />}
            {activeMenu === 'inventario' && <InventarioView />}
            {activeMenu === 'tipos-adjuntos' && <TiposAdjuntosView />}
            {activeMenu === 'clases-factura' && <ClasesFacturaView />}
            {activeMenu === 'conceptos-impuestos' && <ConceptosImpuestosView />}
            {activeMenu === 'centros-costos' && <CentrosCostosView />}
            {(activeMenu === 'sedes' || activeMenu === 'areas' || activeMenu === 'departamentos') && <SedesView />}
            {activeMenu === 'nuevos-modulos' && <NuevosModulosView />}
          </main>

          {/* Floating TEST Badge matching screenshot bottom-right */}
          <div className="fixed bottom-4 right-4 z-40">
            <button
              onClick={() => setActiveMenu('nuevos-modulos')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fef9c3] hover:bg-[#fef08a] border border-[#eab308] text-[#854d0e] text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              title="Ambiente de Pruebas Gexto / Nuevos Módulos"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#ca8a04]" />
              <span>TEST</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <JuridicaWorkflowProvider>
        <AppLayout />
      </JuridicaWorkflowProvider>
    </AppProvider>
  );
}
