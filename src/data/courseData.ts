import { BookOpen, Calculator, FileText, Video } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration?: string;
  type: "video" | "pdf" | "text" | "audio";
  completed?: boolean;
  thumbnail?: string;
  videoUrl?: string;
}

export interface CourseFolder {
  id: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  lessons: Lesson[];
  color: string;
}

export const courseFolders: CourseFolder[] = [
  {
    id: "introducao",
    title: "Empieza por aquí",
    description: "Conoce el curso y a la profesora Carmela Vega",
    icon: BookOpen,
    color: "primary",
    lessons: [
      {
        id: "intro-audio",
        title: "Escucha este audio antes de comenzar",
        description: "Mensaje especial de bienvenida de Carmela Vega",
        duration: "2 min",
        type: "audio",
        completed: false,
        thumbnail: "intro-welcome",
      },
      {
        id: "intro-1",
        title: "Bienvenida al curso",
        description: "Carmela Vega te da la bienvenida y presenta lo que vas a aprender",
        duration: "5 min",
        type: "video",
        completed: true,
        thumbnail: "intro-welcome",
      },
      {
        id: "intro-2",
        title: "Materiales necesarios",
        description: "Lista completa de ingredientes y utensilios que vas a necesitar",
        duration: "3 min",
        type: "text",
        completed: true,
        thumbnail: "intro-materials",
      },
      {
        id: "intro-3",
        title: "Consejos antes de empezar",
        description: "Secretos y trucos para palomitas perfectas",
        duration: "8 min",
        type: "video",
        completed: false,
        thumbnail: "intro-tips",
      },
    ],
  },
  {
    id: "receitas-pdf",
    title: "Recetas en PDF",
    description: "Descarga las recetas completas en formato PDF",
    icon: FileText,
    color: "accent",
    lessons: [
      {
        id: "pdf-1",
        title: "Recetas Completas",
        description: "Todas las recetas de palomitas gourmet en un solo PDF",
        type: "pdf",
        thumbnail: "classicas",
      },
    ],
  },
  {
    id: "receitas-video",
    title: "Recetas en Video",
    description: "Sigue el paso a paso con Carmela",
    icon: Video,
    color: "primary",
    lessons: [
      {
        id: "video-1",
        title: "Leche nido (en polvo)",
        description: "Receta de palomitas con leche nido",
        duration: "10 min",
        type: "video",
        thumbnail: "leche-nido",
        videoUrl: "https://drive.google.com/file/d/1lgyL-8qAmqjIl0udiD0-adcJWTQ5ETSN/preview",
      },
      {
        id: "video-2",
        title: "Leche nido y chocolate con leche",
        description: "Combinación perfecta de leche nido con chocolate",
        duration: "12 min",
        type: "video",
        thumbnail: "leche-choco",
        videoUrl: "https://drive.google.com/file/d/1w1dNO_ic41QTA5N2WMVDOdvPCqJbaBZs/preview",
      },
      {
        id: "video-3",
        title: "Trufa de chocolate",
        description: "Palomitas con trufa de chocolate irresistible",
        duration: "15 min",
        type: "video",
        thumbnail: "trufa",
        videoUrl: "https://drive.google.com/file/d/1H74PO3m5yOEXpzayUpCKWSqSoePoxNCY/preview",
      },
      {
        id: "video-4",
        title: "Ovomaltine / Milo",
        description: "Sabor especial con Ovomaltine",
        duration: "10 min",
        type: "video",
        thumbnail: "ovomaltine",
        videoUrl: "https://drive.google.com/file/d/1MmPq7sEGZwwZo69cPMKqiTuA-e2Zeo6B/preview",
      },
      {
        id: "video-5",
        title: "Oreo",
        description: "Palomitas con Oreo crujiente",
        duration: "12 min",
        type: "video",
        thumbnail: "oreo",
        videoUrl: "https://drive.google.com/file/d/1Nzjq0mGX_S1t1VLozedgygsaDvotGqlj/preview",
      },
      {
        id: "video-6",
        title: "Nutella",
        description: "La combinación perfecta con Nutella",
        duration: "10 min",
        type: "video",
        thumbnail: "nutella",
        videoUrl: "https://drive.google.com/file/d/1ybNGQLAvabWUoXpMEFtJGlz_Nnm3KtQb/preview",
      },
      {
        id: "video-7",
        title: "Maní / Cacahuate",
        description: "Palomitas con maní",
        duration: "10 min",
        type: "video",
        thumbnail: "mani",
        videoUrl: "https://drive.google.com/file/d/1uyVXIg5tL9sV9NO2sBVrDNWpRjARKnPE/preview",
      },
      {
        id: "video-8",
        title: "Fresa",
        description: "Sabor fresa delicioso",
        duration: "10 min",
        type: "video",
        thumbnail: "fresa",
        videoUrl: "https://drive.google.com/file/d/1PgRExc2N4e5aZHZKJrydCsRHtQvdU04l/preview",
      },
      {
        id: "video-9",
        title: "Cocada / Coco",
        description: "Palomitas con coco rallado",
        duration: "10 min",
        type: "video",
        thumbnail: "coco",
        videoUrl: "https://drive.google.com/file/d/1LZKSf6jFq2TOP8OVUYjrkGK6P0mUE2qd/preview",
      },
      {
        id: "video-10",
        title: "Coco y chocolate con leche",
        description: "Coco con chocolate con leche",
        duration: "12 min",
        type: "video",
        thumbnail: "coco-choco",
        videoUrl: "https://drive.google.com/file/d/1u2FInwMpt159rjLLUId-y2U6R1KgOENf/preview",
      },
    ],
  },
  {
    id: "calculadora",
    title: "Calculadora",
    description: "Calcula el precio de tus palomitas",
    icon: Calculator,
    color: "accent",
    lessons: [
      {
        id: "calc-1",
        title: "Calculadora de Precios",
        description: "Herramienta para calcular el precio ideal de tus palomitas",
        type: "text",
      },
    ],
  },
];
