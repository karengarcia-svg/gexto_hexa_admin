import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  Plus,
  Tag,
  ArrowLeft,
  Calendar,
  Eye,
  Check,
  Trash2,
  Folder,
  AlertCircle,
  FolderPlus,
  Clock,
  CheckCircle2,
  Sliders,
  Filter,
  Layers,
  ChevronDown
} from 'lucide-react';

interface PolicyCategory {
  id: string;
  name: string;
  color: string;
  description: string;
  policiesCount: number;
}

interface PolicyCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Policy {
  id: string;
  name: string;
  scope: string;
  category: string;
  description: string;
  priority: number;
  validFrom: string;
  validTo: string;
  conditions: PolicyCondition[];
  actionResult: string;
  actionTrigger: 'cumple' | 'no_cumple';
  active: boolean;
}

export const PoliticasView: React.FC = () => {
  const { setActiveMenu } = useApp();

  // Navigation mode: 'list' | 'categories' | 'create-policy'
  const [viewMode, setViewMode] = useState<'list' | 'categories' | 'create-policy'>('list');

  // Categories state
  const [categories, setCategories] = useState<PolicyCategory[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('Gris');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [catNameError, setCatNameError] = useState(false);

  // Policies state
  const [policies, setPolicies] = useState<Policy[]>([]);

  // Policy Form State
  const [scope, setScope] = useState('Pagos (facturas)');
  const [policyName, setPolicyName] = useState('');
  const [policyCategory, setPolicyCategory] = useState('');
  const [policyDesc, setPolicyDesc] = useState('');
  const [priority, setPriority] = useState(100);
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [conditions, setConditions] = useState<PolicyCondition[]>([]);
  const [actionResult, setActionResult] = useState('Advertir (continúa con aviso)');
  const [actionTrigger, setActionTrigger] = useState<'cumple' | 'no_cumple'>('cumple');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setCatNameError(true);
      return;
    }
    setCatNameError(false);

    const newCat: PolicyCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      color: newCatColor,
      description: newCatDesc.trim(),
      policiesCount: 0
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    showToast(`Categoría "${newCat.name}" creada con éxito`);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    showToast('Categoría eliminada');
  };

  const handleAddCondition = () => {
    const newCond: PolicyCondition = {
      id: `cond-${Date.now()}`,
      field: 'Monto total',
      operator: 'Mayor que (>)',
      value: '$5.000.000'
    };
    setConditions([...conditions, newCond]);
  };

  const handleRemoveCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName.trim()) {
      alert('Por favor ingresa un nombre para la política.');
      return;
    }

    const newPol: Policy = {
      id: `pol-${Date.now()}`,
      name: policyName.trim(),
      scope,
      category: policyCategory || 'Sin categoría',
      description: policyDesc.trim(),
      priority,
      validFrom,
      validTo,
      conditions,
      actionResult,
      actionTrigger,
      active: true
    };

    setPolicies([...policies, newPol]);

    // Update category count if matched
    if (policyCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.name === policyCategory ? { ...c, policiesCount: c.policiesCount + 1 } : c
        )
      );
    }

    // Reset Form
    setPolicyName('');
    setPolicyDesc('');
    setConditions([]);
    setViewMode('list');
    showToast('Política creada exitosamente');
  };

  const getActionPreviewText = () => {
    const actionVerb = actionResult.toLowerCase().includes('advertir')
      ? 'advertir'
      : actionResult.toLowerCase().includes('bloquear')
      ? 'bloquear'
      : 'requerir aprobación';

    if (conditions.length === 0) {
      return `Siempre → ${actionVerb}.`;
    }
    return `Si se cumple la condición → ${actionVerb}.`;
  };

  const getCategoryColorBadge = (colorName: string) => {
    switch (colorName.toLowerCase()) {
      case 'azul':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'verde':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'morado':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rojo':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'amarillo':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

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
      {/* VIEW 1: Main Políticas List (Screenshot 1)               */}
      {/* ======================================================== */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Top Return link */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className="hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>VOLVER A CONFIGURACIÓN</span>
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Políticas
              </h1>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
                REGLAS CONFIGURABLES DE TU EMPRESA
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('categories')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Categorías</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('create-policy')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva política</span>
              </button>
            </div>
          </div>

          {/* Callout Info Banner */}
          {categories.length === 0 && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-3">
              <span className="text-indigo-600 font-bold mt-0.5">ℹ️</span>
              <div>
                <span className="font-bold">Aún no tienes categorías.</span>
                <p className="text-indigo-900 mt-0.5">
                  Crea o carga categorías para organizar tus políticas.{' '}
                  <button
                    onClick={() => setViewMode('categories')}
                    className="text-indigo-700 underline font-semibold hover:text-indigo-900"
                  >
                    Ir a categorías
                  </button>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Main Container: Empty state or List */}
          {policies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                <Scale className="w-9 h-9 text-slate-300" />
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Aún no tienes políticas
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Crea tu primera regla para tu empresa.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewMode('create-policy')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva política</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {policies.map((p) => (
                <div key={p.id} className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.description || 'Sin descripción'} · Prioridad: {p.priority} · {p.actionResult}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ACTIVA
                    </span>
                    <button
                      onClick={() => {
                        setPolicies(policies.filter((item) => item.id !== p.id));
                        showToast('Política eliminada');
                      }}
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: Categorías de Políticas (Screenshot 2)           */}
      {/* ======================================================== */}
      {viewMode === 'categories' && (
        <div className="space-y-6">
          {/* Top Return link */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            <button
              onClick={() => setViewMode('list')}
              className="hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>VOLVER A POLÍTICAS</span>
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Categorías de políticas
            </h1>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
              ORGANIZA TUS POLÍTICAS POR CATEGORÍA
            </p>
          </div>

          {/* Top Card: Agregar categoría */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Agregar categoría</span>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* NOMBRE */}
                <div className="md:col-span-3 space-y-1 relative">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    NOMBRE *
                  </label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      if (catNameError) setCatNameError(false);
                    }}
                    placeholder="Ej: Aprobación y autorización"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 ${
                      catNameError ? 'border-amber-400' : 'border-slate-300'
                    }`}
                  />

                  {/* Validation popup matching screenshot 2 */}
                  {catNameError && (
                    <div className="absolute left-1/3 top-16 z-30 bg-white border border-slate-400 text-slate-900 text-xs px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2 animate-in fade-in">
                      <span className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                        !
                      </span>
                      <span>Completa este campo</span>
                    </div>
                  )}
                </div>

                {/* COLOR */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    COLOR
                  </label>
                  <select
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                  >
                    <option value="Gris">Gris</option>
                    <option value="Azul">Azul</option>
                    <option value="Verde">Verde</option>
                    <option value="Morado">Morado</option>
                    <option value="Rojo">Rojo</option>
                    <option value="Amarillo">Amarillo</option>
                  </select>
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  DESCRIPCIÓN (OPCIONAL)
                </label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="¿Qué agrupa esta categoría?"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar categoría</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Card: Categorías [count] */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="text-slate-500">📋</span>
              <span>Categorías</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {categories.length}
              </span>
            </div>

            {categories.length === 0 ? (
              <div className="py-14 flex flex-col items-center justify-center text-center space-y-2">
                <Folder className="w-10 h-10 text-slate-300 stroke-1" />
                <h4 className="font-semibold text-xs text-slate-700">
                  Aún no tienes categorías.
                </h4>
                <p className="text-[11px] text-slate-400">
                  Créalas con el formulario de arriba.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColorBadge(c.color)}`}>
                        {c.name}
                      </span>
                      {c.description && (
                        <span className="text-xs text-slate-500">{c.description}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {c.policiesCount} políticas
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: Nueva Política (Screenshots 3 & 4)                */}
      {/* ======================================================== */}
      {viewMode === 'create-policy' && (
        <form onSubmit={handleCreatePolicy} className="space-y-6">
          {/* Top Return link */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>VOLVER A POLÍTICAS</span>
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Nueva política
            </h1>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
              DEFINE UNA REGLA PARA TU EMPRESA
            </p>
          </div>

          {/* Section 1: Datos básicos */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h2 className="font-bold text-sm text-slate-900">
                Datos básicos
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              {/* ¿SOBRE QUÉ ES ESTA POLÍTICA? */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  ¿SOBRE QUÉ ES ESTA POLÍTICA? *
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                >
                  <option value="Pagos (facturas)">Pagos (facturas)</option>
                  <option value="Proveedores">Proveedores</option>
                  <option value="Inventario">Inventario</option>
                </select>
              </div>

              {/* NOMBRE */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  NOMBRE *
                </label>
                <input
                  type="text"
                  required
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder="Ej: Aprobación por monto alto"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              {/* CATEGORÍA */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  CATEGORÍA
                </label>
                <select
                  value={policyCategory}
                  onChange={(e) => setPolicyCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                >
                  <option value="">— Sin categoría —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPCIÓN (OPCIONAL) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  DESCRIPCIÓN (OPCIONAL)
                </label>
                <input
                  type="text"
                  value={policyDesc}
                  onChange={(e) => setPolicyDesc(e.target.value)}
                  placeholder="¿Qué controla esta política?"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              {/* 3 Columns: PRIORIDAD, VIGENCIA DESDE, VIGENCIA HASTA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    PRIORIDAD
                  </label>
                  <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    VIGENCIA DESDE
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                      placeholder="dd/mm/aaaa"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    VIGENCIA HASTA
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={validTo}
                      onChange={(e) => setValidTo(e.target.value)}
                      placeholder="dd/mm/aaaa"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Condición (OPCIONAL) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h2 className="font-bold text-sm text-slate-900">
                Condición <span className="font-normal text-slate-400 text-xs uppercase">(OPCIONAL)</span>
              </h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Sin condiciones, la política <strong>aplica siempre</strong>. Combina condiciones con Y / O; puedes añadir un grupo para anidar un nivel.
            </p>

            {/* Existing conditions list */}
            {conditions.length > 0 && (
              <div className="space-y-2 pt-2">
                {conditions.map((cond) => (
                  <div key={cond.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="font-bold text-slate-800">{cond.field}</span>
                      <span className="text-slate-400 font-mono">{cond.operator}</span>
                      <span className="font-mono text-indigo-700 font-bold">{cond.value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(cond.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons: + Condición & + Grupo (Y/O) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAddCondition}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>Condición</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('Grupo condicional agregado')}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
                <span>Grupo (Y/O)</span>
              </button>
            </div>
          </div>

          {/* Section 3: Acción */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h2 className="font-bold text-sm text-slate-900">
                Acción
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              {/* RESULTADO */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  RESULTADO *
                </label>
                <select
                  value={actionResult}
                  onChange={(e) => setActionResult(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                >
                  <option value="Advertir (continúa con aviso)">Advertir (continúa con aviso)</option>
                  <option value="Bloquear (impide continuar)">Bloquear (impide continuar)</option>
                  <option value="Requerir aprobación adicional">Requerir aprobación adicional</option>
                  <option value="Notificar por correo">Notificar por correo</option>
                </select>
              </div>

              {/* EJECUTAR LA ACCIÓN CUANDO LA CONDICIÓN... */}
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  EJECUTAR LA ACCIÓN CUANDO LA CONDICIÓN...
                </label>

                <div className="flex items-center gap-4">
                  <label className="flex-1 p-3 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-50/60 transition-colors">
                    <input
                      type="radio"
                      name="actionTrigger"
                      checked={actionTrigger === 'cumple'}
                      onChange={() => setActionTrigger('cumple')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-bold text-slate-800">Se cumple</span>
                  </label>

                  <label className="flex-1 p-3 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-50/60 transition-colors">
                    <input
                      type="radio"
                      name="actionTrigger"
                      checked={actionTrigger === 'no_cumple'}
                      onChange={() => setActionTrigger('no_cumple')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-bold text-slate-800">NO se cumple</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* VISTA PREVIA Callout Box (Matching Screenshot 4) */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              <Eye className="w-3.5 h-3.5" />
              <span>VISTA PREVIA</span>
            </div>
            <div className="font-medium text-indigo-900 text-sm">
              {getActionPreviewText()}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Crear política</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
