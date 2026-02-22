import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Download, CheckCircle2, Clock, ArrowLeft, X, FileText, ExternalLink, Volume2 } from "lucide-react";
import { courseFolders, type CourseFolder, type Lesson } from "@/data/courseData";

import coverEmpieza from "@/assets/cover-empieza.jpg";
import coverPdfReal from "@/assets/cover-pdf-real.jpg";
import coverVideo from "@/assets/cover-receitas-video.jpg";
import coverCalculadora from "@/assets/cover-calculadora.jpg";

import thumbClassicas from "@/assets/thumb-classicas.jpg";
import thumbChocolate from "@/assets/thumb-chocolate.jpg";
import thumbCaramelo from "@/assets/thumb-caramelo.jpg";
import thumbSalgadas from "@/assets/thumb-salgadas.jpg";
import thumbDecoracao from "@/assets/thumb-decoracao.jpg";
import heroBanner from "@/assets/hero-banner.jpg";
import thumbLecheNido from "@/assets/thumb-leche-nido.jpg";
import thumbLecheChoco from "@/assets/thumb-leche-choco.jpg";
import thumbTrufa from "@/assets/thumb-trufa.jpg";
import thumbOvomaltine from "@/assets/thumb-ovomaltine.jpg";
import thumbOreo from "@/assets/thumb-oreo.jpg";
import thumbNutella from "@/assets/thumb-nutella.jpg";
import thumbMani from "@/assets/thumb-mani.jpg";
import thumbFresa from "@/assets/thumb-fresa.jpg";
import thumbCoco from "@/assets/thumb-coco.jpg";
import thumbCocoChoco from "@/assets/thumb-coco-choco.jpg";

const folderCovers: Record<string, string> = {
  introducao: coverEmpieza,
  "receitas-pdf": coverPdfReal,
  "receitas-video": coverVideo,
  calculadora: coverCalculadora,
};

const thumbnailMap: Record<string, string> = {
  classicas: thumbClassicas,
  chocolate: thumbChocolate,
  caramelo: thumbCaramelo,
  salgadas: thumbSalgadas,
  decoracao: thumbDecoracao,
  "intro-welcome": heroBanner,
  "intro-materials": thumbClassicas,
  "intro-tips": thumbChocolate,
  "leche-nido": thumbLecheNido,
  "leche-choco": thumbLecheChoco,
  trufa: thumbTrufa,
  ovomaltine: thumbOvomaltine,
  oreo: thumbOreo,
  nutella: thumbNutella,
  mani: thumbMani,
  fresa: thumbFresa,
  coco: thumbCoco,
  "coco-choco": thumbCocoChoco,
};

