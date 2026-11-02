import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center bg-[#F4F2EE] text-[#111111] px-6 sm:px-10 lg:px-16">
      <div>
        <h1 className="font-semibold tracking-[-0.035em] leading-[1.0] text-[clamp(3.4rem,12vw,7rem)] max-w-[16ch]">
          Qui non c'è niente.
        </h1>
        <Link
          to="/"
          className="inline-block mt-10 text-[clamp(1.2rem,2.4vw,1.6rem)] font-semibold underline underline-offset-4 hover:text-[#F26522] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] rounded-sm"
        >
          Torna all'inizio →
        </Link>
      </div>
    </div>
  );
}
