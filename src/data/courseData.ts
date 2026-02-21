import { BookOpen, FileText, Video } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration?: string;
  type: "video" | "pdf" | "text";
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
    title: "Introdução",
    description: "Conheça o curso e a professora Carmela Vega",
    icon: BookOpen,
    color: "primary",
    lessons: [
      {
        id: "intro-1",
        title: "Boas-vindas ao curso",
        description: "Carmela Vega dá as boas-vindas e apresenta o que você vai aprender",
        duration: "5 min",
        type: "video",
        completed: true,
        thumbnail: "intro-welcome",
      },
      {
        id: "intro-2",
        title: "Materiais necessários",
        description: "Lista completa de ingredientes e utensílios que você vai precisar",
        duration: "3 min",
        type: "text",
        completed: true,
        thumbnail: "intro-materials",
      },
      {
        id: "intro-3",
        title: "Dicas antes de começar",
        description: "Segredos e truques para palomitas perfeitas",
        duration: "8 min",
        type: "video",
        completed: false,
        thumbnail: "intro-tips",
      },
    ],
  },
  {
    id: "receitas-pdf",
    title: "Receitas em PDF",
    description: "Baixe as receitas completas em formato PDF",
    icon: FileText,
    color: "accent",
    lessons: [
      {
        id: "pdf-1",
        title: "Palomitas Clássicas",
        description: "A receita tradicional que todo mundo ama",
        type: "pdf",
        thumbnail: "classicas",
      },
      {
        id: "pdf-2",
        title: "Palomitas de Chocolate",
        description: "Versão irresistível com cobertura de chocolate",
        type: "pdf",
        thumbnail: "chocolate",
      },
      {
        id: "pdf-3",
        title: "Palomitas de Caramelo",
        description: "Doce e crocante, uma delícia!",
        type: "pdf",
        thumbnail: "caramelo",
      },
      {
        id: "pdf-4",
        title: "Palomitas Salgadas Gourmet",
        description: "Para quem prefere o sabor salgado refinado",
        type: "pdf",
        thumbnail: "salgadas",
      },
    ],
  },
  {
    id: "receitas-video",
    title: "Receitas em Vídeo",
    description: "Acompanhe o passo a passo com a Carmela",
    icon: Video,
    color: "primary",
    lessons: [
      {
        id: "video-1",
        title: "Leche nido (en polvo)",
        description: "Receita de palomitas com leite nido",
        duration: "10 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1lgyL-8qAmqjIl0udiD0-adcJWTQ5ETSN/preview",
      },
      {
        id: "video-2",
        title: "Leche nido y chocolate con leite",
        description: "Combinação perfeita de leite nido com chocolate",
        duration: "12 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1w1dNO_ic41QTA5N2WMVDOdvPCqJbaBZs/preview",
      },
      {
        id: "video-3",
        title: "Trufa de chocolate",
        description: "Palomitas com trufa de chocolate irresistível",
        duration: "15 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1H74PO3m5yOEXpzayUpCKWSqSoePoxNCY/preview",
      },
      {
        id: "video-4",
        title: "Ovomaltine / Milo",
        description: "Sabor especial com Ovomaltine",
        duration: "10 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1MmPq7sEGZwwZo69cPMKqiTuA-e2Zeo6B/preview",
      },
      {
        id: "video-5",
        title: "Oreo",
        description: "Palomitas com Oreo crocante",
        duration: "12 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1Nzjq0mGX_S1t1VLozedgygsaDvotGqlj/preview",
      },
      {
        id: "video-6",
        title: "Nutella",
        description: "A combinação perfeita com Nutella",
        duration: "10 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1ybNGQLAvabWUoXpMEFtJGlz_Nnm3KtQb/preview",
      },
      {
        id: "video-7",
        title: "Maní / Cocahuate",
        description: "Palomitas com amendoim",
        duration: "10 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1uyVXIg5tL9sV9NO2sBVrDNWpRjARKnPE/preview",
      },
      {
        id: "video-8",
        title: "Fresa",
        description: "Sabor morango delicioso",
        duration: "10 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1PgRExc2N4e5aZHZKJrydCsRHtQvdU04l/preview",
      },
      {
        id: "video-9",
        title: "Cocada / Coco",
        description: "Palomitas com coco ralado",
        duration: "10 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1LZKSf6jFq2TOP8OVUYjrkGK6P0mUE2qd/preview",
      },
      {
        id: "video-10",
        title: "Coco y chocolate con leite",
        description: "Coco com chocolate ao leite",
        duration: "12 min",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1u2FInwMpt159rjLLUId-y2U6R1KgOENf/preview",
      },
    ],
  },
];
