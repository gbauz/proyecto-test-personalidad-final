import { Navigate, useNavigate } from "react-router-dom";

const Landing = () => {
  const irALogin = useNavigate();


  const redirigir = () => {
    irALogin('/login')
  }
  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section
        className="bg-cover bg-no-repeat text-white px-6 rounded-[24px] m-4"
        style={{
          backgroundImage: 'url(/imagenes/FondoHero.png)',
          paddingBottom: '180px',
        }}
      >
        {/* Navbar inside Hero Section */}
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-8">
          {/* Logo */}
          <div className="text-3xl font-extrabold">
            <span className="text-white">Humanize</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8">
            <a href="#" className="hover:text-gray-400">Inicio</a>
            <a href="#" className="hover:text-gray-400">Caracteristicas</a>
            <a href="#" className="hover:text-gray-400">Casos de Estudio</a>
            <a href="#" className="hover:text-gray-400">Blogs</a>
            <a href="#" className="hover:text-gray-400">Careers</a>
          </div>

          {/* Contact Button */}
          <div>
            <button
            onClick={redirigir} 
            className="bg-[#EB4B15] text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-300">
              Iniciar Sesión
            </button>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side */}
          <div>
            <h1 className="text-4xl font-extrabold mb-4 text-white" style={{ color: '#FFFFFF', paddingTop: '120px' }}>
              Potencia tu equipo con Humanize
            </h1>
            <p className="text-xl mb-6 text-white" style={{ color: '#FFFFFF' }}>
              Descubre el verdadero potencial de tu talento con evaluaciones MBTI precisas. 
              Contrata mejor, lidera con inteligencia y crea equipos más sólidos desde el primer día.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#EB4B15] text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-200">
                Realiza una prueba gratuita
              </button>
              <button className="bg-[#E5E5E5] text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200">
                Solicita una demo
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex justify-center items-center w-full" style={{ paddingTop: '120px' }}>
            <img
              src="/imagenes/cuadroEstadistico.png"
              alt="Humanize Image"
              className="w-5/8 h-auto rounded-[24px]" // Asegura que la imagen no se deforme
            />
          </div>
        </div>
      </section>
     
      {/* Features Section */}
      <section className="py-20 px-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Características poderosas para potenciar<br /> tus decisiones de<spam className="text-[#EA4711]"> Recursos Humanos</spam>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: ¿Por qué MBTI Insight? */}
          <div className="bg-white text-black p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">¿Por qué MBTI Insight?</h3>
            <p className="text-gray-600 mb-4">
              No es solo un test. Es una herramienta basada en psicología reconocida, que traduce los tipos de personalidad en estrategias reales de reclutamiento, liderazgo y colaboración.
            </p>
            <p className="text-gray-600">
              MBTI Insight utiliza inteligencia artificial para analizar perfiles de personalidad y sugerir combinaciones ideales dentro de los equipos.
            </p>
          </div>

          <div className="bg-[#FF7A4E] p-8 rounded-lg shadow-lg">
            <h3 className="font-semibold text-white mb-4" style={{ color: '#FFFFFF' }}>Rendimiento en tiempo real</h3>
            <p className="text-white mb-4" style={{ color: '#FFFFFF' }}>
              Visualiza patrones de personalidad por departamento, identifica gaps de comunicación y mejora el clima organizacional con datos accionables.
            </p>
          </div>

          {/* Right: Vitalidad del equipo */}
          <div className="bg-white text-black p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Vitalidad del equipo</h3>
            <p className="text-gray-600 mb-4">
              Sigue la evolución del bienestar de tus equipos en tiempo real y haz ajustes antes de que el conflicto o el burnout afecten el rendimiento.
            </p>
          </div>

        </div>
      </section>
      <section className="bg-black text-white py-10 px-6 rounded-[36px] m-4">
  {/* Sección superior, centrada verticalmente con menos altura */}
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-1/2 flex flex-col gap-6 text-center">
      <h1  className="text-4xl font-extrabold mb-4 text-white" style={{ color: '#FFFFFF'}}>
        Convierte cada talento en una ventaja <span className="text-[#EA4711]">competitiva</span>
      </h1>
      <p className="text-white mb-4" style={{ color: '#FFFFFF' }}>
        Identifica fortalezas naturales, áreas de desarrollo y afinidades interpersonales. Mejora los resultados de selección y crea sinergias reales entre tus colaboradores.
      </p>
    </div>
  </div>

  {/* Sección inferior con texto + imagen */}
  <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 pt-24 pb-24">
    {/* Texto */}
    <div className="w-full lg:w-1/2 flex flex-col gap-6">
      <h1 className="text-4xl font-extrabold mb-4 text-white" style={{ color: '#FFFFFF'}}>
        Reimagina tu estrategia de talento competitiva
      </h1>
      <p className="text-white mb-4" style={{ color: '#FFFFFF' }}>
        Más de 10,000 usuarios en todo el mundo utilizan nuestra tecnología para transformar la gestión del talento humano.
      </p>
      <div className="flex gap-4 mt-6">
        <button className="bg-[#EB4B15] text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-200">
          Prueba Crackle gratis
        </button>
      </div>
    </div>

    {/* Imagen */}
    <div className="w-full lg:w-1/2 flex justify-center items-center">
      <img
        src="/imagenes/fotopersonalidad.png"
        alt="Imagen de promoción"
        className="w-full max-w-[600px] h-auto rounded-[24px]"
      />
    </div>
  </div>
</section>


<section className="bg-white text-black py-20 px-6 rounded-[36px] m-4">
  <div className="max-w-screen-xl mx-auto text-center mb-16">
    <h1 className="text-4xl font-extrabold">
      ¿Cómo funciona la <span className="text-[#EB4B15]"><br/>sincronización del talento?</span>
    </h1>
  </div>

  <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
    {/* Item 1 */}
    <div className="flex items-start gap-4">
      <div className="bg-[#EB4B15] text-white p-3 rounded-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 4h16v16H4z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-bold">Planeación multicanal</h3>
        <p>Integra tus canales de comunicación y selección bajo un mismo enfoque de personalidad.</p>
      </div>
    </div>

    {/* Item 2 */}
    <div className="flex items-start gap-4">
      <div className="bg-[#EB4B15] text-white p-3 rounded-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M8 7V3M16 7V3M3 11h18M5 19h14a2 2 0 0 0 2-2V7H3v10a2 2 0 0 0 2 2z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-bold">Sincronización de calendarios</h3>
        <p>Mejora la coordinación y reduces fricciones entre equipos de trabajo diversos.</p>
      </div>
    </div>

    {/* Item 3 */}
    <div className="flex items-start gap-4">
      <div className="bg-[#EB4B15] text-white p-3 rounded-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 17v-2h6v2M5 7h14l-1.5 9h-11z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-bold">Herramientas de gestión</h3>
        <p>Ajusta tus estrategias en tiempo real con dashboards de personalidad.</p>
      </div>
    </div>

    {/* Item 4 */}
    <div className="flex items-start gap-4">
      <div className="bg-[#EB4B15] text-white p-3 rounded-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 17v-6h6v6M3 3h18v18H3z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-bold">Monitoreo y optimización</h3>
        <p>Optimiza continuamente la composición de equipos basados en perfiles psicológicos.</p>
      </div>
    </div>
  </div>
</section>

<section className="bg-[#0D0D0D] text-white py-20 px-6 rounded-[36px] m-4">
  <div className="max-w-screen-xl mx-auto text-center mb-10">
    <h2 className="text-4xl font-extrabold mb-4 text-white" style={{ color: '#FFFFFF'}}>
      Potencia tu equipo y <span className="text-[#EB4B15]">mira los resultados</span>
    </h2>
    <button className="bg-[#EB4B15] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition mb-8">
      Solicita más información
    </button>
    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
      <a href="#" className="hover:text-white">Product</a>
      <a href="#" className="hover:text-white">Features</a>
      <a href="#" className="hover:text-white">Resources</a>
      <a href="#" className="hover:text-white">Company</a>
      <a href="#" className="hover:text-white">Careers</a>
    </div>
    <div className="flex justify-center gap-4 text-gray-400 text-lg mb-8">
      <a href="#"><i className="fab fa-facebook"></i></a>
      <a href="#"><i className="fab fa-instagram"></i></a>
      <a href="#"><i className="fab fa-x-twitter"></i></a>
      <a href="#"><i className="fab fa-linkedin"></i></a>
    </div>
    <div className="text-6xl font-extrabold mb-4">Humanize</div>
    <div className="text-xs text-gray-500 flex flex-col sm:flex-row justify-center gap-4">
      <span>© 2024 Crackle. All rights reserved.</span>
      <a href="#" className="hover:text-white">Terms Use</a>
      <a href="#" className="hover:text-white">Privacy Policies</a>
    </div>
  </div>
</section>
    </div>
  );
};

export default Landing;
