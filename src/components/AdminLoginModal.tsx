import React, { useState, useEffect } from 'react';
import { MyCollegeLogo } from './MyCollegeLogo';
import { 
  Lock, 
  KeyRound, 
  User, 
  ShieldCheck, 
  X, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Link as LinkIcon, 
  MousePointerClick, 
  Keyboard, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Palette
} from 'lucide-react';
import { verifyAdminCredentials } from '../firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('desingMC');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [showBackdoorGuide, setShowBackdoorGuide] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutSeconds > 0) {
      timer = setTimeout(() => {
        setLockoutSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isValid = await verifyAdminCredentials(username, password);

      if (isValid) {
        if (rememberMe) {
          localStorage.setItem('my_college_admin_auth', 'true');
        } else {
          sessionStorage.setItem('my_college_admin_auth', 'true');
        }
        setPassword('');
        setFailedAttempts(0);
        onSuccess();
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 4) {
          setLockoutSeconds(30);
          setError('Demasiados intentos fallidos. Bloqueo temporal por 30 segundos.');
        } else {
          setError(`Credenciales incorrectas (Usuario o contraseña inválida). Intento ${nextAttempts} de 4.`);
        }
      }
    } catch (err) {
      console.error('Error verifying admin credentials:', err);
      if (username.trim() === 'desingMC' && password.trim() === 'mc2709') {
        if (rememberMe) {
          localStorage.setItem('my_college_admin_auth', 'true');
        } else {
          sessionStorage.setItem('my_college_admin_auth', 'true');
        }
        setPassword('');
        onSuccess();
      } else {
        setError('Error al conectar con Firestore.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillCredentials = () => {
    setUsername('desingMC');
    setPassword('mc2709');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051226]/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#081D3C] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#0B2545] text-white hover:text-[#D4AF37] border border-[#D4AF37]/30 transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Emblem */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <MyCollegeLogo size="md" layout="stacked" showText={true} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#0B2545] text-[#F5B82E] border border-[#D4AF37]/50 mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>ACCESO EXCLUSIVO: MODO DISEÑO & EDICIÓN</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Entrada Trasera My College
          </h3>
          <p className="text-xs text-white/80 mt-1 max-w-sm mx-auto">
            Ingresa para editar todos los apartados, reordenar secciones y fijar el diseño en la base de datos de Firestore.
          </p>
        </div>

        {/* Credentials Pill Quick-Fill */}
        <div 
          onClick={handleAutofillCredentials}
          className="mb-6 p-3.5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] cursor-pointer transition-all flex items-center justify-between group"
          title="Haz clic para autocompletar tus credenciales"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37] text-[#081D3C] flex items-center justify-center font-bold font-serif shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <span>Credenciales Directivas:</span>
                <span className="text-[#F5B82E] font-mono font-bold">desingMC</span>
              </div>
              <div className="text-white/70 text-[11px]">
                Contraseña asignada: <span className="font-mono text-[#D4AF37] font-bold">mc2709</span>
              </div>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#081D3C] text-[#F5B82E] font-extrabold border border-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:text-[#081D3C] transition-colors">
            Autocompletar
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-xs font-bold text-white/90 mb-1.5">
              Usuario de Edición *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4AF37]" />
              <input
                type="text"
                required
                autoFocus
                placeholder="desingMC"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-white/90 mb-1.5">
              Contraseña *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4AF37]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={lockoutSeconds > 0 || loading}
                placeholder="mc2709"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-white/60 hover:text-white"
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-xs text-white/80">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-[#0B2545] border-[#D4AF37]/50 text-[#D4AF37] focus:ring-[#D4AF37]"
            />
            <label htmlFor="rememberMe" className="cursor-pointer select-none">
              Recordar sesión en este equipo (acceso inmediato)
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || lockoutSeconds > 0}
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold shadow-lg flex items-center justify-center gap-2 transition-all ${
                lockoutSeconds > 0
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {lockoutSeconds > 0
                  ? `Bloqueo activo: espera ${lockoutSeconds}s`
                  : loading
                  ? 'Validando con Firestore...'
                  : 'Entrar a Modo Diseño & Edición'}
              </span>
            </button>
          </div>
        </form>

        {/* Collapsible Backdoor URL & Methods Guide */}
        <div className="mt-6 pt-4 border-t border-[#D4AF37]/25">
          <button
            type="button"
            onClick={() => setShowBackdoorGuide(!showBackdoorGuide)}
            className="w-full flex items-center justify-between text-xs text-[#D4AF37] hover:text-[#F5B82E] font-bold py-1"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Accesos por URL Secreta y Atajos Rápidos
            </span>
            {showBackdoorGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showBackdoorGuide && (
            <div className="mt-3 space-y-2.5 text-xs text-white/75 bg-[#0B2545]/80 p-3.5 rounded-xl border border-[#D4AF37]/30">
              <div className="flex items-start gap-2">
                <LinkIcon className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">URL Secreta Directa:</strong> Accede agregando <code className="text-[#F5B82E] font-bold">?secret=desingMC</code> o <code className="text-[#F5B82E] font-bold">?admin=desingMC</code> o <code className="text-[#F5B82E] font-bold">#desingMC</code> a la URL.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MousePointerClick className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Gesto Secreto en Escudo:</strong> Haz 3 clics seguidos en el Escudo de My College en la barra superior.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Keyboard className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Atajo de Teclado:</strong> Presiona <kbd className="px-1.5 py-0.5 rounded bg-[#081D3C] text-[#F5B82E] font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-[#081D3C] text-[#F5B82E] font-mono text-[10px]">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-[#081D3C] text-[#F5B82E] font-mono text-[10px]">A</kbd>.
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