// --- Folder Card (poster style) ---
const FolderCard = ({ folder, onClick }: { folder: CourseFolder; onClick: () => void }) => {
  const cover = folderCovers[folder.id] || heroBanner;

  return (
    <div
      onClick={onClick}
      className="group relative flex-shrink-0 w-[180px] md:w-[220px] cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-card">
        <img
          src={cover}
          alt={folder.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="font-display text-lg tracking-wider text-foreground">
            {folder.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {folder.lessons.length} clases
          </p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Lesson Card (inside folder view) ---
const LessonCard = ({ lesson, onPlay }: { lesson: Lesson; onPlay: (lesson: Lesson) => void }) => {
  const thumb = lesson.thumbnail ? thumbnailMap[lesson.thumbnail] : heroBanner;

  return (
    <div
      className="group relative flex-shrink-0 w-[240px] md:w-[280px] cursor-pointer"
      onClick={() => onPlay(lesson)}
    >
      <div className="relative aspect-video rounded-md overflow-hidden bg-card mb-2">
        <img
          src={thumb}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {lesson.type === "pdf" ? (
              <Download className="w-10 h-10 text-foreground drop-shadow-lg" />
            ) : lesson.type === "audio" ? (
              <Volume2 className="w-10 h-10 text-foreground drop-shadow-lg" />
            ) : (
              <Play className="w-12 h-12 text-foreground fill-foreground drop-shadow-lg" />
            )}
          </div>
        </div>
        {lesson.duration && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/80 text-foreground text-xs px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </div>
        )}
        {lesson.completed && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
          </div>
        )}
      </div>
      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
        {lesson.title}
      </h4>
      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
        {lesson.description}
      </p>
    </div>
  );
};

// --- Video Player Modal ---
const VideoPlayer = ({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center" onClick={onClose}>
    <div className="w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">{lesson.title}</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={lesson.videoUrl}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={lesson.title}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-3">{lesson.description}</p>
    </div>
  </div>
);

// --- Audio Player Modal ---
const AudioPlayer = ({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center" onClick={onClose}>
    <div className="w-full max-w-lg px-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">{lesson.title}</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Volume2 className="w-10 h-10 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground text-center">{lesson.description}</p>
        <audio controls autoPlay className="w-full" src="/audio-intro.mp3">
          Tu navegador no soporta audio.
        </audio>
      </div>
    </div>
  </div>
);

// --- PDF Viewer Modal ---
const PdfViewer = ({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-background flex flex-col">
    {/* Top bar */}
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm hidden sm:inline">Volver al menú</span>
        </button>
        <div className="h-5 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h2 className="font-display text-base md:text-lg tracking-wider text-foreground">{lesson.title}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="/PALOMITAS_REDONDITAS.pdf"
          download="PALOMITAS_REDONDITAS.pdf"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Descargar</span>
        </a>
        <a
          href="/PALOMITAS_REDONDITAS.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden sm:inline">Abrir</span>
        </a>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors ml-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
    {/* PDF embed */}
    <div className="flex-1 w-full">
      <iframe
        src="/PALOMITAS_REDONDITAS.pdf#toolbar=1&navpanes=0"
        className="w-full h-full border-0"
        title={lesson.title}
      />
    </div>
  </div>
);

// --- Scrollable Row ---
const ScrollRow = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <div className="group/row relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-background to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>
      <div ref={scrollRef} className="flex gap-3 px-4 md:px-12 overflow-x-auto scrollbar-hide">
        {children}
      </div>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-background to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>
    </div>
  );
};

// --- Folder Inside View (full screen replacement) ---
const FolderView = ({
  folder,
  onBack,
  onPlayLesson,
}: {
  folder: CourseFolder;
  onBack: () => void;
  onPlayLesson: (lesson: Lesson) => void;
}) => {
  const cover = folderCovers[folder.id] || heroBanner;

  return (
    <div className="animate-fade-in pb-16">
      {/* Hero banner for folder */}
      <div className="relative h-[200px] md:h-[280px] mb-6">
        <img src={cover} alt={folder.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Volver</span>
          </button>
          <h2 className="font-display text-2xl md:text-4xl tracking-wider text-foreground">
            {folder.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {folder.description} · {folder.lessons.length} clases
          </p>
        </div>
      </div>

      {/* Lessons grid */}
      <div className="px-4 md:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {folder.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="group cursor-pointer"
              onClick={() => onPlayLesson(lesson)}
            >
              <div className="relative aspect-video rounded-md overflow-hidden bg-card mb-2">
                <img
                  src={lesson.thumbnail ? thumbnailMap[lesson.thumbnail] : heroBanner}
                  alt={lesson.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {lesson.type === "pdf" ? (
                      <FileText className="w-8 h-8 text-foreground drop-shadow-lg" />
                    ) : lesson.type === "audio" ? (
                      <Volume2 className="w-8 h-8 text-foreground drop-shadow-lg" />
                    ) : (
                      <Play className="w-10 h-10 text-foreground fill-foreground drop-shadow-lg" />
                    )}
                  </div>
                </div>
                {lesson.duration && (
                  <div className="absolute bottom-1 right-1 flex items-center gap-1 bg-background/80 text-foreground text-[10px] px-1.5 py-0.5 rounded">
                    <Clock className="w-2.5 h-2.5" />
                    {lesson.duration}
                  </div>
                )}
                {lesson.completed && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
              <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {lesson.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {lesson.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Content Section ---
const ContentRows = () => {
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [playingLesson, setPlayingLesson] = useState<Lesson | null>(null);

  const activeFolder = openFolder ? courseFolders.find((f) => f.id === openFolder) : null;

  // If a folder is open, show full-screen folder view
  if (activeFolder) {
    return (
      <>
        <FolderView
          folder={activeFolder}
          onBack={() => setOpenFolder(null)}
          onPlayLesson={setPlayingLesson}
        />

        {/* Calculator embed */}
        {playingLesson?.id === "calc-1" && (
          <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center" onClick={() => setPlayingLesson(null)}>
            <div className="w-full max-w-5xl h-[85vh] px-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">Calculadora de Precios</h2>
                <button onClick={() => setPlayingLesson(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <iframe
                src="https://dulce-pop-calculadora.lovable.app"
                className="w-full h-full rounded-lg border border-border"
                title="Calculadora de Precios"
              />
            </div>
          </div>
        )}

        {/* PDF viewer */}
        {playingLesson?.type === "pdf" && (
          <PdfViewer lesson={playingLesson} onClose={() => setPlayingLesson(null)} />
        )}

        {/* Audio player */}
        {playingLesson?.type === "audio" && (
          <AudioPlayer lesson={playingLesson} onClose={() => setPlayingLesson(null)} />
        )}

        {/* Video player */}
        {playingLesson?.videoUrl && playingLesson?.id !== "calc-1" && (
          <VideoPlayer lesson={playingLesson} onClose={() => setPlayingLesson(null)} />
        )}
      </>
    );
  }

  return (
    <div className="-mt-16 relative z-10 pb-16">
      {/* Folder covers row */}
      <div className="mb-10">
        <h3 className="font-display text-xl md:text-2xl tracking-wider text-foreground px-4 md:px-12 mb-3">
          MÓDULOS DEL CURSO
        </h3>
        <ScrollRow>
          {courseFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => setOpenFolder(folder.id)}
            />
          ))}
        </ScrollRow>
      </div>
    </div>
  );
};

export default ContentRows;
