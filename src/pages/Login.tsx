import { useState } from "react";
import { ChefHat, Smartphone, Share, PlusSquare, MoreVertical, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      localStorage.setItem("palomitas_logged", "true");
      onLogin();
    } else {
      setError("Contraseña incorrecta. Intenta con: 1234");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <ChefHat className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="font-display text-4xl tracking-wider text-foreground">
          PALOMITAS
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-card rounded-xl p-6 border border-border mb-8">
        <h2 className="font-display text-2xl text-center text-foreground mb-6">
          INICIAR SESIÓN
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            required
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
        <p className="text-muted-foreground text-xs text-center mt-4">
          🔑 La contraseña es: <span className="text-foreground font-semibold">1234</span>
        </p>
      </div>

      {/* Install Instructions */}
      <div className="w-full max-w-sm space-y-4">
        <h3 className="font-display text-xl text-center text-foreground">
          📲 CÓMO INSTALAR ESTA APP
        </h3>

        {/* iPhone */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h4 className="font-display text-lg text-primary mb-2 flex items-center gap-2">
            🍎 iPhone / iPad (Safari)
          </h4>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Abre esta página en <span className="text-foreground font-medium">Safari</span></li>
            <li className="flex items-start gap-1">
              <span>2.</span>
              <span>Toca el botón <Share className="w-4 h-4 inline text-foreground" /> <span className="text-foreground font-medium">Compartir</span> (abajo de la pantalla)</span>
            </li>
            <li className="flex items-start gap-1">
              <span>3.</span>
              <span>Busca y toca <PlusSquare className="w-4 h-4 inline text-foreground" /> <span className="text-foreground font-medium">"Agregar a pantalla de inicio"</span></span>
            </li>
            <li>Toca <span className="text-foreground font-medium">"Agregar"</span> y ¡listo!</li>
          </ol>
        </div>

        {/* Android */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h4 className="font-display text-lg text-primary mb-2 flex items-center gap-2">
            🤖 Android (Chrome)
          </h4>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Abre esta página en <span className="text-foreground font-medium">Chrome</span></li>
            <li className="flex items-start gap-1">
              <span>2.</span>
              <span>Toca los <MoreVertical className="w-4 h-4 inline text-foreground" /> <span className="text-foreground font-medium">3 puntos</span> (arriba a la derecha)</span>
            </li>
            <li className="flex items-start gap-1">
              <span>3.</span>
              <span>Toca <Download className="w-4 h-4 inline text-foreground" /> <span className="text-foreground font-medium">"Instalar app"</span> o <span className="text-foreground font-medium">"Agregar a pantalla de inicio"</span></span>
            </li>
            <li>Confirma y ¡listo!</li>
          </ol>
        </div>

        <p className="text-muted-foreground text-xs text-center pb-8">
          Así podrás abrir la app como si fuera una app de verdad 🎉
        </p>
      </div>
    </div>
  );
};

export default Login;
