export const assetPaths = {
  logo: "/assets/logo_elco_dealer_primary.png",
  hardware: "/assets/montaje_hw.png",
  demoVideo: "/assets/demo_video.mp4",
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
    text: "Secuencia de giro y expulsión diseñada para distribuir cartas de forma repetible entre jugadores.",
  },
  {
    eyebrow: "02",
    title: "Sensado físico",
    text: "Detección digital de cartas y referencia HOME para controlar el avance sin depender de tiempos fijos.",
  },
  {
    eyebrow: "03",
    title: "FSM robusta",
    text: "Control por máquina de estados, eventos priorizados y timeouts de seguridad ante fallos mecánicos.",
  },
  {
    eyebrow: "04",
    title: "Presentación premium",
    text: "Una experiencia pública con lenguaje casino-tech, pensada para enseñar el prototipo como producto real.",
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
  purchase: "/pagina_web_compra",
};
