import CallToAction from "../components/home-page/CallToAction";
import Hero from "../components/home-page/Hero";
import HowDoesItWork from "../components/home-page/HowDoesItWork";
import ProjectsTeaser from "../components/home-page/ProjectsTeaser";
import Values from "../components/home-page/Values";

export default function Home() {
  return (
    <div>
      <Hero />
      <Values />
      <HowDoesItWork />
      <ProjectsTeaser />
      <CallToAction />
    </div>
  );
}
