import { BookOpen, FileText, Video } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration?: string;
  type: "video" | "pdf" | "text";
  completed?: boolean;
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
      },
      {
        id: "intro-2",
        title: "Materiais necessários",
        description: "Lista completa de ingredientes e utensílios que você vai precisar",
        duration: "3 min",
        type: "text",
        completed: true,
      },
      {
        id: "intro-3",
        title: "Dicas antes de começar",
        description: "Segredos e truques para palomitas perfeitas",
        duration: "8 min",
        type: "video",
        completed: false,
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
      },
      {
        id: "pdf-2",
        title: "Palomitas de Chocolate",
        description: "Versão irresistível com cobertura de chocolate",
        type: "pdf",
      },
      {
        id: "pdf-3",
        title: "Palomitas de Caramelo",
        description: "Doce e crocante, uma delícia!",
        type: "pdf",
      },
      {
        id: "pdf-4",
        title: "Palomitas Salgadas Gourmet",
        description: "Para quem prefere o sabor salgado refinado",
        type: "pdf",
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
        title: "Palomitas Clássicas - Passo a Passo",
        description: "Aprenda a fazer as palomitas redonditas originais",
        duration: "15 min",
        type: "video",
      },
      {
        id: "video-2",
        title: "Palomitas de Chocolate",
        description: "Técnica de cobertura perfeita com a Carmela",
        duration: "18 min",
        type: "video",
      },
      {
        id: "video-3",
        title: "Palomitas de Caramelo",
        description: "O segredo do caramelo crocante",
        duration: "20 min",
        type: "video",
      },
      {
        id: "video-4",
        title: "Palomitas Salgadas Gourmet",
        description: "Receita exclusiva da Carmela",
        duration: "12 min",
        type: "video",
      },
      {
        id: "video-5",
        title: "Decoração e Embalagem",
        description: "Como embalar para presente ou vender",
        duration: "10 min",
        type: "video",
      },
    ],
  },
];
