import {
  CalendarDays,
  Clock3,
  Flower2,
  HeartHandshake,
  Leaf,
  LucideIcon,
  MapPinned,
  ShieldCheck,
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
    description: "Más de 30 años aprendiendo de las abejas y transformando la experiencia de una familia de apicultores en bienestar, naturaleza y salud.",
    icon: Flower2,
  },
  {
    title: "Naturaleza",
    description: "Aire puro, horizonte infinito y una ruralidad silenciosa que define el ritmo de la experiencia.",
    icon: Leaf,
  },
  {
    title: "Bienestar",
    description: "AMIELAR nace del deseo de compartir todo ese conocimiento a través de la api-inhalación, productos naturales y una experiencia única en contacto con la naturaleza.",
    icon: Sparkles,
  },
  {
    title: "Historia familiar",
    description: "Todo comenzó con Hugo Pablo Tosso y sus primeras 25 colmenas. Hoy, junto a Pablo Andrés Tosso, una segunda generación continúa ese legado y da vida a AMIELAR.",
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
    title: "Respiración consciente",
    description: "Sesiones lentas para bajar el ritmo y escuchar el cuerpo.",
    icon: Wind,
  },
  {
    title: "Relajación profunda",
    description: "El entorno acompaña con temperatura noble, aroma suave y pausa real.",
    icon: ShieldCheck,
  },
  {
    title: "Naturaleza viva",
    description: "Propóleos, cera y aceites esenciales en un microclima único.",
    icon: Leaf,
  },
  {
    title: "Silencio rural",
    description: "Un refugio delicado, lejos del ruido y cerca del horizonte pampeano.",
    icon: MapPinned,
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

export const faqs = [
  {
    question: "¿Qué es la api-inhalación?",
    answer:
      "Es una experiencia de bienestar que permite respirar el aire vivo de la colmena, naturalmente cargado de propóleos, cera y aromas esenciales.",
  },
  {
    question: "¿Dónde se realiza la experiencia?",
    answer:
      "Se vive en Arata, La Pampa, dentro de una cabaña pensada para sostener calma, temperatura amable y contacto con el paisaje.",
  },
  {
    question: "¿Cuánto dura una sesión?",
    answer:
      "La referencia de esta propuesta visual contempla sesiones de 45 a 60 minutos, con horarios coordinados según disponibilidad.",
  },
  {
    question: "¿Puedo comprar productos de la colmena?",
    answer:
      "Sí. La experiencia convive con una línea artesanal de miel, propóleos, panal y productos de cuidado.",
  },
  {
    question: "¿Cómo reservo un turno?",
    answer:
      "Podés completar el formulario de la web o escribir por WhatsApp para coordinar fecha, horario y detalles de la visita.",
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
