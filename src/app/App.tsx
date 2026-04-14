import { AsciiCanvasEffect } from "./components/ascii-canvas-effect"
import { MobileAsciiCanvasEffect } from "./components/mobile-ascii-canvas-effect"
import { AutoScaleTitle } from "./components/AutoScaleTitle"
import btsImage1 from './assets/krue_bts_1.jpg'
import btsImage2 from './assets/krue_bts_2.jpg'
import btsImage3 from './assets/project2.jpg'
import btsImage4 from './assets/project1.jpg'
import btsImage5 from './assets/project3.jpg'
import btsImage6 from './assets/black.jpg'
import logoImage from './assets/Krue8x.png'
import { useState, useEffect } from 'react' // <-- useEffect hozzáadva

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  // --- ÚJ: A nyíl áttűnésének vezérlése ---
  const [isArrowVisible, setIsArrowVisible] = useState(false)

  useEffect(() => {
    // 2 másodpercet várunk, mire az ASCII logó összeáll, utána úszik be a nyíl
    const timer = setTimeout(() => {
      setIsArrowVisible(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailtoLink = `mailto:connect@krue.com?subject=Message from ${formData.name}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`
    window.location.href = mailtoLink
  }

  const projects = [
    {
      name: "666GHOST - 1GOND/2GOND",
      url: "https://www.youtube.com/watch?v=UHFfKial3DA",
      image: btsImage4
    },
    {
      name: "21ROSE - CSILLAG",
      url: "https://www.youtube.com/watch?v=y-ANan1IRnY",
      image: btsImage3
    },
    {
      name: "21ROSE - BITCHES COME N GO",
      url: "https://www.youtube.com/watch?v=m3H8n351yp8",
      image: btsImage5
    },
    {
      name: "21ROSE - AZ ÉN HIBÁM",
      url: "#",
      image: btsImage6
    }
  ]

  return (
    <div className="min-h-screen bg-[#111111] font-mono">
      {/* Hero Section with ASCII Effect */}
      <section className="h-screen relative">
        {/* Desktop: ASCII Canvas Effect */}
        <div className="hidden md:block">
          <AsciiCanvasEffect />
        </div>
        
        {/* Mobile: ASCII Canvas Effect */}
        <div className="md:hidden h-full w-full flex items-center justify-center bg-[#111111]">
          <MobileAsciiCanvasEffect />
        </div>
      
      {/* --- KATTINTHATÓ MINIMALISTA LEFELÉ NYÍL IDŐZÍTETT ÁTTŰNÉSSEL --- */}
        <div 
          className="absolute bottom-20 md:bottom-3 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center"
          style={{ 
            opacity: isArrowVisible ? 1 : 0, 
            transition: 'opacity 1.5s ease-in-out' 
          }}
        >
          <a 
            href="#about" 
            className="group transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Scroll to About section"
          >
            {/* Vékony V alakú nyíl */}
            <svg 
              className="w-8 h-8 text-[#f4e9c9]/60 group-hover:text-[#f4e9c9] animate-subtle cursor-pointer" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ filter: 'drop-shadow(0px 0px 8px rgba(0,0,0,0.8))' }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </a>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-40">
        
        {/* About Us Section */}
        <section id="about" className="space-y-12 relative">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-px bg-[#f4e9c9] my-4" />
            ))}
          </div>
          <AutoScaleTitle className="text-[#f4e9c9] text-3xl sm:text-4xl md:text-7xl font-bold tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-16 relative animate-pulse-slow uppercase">
            [THE_COLLECTIVE]
          </AutoScaleTitle>
          <div className="space-y-8 text-[#f4e9c9] text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose max-w-4xl relative border-l-2 border-[#f4e9c9]/30 pl-4 sm:pl-8">
            <p className="tracking-wide sm:tracking-wider break-words">
              &gt; WE ARE KRUE. A COLLECTIVE OF DIRECTORS, EDITORS, AND SOUND DESIGNERS CREATING VISUALS THAT DISRUPT. WE PROCESS SOUND INTO SIGHT. WE BELIEVE IN RAW, VISCERAL STORYTELLING.
            </p>
            <p className="text-[#f4e9c9]/70 italic tracking-wide border-l-2 border-[#f4e9c9]/20 pl-4 sm:pl-6 ml-2 sm:ml-4 break-words">
              &gt; MI VAGYUNK A KRUE. A HANGOT KÉPPÉ KÓDOLJUK. HISZÜNK A NYERS, ZSIGERI TÖRTÉNETMESÉLÉSBEN.
            </p>
            <p className="text-base sm:text-xl md:text-2xl tracking-wide text-[#f4e9c9]/90 break-words">
              &gt; WE DON'T MAKE MUSIC VIDEOS. WE MAKE MOTION ART THAT AMPLIFIES THE FREQUENCY.
            </p>
            <p className="text-sm sm:text-lg md:text-xl text-[#f4e9c9]/70 italic tracking-wide border-l-2 border-[#f4e9c9]/20 pl-4 sm:pl-6 ml-2 sm:ml-4 break-words">
              &gt; MI NEM KLIPEKET GYÁRTUNK. MOZGÓKÉPET ALKOTUNK, AMI FELERŐSÍTI A FREKVENCIÁT.
            </p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-[#f4e9c9] pt-6 tracking-wider sm:tracking-widest break-words">
              [MOTION.SOUND.VISCERA.KRUE]
            </p>
          </div>
        </section>

        {/* Works/Showcase Section */}
        <section id="works" className="space-y-12 relative">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-px bg-[#f4e9c9] my-4" />
            ))}
          </div>
          <AutoScaleTitle className="text-[#f4e9c9] text-3xl sm:text-4xl md:text-7xl font-bold tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-16 relative animate-pulse-slow uppercase">
            [WORKS//SHOWCASE]
          </AutoScaleTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {projects.map((project, index) => (
              <a
            key={index}
            href={project.url}
            target={project.url !== "#" ? "_blank" : undefined}
            rel={project.url !== "#" ? "noopener noreferrer" : undefined}
            className="aspect-video bg-[#0a0a0a] border-2 border-[#f4e9c9]/40 relative overflow-hidden group transform translate-z-0"
            style={{ backfaceVisibility: 'hidden' }}
              >
            <div className="absolute inset-0 border-2 border-[#f4e9c9] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 pointer-events-none" />
                {/* Background Image if exists */}
                {project.image && (
  <>
    <img 
      src={project.image} 
      className="absolute inset-0 w-full h-full object-cover transform translate-z-0"
    />
    {/* A szövegkonténer (z-50 -> ez a legfelső réteg, így nem lesz sötét!) */}
<div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-50">
  <span className="text-[#f4e9c9] text-sm md:text-base tracking-[0.3em] mb-2 text-center drop-shadow-lg">
    [{project.name}]
  </span>
  <span className="text-[#f4e9c9]/80 text-xs tracking-widest drop-shadow-lg">
    {project.url !== "#" ? "▶ WATCH" : "▶ COMING_SOON"}
  </span>
</div>

    {/* Szürke réteg (z-10) */}
    <div className="absolute inset-0 bg-[#111111] mix-blend-color opacity-70 group-hover:opacity-0 transition-opacity duration-300 z-10" />
    
    {/* Sárga háttér-villanás (z-25 -> a sötétítés felett, de a szöveg alatt) */}
<div className="absolute inset-0 bg-[#f4e9c9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-25" />

    {/* Sötétítő réteg (z-20) */}
    <div className="absolute inset-0 bg-[#111111]/60 group-hover:bg-[#111111]/40 transition-opacity duration-300 z-20" />
  </>
)}
                
                <div className="absolute inset-0 bg-[#f4e9c9]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                  <span className="text-[#f4e9c9] text-sm md:text-base tracking-[0.3em] mb-2 text-center drop-shadow-lg">
                    [{project.name}]
                  </span>
                  <span className="text-[#f4e9c9]/80 text-xs tracking-widest drop-shadow-lg">
                    {project.url !== "#" ? "▶ WATCH" : "▶ COMING_SOON"}
                  </span>
                </div>
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none opacity-20 z-10">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-1 bg-[#f4e9c9] my-6" />
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Behind the Noise Section */}
        <section id="behind-the-noise" className="space-y-12 relative">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-px bg-[#f4e9c9] my-4" />
            ))}
          </div>
          <AutoScaleTitle className="text-[#f4e9c9] text-3xl sm:text-4xl md:text-7xl font-bold tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-16 relative animate-pulse-slow uppercase">
            [BEHIND_THE_NOISE]
          </AutoScaleTitle>
          <div className="space-y-8 text-[#f4e9c9] text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose max-w-4xl relative border-l-2 border-[#f4e9c9]/30 pl-4 sm:pl-8 mb-16">
            <p className="tracking-wide sm:tracking-wider break-words">
              &gt; EVERY FRAME IS CRAFTED. EVERY SOUND DESIGNED. BEHIND THE NOISE LIES PRECISION, PROCESS, AND PASSION.
            </p>
            <p className="text-[#f4e9c9]/70 italic tracking-wide border-l-2 border-[#f4e9c9]/20 pl-4 sm:pl-6 ml-2 sm:ml-4 break-words">
              &gt; MINDEN KÉPKOCKA KISZÁMÍTOTT. MINDEN HANG TUDATOS.
            </p>
            <p className="tracking-wide sm:tracking-wider break-words">
              &gt; FROM CONCEPT TO DELIVERY, WE CONTROL EVERY ELEMENT. OUR STUDIO IS WHERE CHAOS MEETS CLARITY.
            </p>
            <p className="text-[#f4e9c9]/70 italic tracking-wide border-l-2 border-[#f4e9c9]/20 pl-4 sm:pl-6 ml-2 sm:ml-4 break-words">
              &gt; AZ ÖTLETTŐL A LEADÁSIG MINDEN RÉSZLETET MI URALUNK.
            </p>
          </div>

          {/* Behind the Scenes Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {[btsImage1, btsImage2].map((img, index) => (
              <div 
                key={index}
                className="relative overflow-hidden border-2 border-[#f4e9c9]/40 group hover:border-[#f4e9c9] transition-all duration-300"
              >
                <div className="aspect-[4/3] relative">
                  <img 
                    src={img} 
                    alt={`Behind the scenes ${index + 1}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-[#f4e9c9]/10 mix-blend-overlay" />
                  {/* Scanlines on hover */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity">
                    {[...Array(15)].map((_, i) => (
                      <div key={i} className="h-1 bg-[#f4e9c9] my-4" />
                    ))}
                  </div>
                </div>
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 text-[#f4e9c9] text-2xl opacity-70">[</div>
                <div className="absolute top-2 right-2 text-[#f4e9c9] text-2xl opacity-70">]</div>
                <div className="absolute bottom-2 left-2 text-[#f4e9c9] text-2xl opacity-70">[</div>
                <div className="absolute bottom-2 right-2 text-[#f4e9c9] text-2xl opacity-70">]</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="space-y-12 pb-32 relative">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-px bg-[#f4e9c9] my-4" />
            ))}
          </div>
          <AutoScaleTitle className="text-[#f4e9c9] text-3xl sm:text-4xl md:text-7xl font-bold tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-16 relative animate-pulse-slow uppercase">
            [THE_CONNECTION]
          </AutoScaleTitle>
          <div className="space-y-12 max-w-3xl relative">
            <div className="border-2 border-[#f4e9c9]/40 p-4 sm:p-8 bg-[#0a0a0a]">
              <p className="text-[#f4e9c9]/80 text-base sm:text-lg mb-2 tracking-wide sm:tracking-wider break-words">
      &gt; READY TO AMPLIFY YOUR VISION?
          </p>
      {/* Magyar fordítás dőlt betűvel, ugyanazzal a stílussal mint fent */}
      <p className="text-[#f4e9c9]/60 italic text-sm sm:text-base tracking-wide border-l-2 border-[#f4e9c9]/20 pl-4 mb-8 ml-2 break-words">
      &gt; KÉSZEN ÁLLSZ FELERŐSÍTENI A VÍZIÓD?
          </p>
              
              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[#f4e9c9]/60 text-xs tracking-widest mb-2 block">
                    [NAME // NÉV]
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#111111] border-2 border-[#f4e9c9]/40 text-[#f4e9c9] px-4 py-3 focus:border-[#f4e9c9] outline-none transition-colors tracking-wider"
                    placeholder="YOUR_NAME // A_NEVED"
                  />
                </div>

                <div>
                  <label className="text-[#f4e9c9]/60 text-xs tracking-widest mb-2 block">
                    [EMAIL]
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#111111] border-2 border-[#f4e9c9]/40 text-[#f4e9c9] px-4 py-3 focus:border-[#f4e9c9] outline-none transition-colors tracking-wider"
                    placeholder="YOUR@EMAIL.COM // AZ@EMAILED.COM"
                  />
                </div>

                <div>
                  <label className="text-[#f4e9c9]/60 text-xs tracking-widest mb-2 block">
                    [MESSAGE // ÜZENET]
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full bg-[#111111] border-2 border-[#f4e9c9]/40 text-[#f4e9c9] px-4 py-3 focus:border-[#f4e9c9] outline-none transition-colors tracking-wider resize-none"
                    placeholder="YOUR_MESSAGE_HERE... // AZ_ÜZENETED_ITT..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-[#f4e9c9] text-xl font-bold hover:bg-[#f4e9c9] hover:text-[#111111] transition-all duration-300 py-4 px-6 border-2 border-[#f4e9c9] tracking-wider"
                >
                  [SEND_MESSAGE]
                </button>
              </form>
            </div>
            
            <div className="border-t-2 border-[#f4e9c9]/30 pt-8">
              <p className="text-[#f4e9c9]/60 text-sm mb-6 tracking-[0.3em]">
                [FOLLOW_THE_FREQUENCY]
              </p>
              <a 
                href="https://instagram.com/krue_productions" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f4e9c9] text-xl md:text-2xl hover:bg-[#f4e9c9] hover:text-[#111111] transition-all duration-300 inline-block py-3 px-6 border-2 border-[#f4e9c9] tracking-wider"
              >
                INSTAGRAM
              </a>
            </div>
          </div>
        </section>

        {/* Logo Footer */}
        <section className="flex justify-center pb-20">
          <img 
            src={logoImage} 
            alt="KRUE Logo" 
            className="w-32 md:w-40 opacity-60 hover:opacity-100 transition-opacity"
          />
        </section>

      </div>
    </div>
  );
}