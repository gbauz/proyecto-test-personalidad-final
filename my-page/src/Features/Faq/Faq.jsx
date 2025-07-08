import React, { useState } from "react";

const faqs = [
  {
    title: "Potencia tu equipo con Humanize",
    content:
      "Descubre el verdadero potencial de tu talento con evaluaciones MBTI precisas. Contrata mejor, lidera con inteligencia y crea equipos más sólidos desde el primer día.",
  },
  {
    title: "Realiza una prueba gratuita / Solicita una demo",
    content: "Humanize Image",
  },
  {
    title: "Características poderosas para potenciar tus decisiones de Recursos Humanos",
    content: "",
  },
  {
    title: "¿Por qué MBTI Insight?",
    content:
      "No es solo un test. Es una herramienta basada en psicología reconocida, que traduce los tipos de personalidad en estrategias reales de reclutamiento, liderazgo y colaboración.\n\nMBTI Insight utiliza inteligencia artificial para analizar perfiles de personalidad y sugerir combinaciones ideales dentro de los equipos.",
  },
  {
    title: "Rendimiento en tiempo real",
    content:
      "Visualiza patrones de personalidad por departamento, identifica gaps de comunicación y mejora el clima organizacional con datos accionables.",
  },
  {
    title: "Vitalidad del equipo",
    content:
      "Sigue la evolución del bienestar de tus equipos en tiempo real y haz ajustes antes de que el conflicto o el burnout afecten el rendimiento.",
  },
  {
    title: "Convierte cada talento en una ventaja competitiva",
    content:
      "Identifica fortalezas naturales, áreas de desarrollo y afinidades interpersonales. Mejora los resultados de selección y crea sinergias reales entre tus colaboradores.",
  },
  {
    title: "Reimagina tu estrategia de talento competitiva",
    content:
      "Más de 10,000 usuarios en todo el mundo utilizan nuestra tecnología para transformar la gestión del talento humano.",
  },
  {
    title: "Prueba Crackle gratis",
    content: "Imagen de promoción",
  },
  {
    title: "¿Cómo funciona la sincronización del talento?",
    content:
      "Planeación multicanal: Integra tus canales de comunicación y selección bajo un mismo enfoque de personalidad.\n\nSincronización de calendarios: Mejora la coordinación y reduces fricciones entre equipos de trabajo diversos.\n\nHerramientas de gestión: Ajusta tus estrategias en tiempo real con dashboards de personalidad.\n\nMonitoreo y optimización: Optimiza continuamente la composición de equipos basados en perfiles psicológicos.",
  },
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2
        style={{ color: "black" }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Preguntas Frecuentes
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-md">
            <button
              style={{ color: "black" }}
              className="w-full px-4 py-3 text-left flex justify-between items-center focus:outline-none"
              onClick={() => toggle(idx)}
            >
              <span style={{ color: "black" }} className="font-semibold">
                {faq.title}
              </span>
              <svg
                style={{ color: "black" }}
                className={`w-5 h-5 transform transition-transform ${
                  activeIndex === idx ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeIndex === idx && (
              <div className="px-4 py-3 border-t whitespace-pre-line text-gray-700">
                {faq.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
