import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Download, CheckCircle2, Clock, ArrowLeft, X } from "lucide-react";
import { courseFolders, type CourseFolder, type Lesson } from "@/data/courseData";

import coverIntro from "@/assets/cover-introducao.jpg";
import coverPdf from "@/assets/cover-receitas-pdf.jpg";
import coverVideo from "@/assets/cover-receitas-video.jpg";

import thumbClassicas from "@/assets/thumb-classicas.jpg";
import thumbChocolate from "@/assets/thumb-chocolate.jpg";
import thumbCaramelo from "@/assets/thumb-caramelo.jpg";
import thumbSalgadas from "@/assets/thumb-salgadas.jpg";
import thumbDecoracao from "@/assets/thumb-decoracao.jpg";
import heroBanner from "@/assets/hero-banner.jpg";

const folderCovers: Record<string, string> = {
  introducao: coverIntro,
  "receitas-pdf": coverPdf,
  "receitas-video": coverVideo,
  calculadora: coverPdf,
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
        {/* Hover play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Lesson Card (horizontal, shown inside open folder) ---
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

// --- Main Content Section ---
const ContentRows = () => {
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [playingLesson, setPlayingLesson] = useState<Lesson | null>(null);

  const activeFolder = openFolder ? courseFolders.find((f) => f.id === openFolder) : null;

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
              onClick={() => setOpenFolder(folder.id === openFolder ? null : folder.id)}
            />
          ))}
        </ScrollRow>
      </div>

      {/* Open folder content */}
      {activeFolder && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 px-4 md:px-12 mb-3">
            <button
              onClick={() => setOpenFolder(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-display text-xl md:text-2xl tracking-wider text-foreground">
              {activeFolder.title}
            </h3>
            <span className="text-xs text-muted-foreground">
              {activeFolder.lessons.length} clases
            </span>
          </div>
          <ScrollRow>
            {activeFolder.lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} onPlay={setPlayingLesson} />
            ))}
          </ScrollRow>
        </div>
      )}

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

      {/* PDF viewer modal */}
      {playingLesson?.type === "pdf" && (
        <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center" onClick={() => setPlayingLesson(null)}>
          <div className="w-full max-w-5xl h-[85vh] px-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">{playingLesson.title}</h2>
              <button onClick={() => setPlayingLesson(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <iframe
              src="/PALOMITAS_REDONDITAS.pdf"
              className="w-full h-full rounded-lg border border-border"
              title={playingLesson.title}
            />
          </div>
        </div>
      )}

      {/* Video player modal */}
      {playingLesson?.videoUrl && playingLesson?.id !== "calc-1" && (
        <VideoPlayer lesson={playingLesson} onClose={() => setPlayingLesson(null)} />
      )}
    </div>
  );
};

export default ContentRows;
