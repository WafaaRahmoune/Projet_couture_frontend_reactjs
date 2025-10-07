import C1landing from '../../components/landingComp/C1landing'
import Navbar from '../../components/landingComp/Navbar'
import ProductSection from '../../components/landingComp/ProductSection';
import ServicesSection from '../../components/landingComp/ServicesSection';
import CoutureSection from '../../components/landingComp/CoutureSection';
import DropshippingSection from '../../components/landingComp/DropshippingSection';
import InverstissementSection from '../../components/landingComp/InverstissementSection';
import QuestionSection from '../../components/landingComp/QuestionSection';
import FooterSection from '../../components/landingComp/FooterSection';
function Landingpage() {
  return (
    <div className="App">
      <Navbar />
      <C1landing />
      <ProductSection/>
      <ServicesSection/>
      <CoutureSection />
      <DropshippingSection />
      <InverstissementSection />
      <QuestionSection />
      <FooterSection/>
    </div>
  );
}

export default Landingpage;