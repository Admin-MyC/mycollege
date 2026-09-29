import React, { useState } from 'react';
import { SiteContent } from '../types';
import { useAppTheme } from '../themeContext';
import { submitDemoRequest } from '../firebase';
import { 
  Send, 
  School, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  MapPin, 
  MessageSquare, 
  CheckCircle, 
  GraduationCap,
  Video,
  Calendar,
  Sparkles,
  LifeBuoy
} from 'lucide-react';

interface DemoContactSectionProps {
  content: SiteContent;
  textAlign?: 'left' | 'center';
}

export const DemoContactSection: React.FC<DemoContactSectionProps> = ({ content, textAlign }) => {
  const { themeConfig } = useAppTheme();
  const isLight = themeConfig.navVariant === 'light';
  const isCentered = textAlign ? textAlign === 'center' : (content.textAlignment === 'center' || true);
  
  // Custom card colors configured by user in CMS
  const cardColors = content.cardColors;

  const [formData, setFormData] = useState({
    schoolName: '',
    contactName: '',
    email: '',
    phone: '',
    studentCount: '300-600 alumnos',
    webinarTopic: 'Plataforma Integral Completa',
    preferredDate: '',
    preferredTime: 'Mañana (9:00 AM - 12:00 PM)',
    currentSystem: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName || !formData.contactName || !formData.email) {
      setError('Por favor completa el nombre del colegio, tu nombre y tu correo de contacto.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Guardar solicitud en Firestore (persistencia asegurada)
      await submitDemoRequest({
        schoolName: formData.schoolName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        studentCount: formData.studentCount,
        currentSystem: formData.currentSystem,
        webinarTopic: formData.webinarTopic,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message
      });

      // 2. Disparar notificación por correo a contacto@mycollege.com.mx vía endpoint con Gmail
      try {
        await fetch('/api/send-webinar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            schoolName: formData.schoolName,
            contactName: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            studentCount: formData.studentCount,
            currentSystem: formData.currentSystem,
            webinarTopic: formData.webinarTopic,
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime,
            message: formData.message
          }),
        });
      } catch (mailErr) {
        console.warn('Nota: No se pudo enviar el correo de notificación inmediata:', mailErr);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting webinar request to Firestore:', err);
      setError('Ocurrió un inconveniente al enviar la solicitud. Por favor intenta nuevamente o contáctanos por WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = cardColors ? {
    backgroundColor: cardColors.cardBg,
    borderColor: cardColors.cardBorder,
    color: cardColors.cardText
  } : {};

  return (
    <section
      id="contacto"
      className={`py-20 relative transition-colors duration-300 border-t-2 border-[#D4AF37]/20 ${
        isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-16 ${isCentered ? 'text-center mx-auto' : 'text-left'}`}>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-[#0B2545] text-[#F5B82E] border-2 border-[#D4AF37] mb-3 shadow-md ${isCentered ? 'mx-auto' : ''}`}>
            <Video className="w-4 h-4 text-[#D4AF37]" />
            <span>WEBINAR EN VIVO & ASESORÍA PERSONALIZADA</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif ${
            isLight ? 'text-[#081D3C]' : 'text-white'
          }`}>
            Agenda un Webinar para tu Colegio
          </h2>
          <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
            isLight ? 'text-[#081D3C]/80' : 'text-white/85'
          }`}>
            Participa en una sesión virtual personalizada en vivo donde te mostraremos cómo transformar la administración escolar, cobranza y comunicación de tu institución.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Box 1: Canales de Atención Directa */}
            <div 
              style={cardStyle}
              className={`p-8 rounded-3xl border-2 border-[#D4AF37] shadow-xl ${
                !cardColors ? (isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white') : ''
              }`}
            >
              <h3 className="text-xl font-bold font-serif mb-6 text-[#D4AF37] flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Medios de Contacto Directo</span>
              </h3>

              <div className="space-y-4 text-sm">
                
                {/* Email Directivo */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/70">Correo Directivo & Solicitudes</div>
                    <a
                      href={`mailto:${content.contactEmail}`}
                      className="font-bold hover:text-[#D4AF37] transition-colors break-all"
                    >
                      {content.contactEmail}
                    </a>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/70">Teléfono Conmutador Directivo</div>
                    <a href={`tel:${content.contactPhone}`} className="font-bold hover:text-[#D4AF37]">
                      {content.contactPhone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/70">WhatsApp Atención Inmediata</div>
                    <div className="font-bold text-[#F5B82E]">
                      {content.contactWhatsapp}
                    </div>
                  </div>
                </div>

                {/* Support Email if available */}
                {content.supportEmail && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                      <LifeBuoy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white/70">Soporte a Colegios Afiliados</div>
                      <a href={`mailto:${content.supportEmail}`} className="font-bold hover:text-[#D4AF37]">
                        {content.supportEmail}
                      </a>
                    </div>
                  </div>
                )}

                {/* Ubicación */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/70">Oficinas Corporativas</div>
                    <div className="font-semibold text-xs leading-relaxed">
                      {content.address}
                    </div>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/70">Horario de Atención</div>
                    <div className="font-semibold text-xs">
                      {content.schedule}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Box 2: Beneficios del Webinar */}
            <div 
              style={cardStyle}
              className={`p-6 rounded-2xl border-2 border-[#D4AF37]/40 flex items-start gap-4 ${
                !cardColors ? (isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white') : ''
              }`}
            >
              <div className="p-3 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37] shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-[#D4AF37] block mb-1">¿Qué incluye tu Webinar?</span>
                <ul className="space-y-1 text-xs opacity-90 list-disc list-inside">
                  <li>Demostración en vivo de las pantallas y flujos escolares.</li>
                  <li>Diagnóstico de ahorro y reducción de morosidad.</li>
                  <li>Sesión de preguntas y respuestas con directores del área.</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column: Webinar Form */}
          <div className="lg:col-span-7">
            <div 
              style={cardStyle}
              className={`p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-2xl relative ${
                !cardColors ? (isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white') : ''
              }`}
            >
              
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#081D3C] text-[#D4AF37] flex items-center justify-center border-2 border-[#D4AF37]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-[#D4AF37]">
                    ¡Webinar Solicitado con Éxito!
                  </h3>
                  <p className="text-sm max-w-md mx-auto leading-relaxed opacity-90">
                    Hemos registrado la solicitud de <strong>{formData.schoolName}</strong> en nuestra base de datos. Nos comunicaremos a <strong>{formData.email}</strong> para confirmar el enlace y la fecha del Webinar.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        schoolName: '',
                        contactName: '',
                        email: '',
                        phone: '',
                        studentCount: '300-600 alumnos',
                        webinarTopic: 'Plataforma Integral Completa',
                        preferredDate: '',
                        preferredTime: 'Mañana (9:00 AM - 12:00 PM)',
                        currentSystem: '',
                        message: ''
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#081D3C] font-extrabold text-xs shadow-md"
                  >
                    Agendar para otro plantel o fecha
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="border-b border-[#D4AF37]/30 pb-4 mb-2">
                    <h3 className="text-2xl font-bold font-serif text-white">
                      Formulario de Solicitud de Webinar
                    </h3>
                    <p className="text-xs text-white/75 mt-1">
                      Completa los datos de tu institución privada para preparar la sesión virtual.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Nombre del Colegio */}
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-white/90">
                        Nombre del Colegio *
                      </label>
                      <div className="relative">
                        <School className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4AF37]" />
                        <input
                          type="text"
                          required
                          placeholder="Ej. Colegio Bilingüe Vallarta"
                          value={formData.schoolName}
                          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Nombre del Director / Responsable */}
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-white/90">
                        Nombre del Director / Directora *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4AF37]" />
                        <input
                          type="text"
                          required
                          placeholder="Ej. Mtra. Sofía Morales"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Correo Electrónico */}
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-white/90">
                        Correo Institucional *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4AF37]" />
                        <input
                          type="email"
                          required
                          placeholder="direccion@tucolegio.edu.mx"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Teléfono / WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-white/90">
                        Teléfono Directo o WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4AF37]" />
                        <input
                          type="tel"
                          required
                          placeholder="+52 55 1234 5678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Matrícula Aproximada */}
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-white/90">
                        Matrícula Escolar Aprox.
                      </label>
                      <select
                        value={formData.studentCount}
                        onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="Menos de 200 alumnos">Menos de 200 alumnos</option>
                        <option value="200 - 500 alumnos">200 - 500 alumnos</option>
                        <option value="500 - 1,000 alumnos">500 - 1,000 alumnos</option>
                        <option value="Más de 1,000 alumnos">Más de 1,000 alumnos</option>
                        <option value="Grupo / Red de Colegios">Grupo / Red de Colegios</option>
                      </select>
                    </div>

                    {/* Tema Principal del Webinar */}
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-white/90">
                        Tema de Interés para el Webinar
                      </label>
                      <select
                        value={formData.webinarTopic}
                        onChange={(e) => setFormData({ ...formData, webinarTopic: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="Plataforma Integral Completa">Plataforma Integral Completa</option>
                        <option value="Cobranza Automatizada y CFDI 4.0">Cobranza Automatizada y CFDI 4.0</option>
                        <option value="Control Escolar, Boletas SEP y Kárdex">Control Escolar, Boletas SEP y Kárdex</option>
                        <option value="App Móvil con Identidad del Colegio">App Móvil con Identidad del Colegio</option>
                        <option value="Seguridad y Control de Salidas">Seguridad y Control de Salidas</option>
                      </select>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Fecha Preferida */}
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-white/90">
                        Fecha Sugerida para el Webinar
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4AF37]" />
                        <input
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Horario Preferido */}
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-white/90">
                        Horario Preferido
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="Mañana (9:00 AM - 12:00 PM)">Mañana (9:00 AM - 12:00 PM)</option>
                        <option value="Mediodía (12:00 PM - 3:00 PM)">Mediodía (12:00 PM - 3:00 PM)</option>
                        <option value="Tarde (3:00 PM - 6:00 PM)">Tarde (3:00 PM - 6:00 PM)</option>
                      </select>
                    </div>

                  </div>

                  {/* Comentarios o Requerimientos */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-white/90">
                      Preguntas o necesidades específicas (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej. Quisiéramos revisar cómo timbran complementos educativos y si migran alumnos desde Excel..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-black bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] shadow-xl flex items-center justify-center gap-2 border border-[#FDE382] transition-all transform hover:-translate-y-0.5"
                    >
                      <Video className="w-4 h-4" />
                      <span>{loading ? 'Registrando en base de datos...' : 'SOLICITAR & AGENDAR WEBINAR'}</span>
                    </button>
                    <p className="text-[11px] text-center text-white/60 mt-2">
                      Sin compromiso • Sesión privada por Zoom o Google Meet • Grabación disponible
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
