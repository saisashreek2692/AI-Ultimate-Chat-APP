import { useState } from "react";
import {
  Nav,
  Footer,
  Hero,
  Stats,
  Flow,
  Modules,
  Features,
  Architecture,
  Roadmap
} from "./components/index";

export default function App() {
  const [section, setSection] = useState("overview");
  return (
    <>
      {/* Nav Component */}
      <Nav setSection={setSection} activeSection={section} />
      {/* Main Content Starts */}
      <main>
        {/* Hero Component */}
        <Hero setSection={setSection} />
        {/* Stats Component */}
        <Stats />
        {/* Demo Flow Component */}
        <Flow />
        {/* Modules Component */}
        <Modules />
        {/* Features Componnent */}
        <Features />
        {/* Architecture Component */}
        <Architecture />
        {/* Roadmap Component */}
        <Roadmap />
      </main>
      {/* Main Content Ends */}
      {/* Footer Component */}
      <Footer />
    </>
  );
}
