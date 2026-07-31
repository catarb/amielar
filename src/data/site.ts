import {
  CalendarDays,
  Clock3,
  Ear,
  Eye,
  Flower2,
  HeartHandshake,
  Leaf,
  LucideIcon,
  ShoppingBag,
  Sparkles,
  Wind,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Product = {
  name: string;
  description: string;
  image: string;
  imagePosition?: string;
  whatsappMessage: string;
};

export type GalleryItem = {
  title: string;
  image: string;
  size: "wide" | "tall" | "square";
  note?: string;
  imagePosition?: string;
};

export type Reservation = {
  client: string;
  email: string;
  date: string;
  time: string;
  session: string;
  status: "Confirmada" | "Pendiente" | "Cancelada";
};

export const primaryNavLinks = [
  { label: "Nosotros", href: "#historia" },
  { label: "Api-inhalación", href: "#api-inhalacion" },
  { label: "Productos", href: "#productos" },
  { label: "Galería", href: "#galeria" },
  { label: "Preguntas frecuentes", href: "#faq" },
  { label: "Visítanos", href: "#visitanos" },
];

export const mobileNavLinks = [
  { label: "Nosotros", href: "#historia" },
  { label: "Api-inhalación", href: "#api-inhalacion" },
  { label: "Productos de la colmena", href: "#productos" },
  { label: "Galería", href: "#galeria" },
  { label: "Preguntas frecuentes", href: "#faq" },
  { label: "Visítanos en Arata", href: "#visitanos" },
];

export const featureCards: Feature[] = [
  {
    title: "Colmena",
    description: "La colmena es nuestro punto de partida: más de 30 años de experiencia apícola, aprendizaje constante y respeto por el ritmo de las abejas.",
    icon: Flower2,
  },
  {
    title: "Naturaleza",
    description: "Aire puro, horizonte infinito y una ruralidad silenciosa que define el ritmo de la experiencia.",
    icon: Leaf,
  },
  {
    title: "Bienestar",
    description:
      "Transformamos más de 30 años de conocimiento apícola en una experiencia sensorial pionera en Argentina, que invita a conectar con las abejas, la naturaleza y el propio bienestar respiratorio.",
    icon: Sparkles,
  },
  {
    title: "Historia familiar",
    description: "Todo comenzó con Hugo Pablo Tosso y sus primeras 25 colmenas. Hoy, una segunda generación honra ese legado y se anima a dar un paso más dando vida a Amielar.",
    icon: HeartHandshake,
  },
];

export const aboutStoryCards: Feature[] = [
  {
    title: "Colmenares Don Pablo",
    description: "Todo comenzó cuando Hugo Pablo Tosso decidió iniciarse en la apicultura con apenas 25 colmenas, dando origen a Colmenares Don Pablo.",
    icon: Flower2,
  },
  {
    title: "Un legado familiar",
    description:
      "Con el paso de los años, el emprendimiento se consolidó no solo por la producción de miel, sino también por la crianza y venta de reinas y celdas, convirtiéndose en un referente para numerosos apicultores de la región.",
    icon: Sparkles,
  },
  {
    title: "Nace AMIELAR",
    description:
      "Ese legado fue continuado por su hijo, Pablo Andrés Tosso, dando lugar a una segunda generación dedicada a la apicultura y sentando las bases de lo que hoy es AMIELAR.",
    icon: HeartHandshake,
  },
];

export const apiBenefits: Feature[] = [
  {
    title: "Observar",
    description: "A través de dos colmenas vidriadas especialmente preparadas, descubrí de cerca la organización de las abejas, su relación con el ambiente y el vínculo que construyen con las personas.",
    icon: Eye,
  },
  {
    title: "Respirar",
    description: "El aire de la colmena llega mediante un sistema que permite inhalarlo sin contacto directo con las abejas. Una invitación a respirar lento, hacer una pausa y reconectar con el propio ritmo.",
    icon: Wind,
  },
  {
    title: "Escuchar",
    description: "El zumbido de la colonia se combina con un relato guiado que acompaña la respiración y conduce la experiencia hacia un estado de calma, atención y conexión.",
    icon: Ear,
  },
];

export const products: Product[] = [
  {
    name: "Miel pura",
    description: "Cosecha dorada, floral y transparente, pensada para una mesa simple y ritual.",
    image: "/A_4.jpeg",
    imagePosition: "object-[50%_72%] md:object-[50%_48%]",
    whatsappMessage: "¡Hola! Me gustaría recibir información sobre la Miel Pura de AMIELAR.",
  },
  {
    name: "Propóleos",
    description: "Extracto noble para acompañar momentos de cuidado y bienestar cotidiano.",
    image: "/A_6.jpeg",
    whatsappMessage: "¡Hola! Me gustaría recibir información sobre los Propóleos de AMIELAR.",
  },
  {
    name: "Panal de miel",
    description: "Textura natural y sabor directo al origen de la colmena.",
    image: "/A_5.jpeg",
    whatsappMessage: "¡Hola! Me gustaría recibir información sobre el Panal de Miel de AMIELAR.",
  },
  {
    name: "Bálsamo labial",
    description: "Cera de abejas y terminación artesanal en una pieza pequeña y premium.",
    image: "/A_7.png",
    whatsappMessage: "¡Hola! Me gustaría recibir información sobre el Bálsamo Labial de AMIELAR.",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    title: "Cabaña de api-inhalación",
    image: "/A_8.png",
    size: "wide",
    note: "Exterior y llegada",
    imagePosition: "object-[58%_24%] md:object-[58%_26%]",
  },
  {
    title: "Paisaje pampeano",
    image: "/A_10.png",
    size: "tall",
    note: "Horizonte y silencio",
    imagePosition: "object-[50%_49%] md:object-[50%_48%]",
  },
  {
    title: "Interior de experiencia",
    image: "/A_11.jpeg",
    size: "square",
    note: "Calma y ritual",
    imagePosition: "object-[38%_58%] md:object-[40%_56%]",
  },
  {
    title: "Productos de la colmena",
    image: "/A_12.png",
    size: "square",
    note: "Materia prima noble",
    imagePosition: "object-[50%_62%] md:object-[50%_60%]",
  },
  {
    title: "Apiario y colmenas",
    image: "/A_9.png",
    size: "wide",
    note: "Origen del proyecto",
    imagePosition: "object-[50%_56%] md:object-[50%_54%]",
  },
];

export const adminMetrics = [
  { label: "Reservas hoy", value: "3", tone: "sage", detail: "+2 hoy", icon: CalendarDays },
  { label: "Pendientes de confirmar", value: "5", tone: "rose", detail: "Requiere atencion", icon: Clock3 },
  { label: "Disponibilidad", value: "80%", tone: "sand", detail: "Optimo", icon: ShoppingBag },
];

export const reservations: Reservation[] = [
  {
    client: "Elena Garcia",
    email: "administracion@amielarargentina.com",
    date: "15 May, 2024",
    time: "10:30 AM",
    session: "Api-inhalacion",
    status: "Confirmada",
  },
  {
    client: "Marcos Mendoza",
    email: "administracion@amielarargentina.com",
    date: "15 May, 2024",
    time: "03:00 PM",
    session: "Api-inhalacion",
    status: "Pendiente",
  },
  {
    client: "Lucia Fernandez",
    email: "administracion@amielarargentina.com",
    date: "16 May, 2024",
    time: "09:00 AM",
    session: "Visita guiada",
    status: "Confirmada",
  },
  {
    client: "Javier Rojas",
    email: "administracion@amielarargentina.com",
    date: "16 May, 2024",
    time: "11:00 AM",
    session: "Api-inhalacion",
    status: "Cancelada",
  },
];
