import Rail from "@/components/Rail";
import Footer from "@/components/Footer";
import {
  About,
  Contact,
  Education,
  Experience,
  Honors,
  News,
  Publications,
  Volunteering,
} from "@/components/sections";

const Home = () => (
  <>
    <Rail />
    <main className="px-4 pb-6 pt-24 sm:px-8 lg:ml-80 lg:px-16 lg:pt-16">
      <div className="mx-auto max-w-3xl">
        {/* Portrait for small screens; on desktop it lives in the rail. */}
        <div className="mb-10 flex items-center gap-5 lg:hidden">
          <div className="photo-arch w-24 shrink-0">
            <img src="/heiko.jpg" alt="Portrait of Heiko Hoppe" width={96} height={120} />
          </div>
          <div>
            <p className="text-sm text-muted">AI Researcher</p>
            <p className="mt-1 text-sm">
              Visiting Researcher, MIT
              <br />
              Ph.D. Candidate, TU Munich
            </p>
          </div>
        </div>

        <About />
        <News />
        <Publications />
        <Experience />
        <Education />
        <Volunteering />
        <Honors />
        <Contact />
        <Footer />
      </div>
    </main>
  </>
);

export default Home;
