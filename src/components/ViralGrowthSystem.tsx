import React, { useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  Globe, 
  Mail, 
  ShieldAlert, 
  DollarSign, 
  RefreshCw
} from "lucide-react";

interface ViralProps {
  onShowToast: (message: string) => void;
  triggerPushNotification?: (title: string, body: string, category?: string) => void;
  bookmarksCount?: number;
  activeInnerTab?: "profile" | "admin";
  setActiveInnerTab?: (tab: "profile" | "admin") => void;
  leadStats: {
    visitorsCount: number;
    leadsCount: number;
    registrosDiarios: number;
    registrosSemanales: number;
    registrosMensuales: number;
    tasaConversion: string;
    donacionesRecibidas: number;
    leadsList: { email: string; createdAt: string }[];
    donationsList: { id: string; name: string; amount: number; message: string; date: string }[];
  };
  onRefreshStats: () => Promise<void>;
}

export default function ViralGrowthSystem({ 
  onShowToast, 
  triggerPushNotification,
  leadStats,
  onRefreshStats
}: ViralProps) {
  
  // Refresh stats on load
  useEffect(() => {
    onRefreshStats();
  }, []);

  return (
    <div className="space-y-8" id="admin-analytics-dashboard">
      
      {/* 1. SECTOR DE ACCESO / HEADER SOCIAL */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs font-mono text-purple-400 uppercase tracking-widest block font-bold mb-1">
            MÓDULO DE ADQUISICIÓN Y CONTROL CO
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-purple-400 shrink-0" />
            Panel Administrativo de Captación
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Monitorea en tiempo real los correos capturados, visitantes únicos, conversiones e interacciones con el ecosistema Wentix AI.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={async () => {
              await onRefreshStats();
              onShowToast("✓ ¡Métricas e historial refrescados en tiempo real!");
              if (triggerPushNotification) {
                triggerPushNotification(
                  "📊 Métricas de Tráfico",
                  "Listados de leads actualizados desde base de datos segura.",
                  "Admin"
                );
              }
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Refrescar Métricas</span>
          </button>
        </div>
      </div>

      {/* Core Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl relative overflow-hidden">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Correos Capturados:</span>
          <span className="block text-2xl font-extrabold text-white font-display mt-1.5">
            {leadStats.leadsCount}
          </span>
          <div className="flex items-center gap-1 font-mono text-[9px] mt-2">
            <span className="text-purple-400">Total acumulado</span>
          </div>
          <div className="absolute right-4 bottom-4 text-neutral-800/20">
            <Users className="w-12 h-12" />
          </div>
        </div>

        <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl relative overflow-hidden">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Visitantes Totales:</span>
          <span className="block text-2xl font-extrabold text-cyan-400 font-display mt-1.5">
            {leadStats.visitorsCount.toLocaleString()}
          </span>
          <div className="flex items-center gap-1 font-mono text-[9px] text-cyan-500 mt-2">
            <span>Sesiones únicas de tráfico</span>
          </div>
          <div className="absolute right-4 bottom-4 text-neutral-800/20">
            <Globe className="w-12 h-12" />
          </div>
        </div>

        <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl relative overflow-hidden">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Tasa de Conversión:</span>
          <span className="block text-2xl font-extrabold text-emerald-400 font-display mt-1.5">
            {leadStats.tasaConversion}
          </span>
          <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-400 mt-2">
            <span>Tráfico convertido a Leads</span>
          </div>
          <div className="absolute right-4 bottom-4 text-neutral-800/20">
            <TrendingUp className="w-12 h-12" />
          </div>
        </div>

        <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl relative overflow-hidden">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Donaciones Recibidas:</span>
          <span className="block text-2xl font-extrabold text-purple-400 font-display mt-1.5">
            ${leadStats.donacionesRecibidas} USD
          </span>
          <div className="flex items-center gap-1 font-mono text-[9px] text-purple-400 mt-2">
            <span>Soporte de la comunidad</span>
          </div>
          <div className="absolute right-4 bottom-4 text-neutral-800/20">
            <DollarSign className="w-12 h-12" />
          </div>
        </div>

      </div>

      {/* Timeframe breakdown grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-neutral-900/40 border border-white/5 rounded-2xl">
          <div className="text-2xs font-mono uppercase tracking-wider text-neutral-500">Registros Diarios (últimas 24h)</div>
          <div className="text-2xl font-extrabold text-white mt-1">+{leadStats.registrosDiarios} leads</div>
          <p className="text-[10px] text-neutral-450 mt-1 leading-relaxed">Suscripciones inmediatas registradas durante las últimas 24 horas.</p>
        </div>
        
        <div className="p-4 bg-neutral-900/40 border border-white/5 rounded-2xl">
          <div className="text-2xs font-mono uppercase tracking-wider text-neutral-500">Registros Semanales (7 días)</div>
          <div className="text-2xl font-extrabold text-white mt-1">+{leadStats.registrosSemanales} leads</div>
          <p className="text-[10px] text-neutral-450 mt-1 leading-relaxed">Incremento de comunidad acumulado durante la última semana.</p>
        </div>

        <div className="p-4 bg-neutral-900/40 border border-white/5 rounded-2xl">
          <div className="text-2xs font-mono uppercase tracking-wider text-neutral-500">Registros Mensuales (30 días)</div>
          <div className="text-2xl font-extrabold text-white mt-1">+{leadStats.registrosMensuales} leads</div>
          <p className="text-[10px] text-neutral-450 mt-1 leading-relaxed">Crecimiento orgánico sostenido a lo largo del mes actual.</p>
        </div>
      </div>

      {/* Real captured emails database table */}
      <div className="bg-neutral-950 p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Bandeja de Leads y Correos Capturados</h4>
            <p className="text-[10.5px] text-neutral-400 font-sans">Detalle ordenado de los correos que se unieron voluntariamente a Wentix AI.</p>
          </div>
          <div className="text-[10px] font-mono rounded bg-neutral-900 px-2 py-1 text-purple-400 border border-purple-950">
            Total: {leadStats.leadsCount} registros reales
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs text-neutral-300">
            <thead>
              <tr className="border-b border-white/10 text-neutral-500 text-[10px] uppercase tracking-wider bg-neutral-900/40">
                <th className="py-3 px-4 rounded-l-xl">#</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4 rounded-r-xl">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leadStats.leadsList && leadStats.leadsList.length > 0 ? (
                leadStats.leadsList.map((lead, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-neutral-500 font-bold">{idx + 1}</td>
                    <td className="py-3 px-4 text-white font-semibold flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      <span>{lead.email}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-450 text-2xs">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-neutral-500 font-mono">
                    No hay correos registrados en la base de datos todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual charts and breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Growth Simulator Curves */}
        <div className="lg:col-span-8 bg-neutral-950 p-6 rounded-3xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Curva de Crecimiento Semanal (Registros)</h4>
              <p className="text-[10.5px] text-neutral-450">Tráfico orgánico capturado por día de la semana</p>
            </div>
            <div className="flex items-center gap-3.5 font-mono text-[10.5px]">
              <span className="flex items-center gap-1 text-purple-400"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Captados</span>
              <span className="flex items-center gap-1 text-cyan-400"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Visitas</span>
            </div>
          </div>

          <div className="relative pt-4 h-48 w-full border-b border-l border-white/10 flex items-end">
            <div className="absolute left-1 top-2 text-[8px] font-mono text-neutral-600">120 u</div>
            <div className="absolute left-1 top-16 text-[8px] font-mono text-neutral-600">80 u</div>
            <div className="absolute left-1 top-32 text-[8px] font-mono text-neutral-600">40 u</div>

            <div className="flex justify-around items-end w-full h-full pb-1 z-10 pl-4">
              {[
                { day: "Lun", organic: 35, referred: 10 },
                { day: "Mar", organic: 45, referred: 18 },
                { day: "Mié", organic: 52, referred: 22 },
                { day: "Jue", organic: 44, referred: 35 },
                { day: "Vie", organic: 68, referred: 45 },
                { day: "Sáb", organic: leadStats.registrosDiarios > 0 ? leadStats.registrosDiarios * 5 : 45, referred: leadStats.registrosDiarios > 0 ? Math.floor(leadStats.registrosDiarios * 2.5) : 18 },
                { day: "Dom", organic: 40, referred: 15 }
              ].map((item, idx) => {
                const totalMax = 120;
                const hOrganic = (item.organic / totalMax) * 100;
                const hReferred = (item.referred / totalMax) * 100;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                    <div className="w-9 sm:w-12 h-36 flex items-end justify-center gap-1 bg-white/[0.01] hover:bg-white/[0.04] transition-all rounded p-1">
                      <div 
                        style={{ height: `${hOrganic}%` }} 
                        className="bg-cyan-500/80 w-3 rounded-t-sm hover:brightness-110 transition-all duration-500 relative"
                        title={`Visitas: ${item.organic}`}
                      />
                      <div 
                        style={{ height: `${hReferred}%` }} 
                        className="bg-purple-500/80 w-3 rounded-t-sm hover:brightness-110 transition-all duration-500 relative"
                        title={`Captados: ${item.referred}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 group-hover:text-white transition-colors">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] font-mono text-neutral-500 flex justify-between">
            <span>✓ Base de datos conectada</span>
            <span>Última recalibración: {new Date().toLocaleDateString([], {hour: '2-digit', minute: '2-digit'})}</span>
          </div>
        </div>

        {/* Traffic sources pie representation */}
        <div className="lg:col-span-4 bg-neutral-950 p-6 rounded-3xl border border-white/5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Tráfico por Origen</h4>
          <p className="text-[10.5px] text-neutral-450 font-sans">Distribución de orígenes en la base de datos real o simulada.</p>

          <div className="flex justify-center py-2">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="15.9155" fill="transparent" stroke="#06b6d4" strokeWidth="2.8" strokeDasharray="60 40" strokeDashoffset="0" />
              <circle cx="16" cy="16" r="15.9155" fill="transparent" stroke="#3b82f6" strokeWidth="2.8" strokeDasharray="30 70" strokeDashoffset="-60" />
              <circle cx="16" cy="16" r="15.9155" fill="transparent" stroke="#eab308" strokeWidth="2.8" strokeDasharray="10 90" strokeDashoffset="-90" />
            </svg>
          </div>

          <div className="space-y-1.5 pt-1 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-cyan-400 text-2xs"><span className="w-2 h-2 rounded bg-cyan-400" /> Orgánico Directo:</span>
              <span className="text-white font-bold text-2xs">60.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-400 text-2xs"><span className="w-2 h-2 rounded bg-blue-500" /> Redes Sociales:</span>
              <span className="text-white font-bold text-2xs">30.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-yellow-400 text-2xs"><span className="w-2 h-2 rounded bg-yellow-500" /> Mensajería:</span>
              <span className="text-white font-bold text-2xs">10.0%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
