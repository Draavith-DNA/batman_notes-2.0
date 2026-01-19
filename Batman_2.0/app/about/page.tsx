import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 px-6 relative">
      
      {/* Fade In Animation for this page too */}
      <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />

      <main className="max-w-4xl mx-auto relative z-10">
        
        {/* 🌟 THE GLASS BOX 🌟 
            bg-black/30 = Very see-through (Low Opacity)
            backdrop-blur-md = Blurs the background image slightly for readability
        */}
        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl animate-card">
          
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight border-l-4 border-red-600 pl-6">
            About Us
          </h1>
          
          {/* Content */}
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              Welcome to <span className="text-red-500 font-bold">Batman 2.0</span>. 
              We are not just a platform; we are a symbol. A symbol of resilience, 
              knowledge, and the drive to push beyond limits.
            </p>
            
            <p>
              Our mission is to provide students with the ultimate resource hub—organized, 
              efficient, and accessible. Like the Dark Knight's utility belt, this app 
              equips you with everything you need to conquer your academic challenges.
            </p>

            <p>
              Built for students, by students. We believe that with the right tools, 
              anyone can become a hero of their own story.
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-10">
            <Link 
              href="/" 
              className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full uppercase tracking-widest hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300"
            >
              Back to Base
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}