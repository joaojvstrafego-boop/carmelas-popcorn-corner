import { Play, Info } from "lucide-react";
import heroImg from "@/assets/hero-netflix.jpg";

const NetflixHero = () => {
  return (
    <div className="relative w-full h-[85vh] min-h-[500px]">
      <img
        src={heroImg}
        alt="Palomitas Redonditas"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      {/* Content */}
      <div className="absolute bottom-[20%] left-4 md:left-12 max-w-lg z-10 animate-fade-in">
        <h1 className="font-display text-5xl md:text-7xl tracking-wider text-foreground mb-2">
          PALOMITAS REDONDITAS
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mb-1 font-medium">
          Com a professora Carmela Vega
        </p>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-md">
          Domine a arte das palomitas perfeitas. Receitas exclusivas, técnicas profissionais e segredos que vão transformar suas palomitas.
        </p>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded font-semibold text-sm hover:bg-foreground/80 transition-colors">
            <Play className="w-5 h-5 fill-current" />
            Assistir
          </button>
          <button className="flex items-center gap-2 bg-muted/80 text-foreground px-6 py-2.5 rounded font-semibold text-sm hover:bg-muted transition-colors">
            <Info className="w-5 h-5" />
            Mais Informações
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetflixHero;
