export const assetPaths = {
  logo: "/assets/logo_elco_dealer_primary.png",
  hardware: "/assets/prototipo_montaje_clean.png",
  prototype: "/assets/prototipo_montaje_clean.png",
  productHero: "/assets/29bd5fa7-9124-4cd3-b9d7-23cf0cb7443f.png",
  platformVideo: "/assets/giro_plataforma.mp4",
  cardFeedVideo: "/assets/repartir_cartas.mp4",
  manual: "/assets/manual_usuario.pdf",
  softwareGuide: "/assets/guia_software.pdf",
};

export const contactInfo = {
  phone: "+34 900 123 456",
  supportEmail: "support@elcodealer.com",
  helloEmail: "hello@elcodealer.com",
  schedule: "Lunes a viernes, 09:00-18:00",
};

export const highlights = [
  {
    eyebrow: "01",
    title: "Reparto automático",
    text: "Secuencia de giro y expulsión planteada para distribuir cartas entre jugadores en una demostración guiada.",
  },
  {
    eyebrow: "02",
    title: "Sensado físico",
    text: "Detección digital de cartas y referencia HOME para controlar el avance sin depender de tiempos fijos.",
  },
  {
    eyebrow: "03",
    title: "Control por FSM",
    text: "Arquitectura por máquina de estados, eventos priorizados y timeouts de seguridad para pruebas de subsistemas.",
  },
  {
    eyebrow: "04",
    title: "Diseño demostrativo",
    text: "Interfaz visual y narrativa casino-tech pensadas para enseñar el concepto de forma clara, atractiva y coherente.",
  },
];

export const engineeringCards = [
  {
    code: "FSM",
    title: "Lógica determinista",
    text: "La máquina de estados decide el flujo de configuración, giro, empuje, retorno a HOME y error.",
  },
  {
    code: "HW",
    title: "Motores y sensores",
    text: "La capa hardware concentra L298N, sensor Hall, sensor de carta y control PWM sin mezclar pines en la FSM.",
  },
  {
    code: "UI",
    title: "Interfaz física",
    text: "LCD y botonera para seleccionar jugadores, cartas y modos sin depender de una app externa.",
  },
];

export const routes = {
  home: "/",
  resources: "/recursos",
  contact: "/contacto",
  purchase: "/solicitar-demo",
};
