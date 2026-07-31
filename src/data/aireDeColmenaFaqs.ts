export type AireDeColmenaFaq = {
  id: string;
  question: string;
  answer: string;
  featured: boolean;
};

export const aireDeColmenaFaqs: AireDeColmenaFaq[] = [
  {
    id: "contacto-con-abejas",
    question: "¿Hay contacto con las abejas?",
    answer:
      "No. La experiencia se realiza dentro de la cabaña, sin contacto directo con las abejas.",
    featured: true,
  },
  {
    id: "participacion-de-ninos",
    question: "¿Pueden participar niños?",
    answer:
      "Sí. Está recomendada para niños mayores de 5 años, acompañados por una persona adulta.",
    featured: true,
  },
  {
    id: "alergias",
    question: "¿Qué sucede si soy alérgico?",
    answer:
      "Si tenés alergia a las abejas o a productos de la colmena, consultá previamente con tu médico y avisá al momento de reservar.",
    featured: false,
  },
  {
    id: "lluvia",
    question: "¿La experiencia se realiza con lluvia?",
    answer:
      "Sí, siempre que las condiciones climáticas permitan acceder al lugar con seguridad. En caso de tormenta fuerte, el turno puede reprogramarse.",
    featured: false,
  },
  {
    id: "ropa-recomendada",
    question: "¿Qué ropa conviene llevar?",
    answer: "Ropa cómoda y calzado cerrado, adecuado para un entorno rural.",
    featured: false,
  },
  {
    id: "duracion",
    question: "¿Cuánto dura?",
    answer:
      "La experiencia regular dura aproximadamente 1 hora. Las experiencias especiales pueden tener otra duración.",
    featured: true,
  },
  {
    id: "personas-por-turno",
    question: "¿Cuántas personas participan por turno?",
    answer:
      "Participan hasta 2 personas. Son cupos reducidos para preservar la tranquilidad y la calidad de la experiencia.",
    featured: false,
  },
  {
    id: "tratamiento-medico",
    question: "¿La api-inhalación es un tratamiento médico?",
    answer:
      "No. Es una experiencia sensorial y de bienestar, y no reemplaza diagnósticos ni tratamientos médicos.",
    featured: true,
  },
  {
    id: "como-llegar",
    question: "¿Cómo llego desde Santa Rosa?",
    answer:
      "AMIELAR está en Arata, La Pampa, a 120 km de la capital pampeana. Al confirmar la reserva enviamos la ubicación y las indicaciones para llegar.",
    featured: false,
  },
  {
    id: "cancelacion",
    question: "¿Qué sucede si necesito cancelar?",
    answer:
      "Pedimos avisar con anticipación para poder reprogramar el turno, sujeto a disponibilidad.",
    featured: false,
  },
];

export const featuredAireDeColmenaFaqs = aireDeColmenaFaqs.filter(
  (item) => item.featured,
);
