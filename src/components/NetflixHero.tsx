import heroImg from "@/assets/hero-netflix.jpg";

const NetflixHero = () => {
  return (
    <div className="relative w-full h-[70vh] min-h-[400px]">
      <img
        src={heroImg}
        alt="Palomitas Redonditas"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      <div className="absolute bottom-[20%] left-4 md:left-12 max-w-lg z-10 animate-fade-in">
        <h1 className="font-display text-5xl md:text-7xl tracking-wider text-foreground mb-2">
          PALOMITAS REDONDITAS
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mb-1 font-medium">
          Com a professora Carmela Vega
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          Domine a arte das palomitas perfeitas. Receitas exclusivas, técnicas profissionais e segredos que vão transformar suas palomitas.
        </p>
      </div>
    </div>
  );
};

export default NetflixHero;
