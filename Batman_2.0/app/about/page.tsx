import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      {/* Background Mask */}
      <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />

      <main className="max-w-4xl mx-auto relative z-10 animate-card">
        
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tighter uppercase border-l-4 border-red-600 pl-6 shadow-sm">
            About <span className="text-red-600">BATMAN 2.0</span>
          </h1>
          <p className="text-gray-500 mt-2 ml-7 font-medium uppercase tracking-[0.3em] text-[10px]">
            Project: BATMAN 2.0 // every student’s helpful companion
          </p>
        </div>

        {/* MISSION BRIEFING SECTION */}
        <div className="grid gap-8">
          
          <section className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <h2 className="text-lg font-black uppercase tracking-[0.2em] text-red-600 mb-4">The Upgrade</h2>
            <p className="text-gray-300 leading-relaxed font-medium">
              The original iteration was a closed-circuit system, built specifically for the 1st-year student’s. 
              <span className="text-white font-bold"> BATMAN 2.0 </span> has broken those constraints.
            </p>
            <p className="text-gray-400 mt-4 leading-relaxed">
              Now, the network is open to <span className="text-white">every student, every branch, and every semester.</span> 
               Access all Subject's notes, text books and question papers and build your own network of allies through our social layer.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            {/* CONTRIBUTIONS */}
            <section className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
              <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white mb-4">Contribute</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                If the notes is missing for your subject, branch or semester, you can contribute by uploading notes you have. 
                Help your fellow students by sharing the intelligence you have gathered.
              </p>
              <div className="bg-red-600/10 border border-red-600/30 p-4 rounded-2xl">
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Rewards</p>
                <p className="text-white text-sm font-bold italic">
                  "Earn the exclusive Contributor Badge for your profile."
                </p>
              </div>
            </section>

            {/* CONTACT / ACTION */}
            <section className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white mb-4">Contact</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  If your ready to contribute or facing any issues, reach out to us at our official email address.
                </p>
              </div>
              <div className="mt-6">
                <a 
  href="https://mail.google.com/mail/?view=cm&fs=1&to=batmanotes@gmail.com" 
  target="_blank" 
  rel="noopener noreferrer"
  className="block w-full bg-white/5 hover:bg-red-600 text-white text-center py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all border border-white/10 hover:border-red-600 shadow-lg"
>
  batmanotes@gmail.com
</a>
              </div>
            </section>
          </div>

        </div>

        {/* Footer Branding */}
        <div className="mt-16 text-center">
            <p className="text-[9px] text-gray-700 uppercase tracking-[0.5em] font-bold">
                Iam not hiding in the shadows, But iam the shadow // BATMAN 2.0
            </p>
        </div>
      </main>
    </div>
  );
}