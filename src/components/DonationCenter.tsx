import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Calendar, 
  Tv, 
  Share2, 
  ExternalLink, 
  Lock, 
  Check, 
  Sparkles, 
  BookOpen, 
  Award, 
  MessageSquare, 
  CreditCard, 
  DollarSign, 
  ChevronRight, 
  Youtube, 
  Flame,
  User,
  Coffee,
  Shield,
  MessageCircle
} from "lucide-react";

interface Backer {
  id: string;
  name: string;
  amount: number;
  message: string;
  date: string;
}

interface DonationCenterProps {
  backers: Backer[];
  onAddBacker: (backer: Backer) => void;
  onShowToast: (message: string) => void;
}

export default function DonationCenter({ backers, onAddBacker, onShowToast }: DonationCenterProps) {
  // Selection form for quick support
  const [supportAmount, setSupportAmount] = useState<number>(20);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmountVal, setCustomAmountVal] = useState("15");

  // Mock Form checkout
  const [checkoutProduct, setCheckoutProduct] = useState<{ name: string; price: number; type: "ebook" | "donation" } | null>(null);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [backerMessage, setBackerMessage] = useState("");
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Proposal Collaboration Form
  const [propName, setPropName] = useState("");
  const [propEmail, setPropEmail] = useState("");
  const [propCompany, setPropCompany] = useState("");
  const [propText, setPropText] = useState("");
  const [propSubmitted, setPropSubmitted] = useState(false);

  // Handle donation payment simulation
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardHolder.trim()) {
      onShowToast("Por favor, ingresa el nombre del titular.");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      onShowToast("Número de tarjeta inválido para la simulación.");
      return;
    }

    setIsSubmittingCheckout(true);

    setTimeout(() => {
      setIsSubmittingCheckout(false);
      setCheckoutSuccess(true);
      
      const finalAmount = checkoutProduct?.price || supportAmount;
      const finalMsg = backerMessage.trim() || (checkoutProduct?.type === "ebook" ? `Adquirió el e-book: ${checkoutProduct.name}` : "Soporte voluntario ✨");

      // Add as backer
      onAddBacker({
        id: Date.now().toString(),
        name: cardHolder,
        amount: finalAmount,
        message: finalMsg,
        date: new Date().toISOString().split("T")[0]
      });

      // Special mascot effect
      onShowToast("¡Donación Procesada Exitosamente! 🎉");
    }, 2000);
  };

  const handleCollaborationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propName.trim() || !propEmail.trim() || !propText.trim()) {
      onShowToast("Por favor rellena los campos requeridos.");
      return;
    }
    setPropSubmitted(true);
    onShowToast("¡Propuesta enviada con éxito! Manu te contactará pronto.");
  };

  const startCheckout = (name: string, price: number, type: "ebook" | "donation") => {
    setCheckoutProduct({ name, price, type });
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setBackerMessage("");
    setCheckoutSuccess(false);
    
    // Auto scroll to checkout panel
    setTimeout(() => {
      document.getElementById("checkout-panel-root")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="space-y-12 py-4" id="donation-center-root">
      
      {/* 1. CABECERA AL ESTILO WENTIX AI CO. */}
      <div className="text-center max-w-2xl mx-auto space-y-5 animate-fade-in">
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">wentix ai community.</span>
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.3)] bg-black animate-float">
            <img 
              src="/src/assets/images/orbi_mascot_idle_1780090348373.png" 
              alt="Orbi Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        <p className="text-sm md:text-base text-neutral-400 font-sans tracking-wide">
          Todo sobre Inteligencia Artificial y Herramientas de IA — Impulsado por <span className="text-cyan-400 font-semibold">Wentix AI</span>
        </p>

        {/* Badge Edicion */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.05)] mx-auto">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
          <span>Edición Especial: Claude & Codex de Cero a Cien 2026</span>
        </div>
      </div>

      {/* 2. ENLACES DIRECTOS Y REDES SOCIALES AL ESTILO TODODEIA */}
      <div className="max-w-2xl mx-auto space-y-3.5">
        
        {/* Row 1: Principales Call to Action Botones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <a 
            href="https://tidycal.com/" 
            target="_blank" 
            rel="noreferrer"
            className="group flex items-center justify-between px-5 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs tracking-wider transition-all duration-300 shadow-[0_10px_25px_rgba(249,115,22,0.2)] hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-black" />
              Agenda tu llamada de Consultoría
            </span>
            <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </a>

          <a 
            href="#live-events" 
            onClick={(e) => {
              e.preventDefault();
              onShowToast("¡Inscripción lista! Recibirás alertas del próximo Live de Inteligencia Artificial.");
            }}
            className="group flex items-center justify-between px-5 py-4 rounded-full bg-white text-black font-bold text-xs tracking-wider transition-all duration-300 border border-white/20 hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-hidden"
          >
            <span className="flex items-center gap-2 relative z-10">
              <span className="w-2 h-2 rounded-full bg-red-650 animate-ping absolute -left-0.5" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-650 inline-block mr-1" />
              Eventos en VIVO Gratuito
            </span>
            <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform relative z-10" />
            <div className="absolute inset-y-0 right-0 w-1/3 bg-red-500/10 blur-xl rounded-full" />
          </a>

        </div>

        {/* Row 2: Redes de Manu y Botón de Cofre Exclusivo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <a 
            href="https://youtube.com/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-neutral-300 hover:text-white transition-all text-xs font-semibold"
          >
            <Youtube className="w-4 h-4 text-red-500" />
            <span>YouTube de Manu</span>
          </a>

          <a 
            href="https://tiktok.com/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-neutral-300 hover:text-white transition-all text-xs font-semibold"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>TikTok / Redes</span>
          </a>

          <a 
            href="https://wentix.ai/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-linear-to-r from-blue-950 to-purple-950 hover:brightness-110 border border-purple-500/20 text-neutral-200 transition-all text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.1)]"
          >
            <Flame className="w-4 h-4 text-purple-400" />
            <span>Comunidad Wentix</span>
          </a>

        </div>

        {/* Row 3: Acción Cofre Exclusivo y Donación Directa */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          
          <button 
            onClick={() => onShowToast("🔐 El Cofre de Plantillas VIP se desbloquea comprando cualquier e-book o donando +$10 USD.")}
            className="flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-[#0a0a0a] hover:bg-neutral-900 text-neutral-250 font-bold font-mono text-xs border border-white/10 active:scale-95 transition-all shadow-md group cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 transition-colors" />
            <span>COFRE EXCLUSIVO</span>
          </button>

          <button 
            onClick={() => startCheckout("Apoyo Directo a Manu y Wentix AI", 15, "donation")}
            className="flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-linear-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-550/30 hover:to-purple-550/30 text-cyan-400 font-bold text-xs border border-cyan-500/40 hover:border-cyan-400 animate-pulse active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <Heart className="w-3.5 h-3.5 fill-cyan-400/20" />
            <span>DONAR DIRECTO</span>
          </button>

        </div>

      </div>

      {/* 4. RECURSOS EXCLUSIVOS & E-BOOKS AL ESTILO TODODEIA */}
      <div className="space-y-8" id="donacion-recursos">
        
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-bold font-display text-white">Recursos para seguir creciendo juntos</h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-lg mx-auto">
            Adquiere guías de alto calibre para aprender paso a paso cómo dominar modelos avanzados de lenguaje e integrar APIs en producción.
          </p>
        </div>

        {/* Ebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Ebook 1: Claude de Cero a Cien */}
          <div className="bg-neutral-950/60 rounded-3xl border border-white/10 hover:border-white/20 overflow-hidden shadow-2xl hover:scale-[1.01] transition-all flex flex-col group p-4.5 relative">
            {/* Soft cover style gradient */}
            <div className="rounded-2xl h-48 bg-neutral-900 flex flex-col items-center justify-center relative overflow-hidden mb-4 p-5">
              <img
                src="/src/assets/images/claude_cero_cien_1781370099850.jpg"
                alt="Claude de Cero a Cien"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,rgba(249,115,22,0.15)_0%,transparent_70%) pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              
              {/* Blue Ribbon PRONTO */}
              <div className="absolute top-0 right-0 z-20 overflow-hidden w-24 h-24 pointer-events-none">
                <div className="absolute top-4.5 -right-6.5 bg-blue-500 text-white text-[9px] font-bold font-mono tracking-widest py-1.5 w-32 text-center rotate-45 shadow-[0_2px_15px_rgba(59,130,246,0.6)]">
                  PRONTO
                </div>
              </div>

              <div className="relative z-10 w-14 h-14 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-base font-extrabold text-white text-center tracking-wide relative z-10 uppercase font-display max-w-xs leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Claude de Cero a Cien
              </h3>
              <p className="text-[10px] font-mono text-orange-300 relative z-10 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">EDICIÓN COMPLETAMENTE ACTUALIZADA</p>
            </div>

            {/* Meta details */}
            <div className="flex-1 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-white/5 border border-white/5 text-neutral-300 px-2 py-0.5 rounded-full font-mono">Ebook</span>
                  <span className="text-[10px] bg-orange-950/40 text-orange-400 border border-orange-900/30 px-2 py-0.5 rounded-full font-mono font-bold">500+ páginas</span>
                </div>
                <h4 className="text-base font-bold text-white mt-2.5">Guía Claude de Cero a Cien</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  La guía más completa y estructurada en español sobre asimilación avanzada de Claude AI, ingeniería de prompts definitiva, estructuración de contextos amplios and apalancamiento de modelado inteligente.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <div className="text-lg font-extrabold text-white">$29 USD</div>
                  <div className="text-[10px] font-mono text-neutral-500">O aprox. $599 MXN</div>
                </div>
                <button
                  onClick={() => startCheckout("E-book: Claude de Cero a Cien", 29, "ebook")}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-extrabold rounded-xl text-xs tracking-wider cursor-pointer shadow-[0_5px_15px_rgba(249,115,22,0.15)] group-hover:translate-x-0.5 transition-all text-center flex items-center gap-1.5"
                >
                  Comprar E-book <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Ebook 2: Codex de Cero a Cien */}
          <div className="bg-neutral-950/60 rounded-3xl border border-white/10 hover:border-white/20 overflow-hidden shadow-2xl hover:scale-[1.01] transition-all flex flex-col group p-4.5 relative">
            {/* Cover style gradient */}
            <div className="rounded-2xl h-48 bg-neutral-900 flex flex-col items-center justify-center relative overflow-hidden mb-4 p-5">
              <img
                src="/src/assets/images/codex_cero_cien_1781370111508.jpg"
                alt="Codex de Cero a Cien"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%) pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              
              {/* Blue Ribbon PRONTO */}
              <div className="absolute top-0 right-0 z-20 overflow-hidden w-24 h-24 pointer-events-none">
                <div className="absolute top-4.5 -right-6.5 bg-blue-500 text-white text-[9px] font-bold font-mono tracking-widest py-1.5 w-32 text-center rotate-45 shadow-[0_2px_15px_rgba(59,130,246,0.6)]">
                  PRONTO
                </div>
              </div>

              <div className="relative z-10 w-14 h-14 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-3 group-hover:scale-105 transition-transform">
                <Flame className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-base font-extrabold text-white text-center tracking-wide relative z-10 uppercase font-display max-w-xs leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Codex de Cero a Cien
              </h3>
              <p className="text-[10px] font-mono text-indigo-300 relative z-10 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">INGENIERÍA DE APIS Y AUTOMATIZACIONES</p>
            </div>

            {/* Meta details */}
            <div className="flex-1 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-white/5 border border-white/5 text-neutral-300 px-2 py-0.5 rounded-full font-mono">Ebook</span>
                  <span className="text-[10px] bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 px-2 py-0.5 rounded-full font-mono font-bold">500+ páginas</span>
                </div>
                <h4 className="text-base font-bold text-white mt-2.5">Guía Codex de Cero a Cien</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Aprenda de forma sumamente práctica a orquestar el Codex de OpenAI, conectar APIs, automatizar flujos corporativos de trabajo, y monetizar aplicaciones con IA integrales sin depender de equipos de desarrollo complejos.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <div className="text-lg font-extrabold text-white">$29 USD</div>
                  <div className="text-[10px] font-mono text-neutral-500">O aprox. $599 MXN</div>
                </div>
                <button
                  onClick={() => startCheckout("E-book: Codex de Cero a Cien", 29, "ebook")}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-extrabold rounded-xl text-xs tracking-wider cursor-pointer shadow-[0_5px_15px_rgba(249,115,22,0.15)] group-hover:translate-x-0.5 transition-all text-center flex items-center gap-1.5"
                >
                  Comprar E-book <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. INTERACTIVE FORM CHECKOUT / DONATION PORTAL COOP */}
      {checkoutProduct && (
        <div className="max-w-xl mx-auto glass-panel border border-cyan-500/30 p-6 md:p-8 rounded-3xl relative mt-4 scroll-mt-24 shadow-[0_0_30px_rgba(0,180,255,0.1)]" id="checkout-panel-root">
          
          {/* Close button */}
          <button 
            onClick={() => setCheckoutProduct(null)}
            className="absolute top-4 right-4 text-xs text-neutral-500 hover:text-white font-mono cursor-pointer border border-white/5 hover:border-white/25 px-2.5 py-1 rounded-lg transition-all"
          >
            Quitar formulario ×
          </button>

          {!checkoutSuccess ? (
            <div className="space-y-6">
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[9px] font-mono">
                  SISTEMA DE PAGOS ENTORNO SEGURO SIMULADO
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5 pt-1">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  Soporte & Transacción Digital
                </h3>
                <p className="text-xs text-neutral-400">
                  Completa los datos en este simulador seguro para aportar tu donación directa u obtener tu e-book.
                </p>
              </div>

              {/* Purchase Details Banner */}
              <div className="p-4 bg-neutral-950 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block uppercase tracking-wider font-mono text-[9px]">Concepto de pago:</span>
                  <span className="text-sm font-bold text-white">{checkoutProduct.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-400 block uppercase tracking-wider font-mono text-[9px]">Monto:</span>
                  <span className="text-base font-extrabold text-cyan-400">${checkoutProduct.price} USD</span>
                </div>
              </div>

              {/* Custom amount selector if it is donation */}
              {checkoutProduct.type === "donation" && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase text-neutral-400">¿Quieres ajustar tu monto de donación?</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 15, 30, 50].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setSupportAmount(num);
                          setCheckoutProduct(prev => prev ? { ...prev, price: num } : null);
                          setIsCustomAmount(false);
                        }}
                        className={`py-1.5 rounded-lg text-xs font-bold font-mono ${
                          supportAmount === num && !isCustomAmount
                            ? "bg-cyan-500 text-black"
                            : "bg-neutral-900 text-neutral-400 border border-white/5 hover:bg-neutral-800"
                        }`}
                      >
                        ${num} USD
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center pt-1.5">
                    <button
                      type="button"
                      onClick={() => setIsCustomAmount(true)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold font-mono whitespace-nowrap ${isCustomAmount ? "bg-cyan-500 text-black" : "bg-neutral-900 text-neutral-400 border border-white/5"}`}
                    >
                      Monto Libre:
                    </button>
                    {isCustomAmount && (
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">$</span>
                        <input
                          type="number"
                          value={customAmountVal}
                          onChange={(e) => {
                            setCustomAmountVal(e.target.value);
                            const val = parseFloat(e.target.value) || 0;
                            setSupportAmount(val);
                            setCheckoutProduct(prev => prev ? { ...prev, price: val } : null);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 focus:border-cyan-500 rounded-lg pl-6 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0"
                          placeholder="Monto"
                          min="1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Nombre Completo (Para el Muro de Honor):</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0 font-mono"
                    placeholder="Ej. Manu Emprendedor"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Tarjeta (16 dígitos):</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").substring(0, 16))}
                      className="w-full bg-neutral-900 border border-white/10 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0 font-mono"
                      placeholder="4000 1234 5678 9010"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">EXP/CVV:</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value.substring(0, 5))}
                        className="w-1/2 bg-neutral-900 border border-white/10 focus:border-cyan-500 rounded-xl px-2 py-2 text-center text-xs text-white focus:outline-none font-mono"
                      />
                      <input
                        type="password"
                        required
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                        className="w-1/2 bg-neutral-900 border border-white/10 focus:border-cyan-500 rounded-xl px-2 py-2 text-center text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1 flex items-center justify-between">
                    <span>Mensaje para publicar en la comunidad (Opcional):</span>
                    <span className="text-[9px] text-neutral-500">Aparecerá en el muro de donantes</span>
                  </label>
                  <textarea
                    value={backerMessage}
                    onChange={(e) => setBackerMessage(e.target.value)}
                    className="w-full h-16 bg-neutral-900 border border-white/10 focus:border-cyan-500 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0"
                    placeholder="Ej. ¡Felicitaciones Manu, excelente iniciativa con Wentix de verdad!"
                    maxLength={130}
                  />
                </div>

                <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-mono py-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-500/60" />
                  <span>Cifrado simulated SSL de 256 bits. No se almacenan cargos reales de dinero.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCheckout}
                  className="w-full mt-2 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs tracking-wider rounded-xl cursor-pointer shadow-lg active:scale-95 disabled:scale-100 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all uppercase flex items-center justify-center gap-2"
                >
                  {isSubmittingCheckout ? (
                    <>
                      <span className="block w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                      <span>Verificando con Servidores Orbi...</span>
                    </>
                  ) : (
                    `Donar & Procesar $${checkoutProduct.price} USD`
                  )}
                </button>

              </form>

            </div>
          ) : (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="mx-auto w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-450 animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">¡MIL GRACIAS POR TU DONACIÓN! 🌌💖</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Pavo simulado aprobado con éxito. Tu apoyo fomenta el desarrollo continuo de <span className="text-neutral-200">Wentix AI</span> y la re-curación de herramientas.
                </p>
              </div>

              {/* Holographic key code */}
              <div className="p-3 bg-cyan-950/20 border border-cyan-800/30 rounded-xl max-w-xs mx-auto text-left font-mono text-[10px] space-y-1">
                <span className="block text-[8px] text-neutral-500">CÓDIGO DE DESBLOQUEO COFRE VIP:</span>
                <span className="block text-cyan-400 text-center text-xs tracking-widest font-extrabold font-mono">WENTIX-ORBI-PRO-{Math.floor(1000 + Math.random() * 9000)}-VIP</span>
                <span className="block text-[8px] text-neutral-500 text-center mt-1">Sugerencia: Guarda este código para activar tus accesos directos</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                >
                  Volver al Directorio
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 6. COLABORACIÓN INTERACTIVA FORM & MURO DE DONANTES */}
      <div className="pt-4">
        
        {/* Full-width: Proposal Collab form */}
        <div className="bg-[#070707] p-6 rounded-3xl border border-white/5 space-y-5 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center gap-1.5 mb-1 bg-purple-950/30 text-purple-400 border border-purple-800/20 py-0.5 px-2.5 rounded-full text-[9px] font-mono w-fit">
              <Coffee className="w-3 h-3" />
              <span>COLABORACIÓN DIRECTA</span>
            </div>
            <h3 className="text-base font-bold text-white">¿Quieres Colaborar Conmigo o Wentix?</h3>
            <p className="text-xs text-neutral-400 leading-relaxed mt-1">
              ¿Tienes un proyecto de IA, necesitas consultoría corporativa para tu equipo de trabajo o deseas proponer una sociedad comercial? Rellena este formulario y hablemos.
            </p>
          </div>

          {!propSubmitted ? (
            <form onSubmit={handleCollaborationSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-neutral-500 mb-0.5">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={propName}
                    onChange={(e) => setPropName(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0"
                    placeholder="Ej. Manu Pérez"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-neutral-500 mb-0.5">Email de Contacto *</label>
                  <input
                    type="email"
                    required
                    value={propEmail}
                    onChange={(e) => setPropEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-500 mb-0.5">Empresa / Proyecto (Opcional)</label>
                <input
                  type="text"
                  value={propCompany}
                  onChange={(e) => setPropCompany(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/5 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  placeholder="Ej. Odysser Tech"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-500 mb-0.5">Propuesta o Mensaje *</label>
                <textarea
                  required
                  value={propText}
                  onChange={(e) => setPropText(e.target.value)}
                  className="w-full h-24 bg-neutral-900 border border-white/5 focus:border-purple-500 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0"
                  placeholder="Detalla tu propuesta para Manu..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-linear-to-r from-blue-600 to-purple-650 hover:brightness-110 text-white font-medium text-xs tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all uppercase"
              >
                Enviar Solicitud de Colaboración
              </button>

            </form>
          ) : (
            <div className="text-center py-8 space-y-3 bg-neutral-900/30 border border-dashed border-white/5 rounded-2xl animate-fade-in">
              <Check className="w-8 h-8 text-purple-400 mx-auto" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">¡Recibido con Éxito!</h4>
              <p className="text-2xs text-neutral-400 max-w-sm mx-auto">
                Tu solicitud de propuesta ha sido procesada de manera segura. Manu la analizará y te contactará en un plazo máximo de 24 horas hábiles.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPropSubmitted(false);
                  setPropName("");
                  setPropEmail("");
                  setPropCompany("");
                  setPropText("");
                }}
                className="text-[10px] text-purple-400 hover:underline"
              >
                Enviar otra propuesta
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
