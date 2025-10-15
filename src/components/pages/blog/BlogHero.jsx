export function BlogHero() {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 mb-10 sm:mb-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center overflow-hidden rounded-[32px] px-6 py-14 sm:px-12 sm:py-16">
        <div className="flex w-full flex-col items-center text-center gap-6 sm:gap-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffd700]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#ffd700]">
            Blog Reviews
          </div>

          <div className="space-y-5 sm:space-y-6 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-white">
              <span className="block">Stories from real travellers</span>
              <span className="block text-transparent bg-gradient-to-r from-[#ffd700] via-[#ffed4e] to-[#ffd700] bg-clip-text">
                who explored with Solva Travel
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Discover inspiration, honest feedback, and travel tips from our community
              so you can plan your own dream journey with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
