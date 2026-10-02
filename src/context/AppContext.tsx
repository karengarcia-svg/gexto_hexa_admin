import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Factura,
  Proveedor,
  UsuarioGexto,
  ReglaWorkflow,
  PoliticaEmpresa,
  ModuloPersonalizado,
  InvoiceStatus
} from '../types';
import {
  CURRENT_USER,
  INITIAL_FACTURAS,
  INITIAL_PROVEEDORES,
  INITIAL_USUARIOS,
  INITIAL_REGLAS_WORKFLOW,
  INITIAL_POLITICAS,
  INITIAL_MODULOS_GEXTO
} from '../data/mockData';

interface AppContextType {
  currentUser: UsuarioGexto;
  setCurrentUser: (u: UsuarioGexto) => void;
  usuarios: UsuarioGexto[];
  facturas: Factura[];
  proveedores: Proveedor[];
  reglasWorkflow: ReglaWorkflow[];
  politicas: PoliticaEmpresa[];
  modulosPersonalizados: ModuloPersonalizado[];
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  periodFilter: 'mes' | 'total';
  setPeriodFilter: (p: 'mes' | 'total') => void;
  selectedFactura: Factura | null;
  setSelectedFactura: (f: Factura | null) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (c: boolean) => void;
  menuSearchTerm: string;
  setMenuSearchTerm: (s: string) => void;
  // Actions
  cambiarEstadoFactura: (id: string, nuevoEstado: InvoiceStatus) => void;
  crearFactura: (factura: Omit<Factura, 'id'>) => void;
  crearModuloPersonalizado: (m: Omit<ModuloPersonalizado, 'id' | 'fechaCreacion' | 'estado'>) => void;
  agregarRegistroAModulo: (moduloId: string, reg: Record<string, any>) => void;
  eliminarModulo: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UsuarioGexto>(() => {
    const saved = localStorage.getItem('gexto_user_v2');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [facturas, setFacturas] = useState<Factura[]>(() => {
    const saved = localStorage.getItem('gexto_facturas_v2');
    return saved ? JSON.parse(saved) : INITIAL_FACTURAS;
  });

  const [proveedores, setProveedores] = useState<Proveedor[]>(() => {
    const saved = localStorage.getItem('gexto_proveedores_v2');
    return saved ? JSON.parse(saved) : INITIAL_PROVEEDORES;
  });

  const [usuarios] = useState<UsuarioGexto[]>(INITIAL_USUARIOS);
  const [reglasWorkflow] = useState<ReglaWorkflow[]>(INITIAL_REGLAS_WORKFLOW);
  const [politicas] = useState<PoliticaEmpresa[]>(INITIAL_POLITICAS);

  const [modulosPersonalizados, setModulosPersonalizados] = useState<ModuloPersonalizado[]>(() => {
    const saved = localStorage.getItem('gexto_modulos_v2');
    return saved ? JSON.parse(saved) : INITIAL_MODULOS_GEXTO;
  });

  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [periodFilter, setPeriodFilter] = useState<'mes' | 'total'>('mes');
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [menuSearchTerm, setMenuSearchTerm] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('gexto_user_v2', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gexto_facturas_v2', JSON.stringify(facturas));
  }, [facturas]);

  useEffect(() => {
    localStorage.setItem('gexto_proveedores_v2', JSON.stringify(proveedores));
  }, [proveedores]);

  useEffect(() => {
    localStorage.setItem('gexto_modulos_v2', JSON.stringify(modulosPersonalizados));
  }, [modulosPersonalizados]);

  const cambiarEstadoFactura = (id: string, nuevoEstado: InvoiceStatus) => {
    setFacturas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, estado: nuevoEstado, aprobadoPor: currentUser.nombre } : f))
    );
  };

  const crearFactura = (fac: Omit<Factura, 'id'>) => {
    const nueva: Factura = {
      ...fac,
      id: `fac-${Date.now()}`
    };
    setFacturas((prev) => [nueva, ...prev]);
  };

  const crearModuloPersonalizado = (m: Omit<ModuloPersonalizado, 'id' | 'fechaCreacion' | 'estado'>) => {
    const nuevo: ModuloPersonalizado = {
      ...m,
      id: `mod-${m.codigo.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      fechaCreacion: new Date().toISOString().substring(0, 10),
      estado: 'ACTIVO'
    };
    setModulosPersonalizados((prev) => [...prev, nuevo]);
  };

  const agregarRegistroAModulo = (moduloId: string, reg: Record<string, any>) => {
    setModulosPersonalizados((prev) =>
      prev.map((mod) => {
        if (mod.id === moduloId) {
          return {
            ...mod,
            registros: [{ id: `reg-${Date.now()}`, ...reg }, ...mod.registros]
          };
        }
        return mod;
      })
    );
  };

  const eliminarModulo = (id: string) => {
    setModulosPersonalizados((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        usuarios,
        facturas,
        proveedores,
        reglasWorkflow,
        politicas,
        modulosPersonalizados,
        activeMenu,
        setActiveMenu,
        periodFilter,
        setPeriodFilter,
        selectedFactura,
        setSelectedFactura,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        menuSearchTerm,
        setMenuSearchTerm,
        cambiarEstadoFactura,
        crearFactura,
        crearModuloPersonalizado,
        agregarRegistroAModulo,
        eliminarModulo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
