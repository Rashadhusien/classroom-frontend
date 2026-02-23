import Featurecards from "@/components/Featurecards";
import Hero from "@/components/Hero";
import Header from "@/components/navigation/Header";
import DepartmentHeilight from "@/components/DepartmentHeilight";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Application = () => {
  return (
    <main>
      <Header />
      <Hero />
      <Featurecards />
      <DepartmentHeilight />
      <HowItWorks />
      <Footer />
    </main>
  );
};

export default Application;
