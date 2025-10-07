import ContainerPagesAdmin from "../../components/AdminComponents/ContainerPagesAdmin";
import "../../style/AdminStyle/AffiliatePage.css";
import FilterDropdown from "../../components/generalComponents/FilterDropdown";
import ListCouturieres from "../../components/AdminComponents/ListCouturieres";
import Commandlafassou from "../../components/AdminComponents/Commandlafassou";
import DemandePublicationModel from "../../components/AdminComponents/DemandePublicationModel";
import { useState } from "react";

function CouturierePage() {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(0);
  
  const filterOptions = [
    { value: "all", label: "جميع الخياطات" },
    { value: "accepted", label: "المقبولات" },
    { value: "pending", label: "في الانتظار" },
    { value: "active", label: "النشيطات" },
    { value: "inactive", label: "غير النشيطات" }
  ];

  // Header options seulement pour le premier onglet
  const headerOptions = activeTab === 0 ? (
    <FilterDropdown
      options={filterOptions}
      selectedOption={filterOptions.find(opt => opt.value === currentFilter)}
      onOptionChange={(option) => setCurrentFilter(option.value)}
      placeholder="تصفية حسب الحالة"
    />
  ) : null;

  // Passer le filtre au composant ListCouturieres
  const listCouturieresWithFilter = <ListCouturieres filter={currentFilter} />;

  return (
    <ContainerPagesAdmin
      titre="ادارة الخياطات"
      soustitre="ادارة طلبات الانضمام و طلبات نشر النماذج"
      elemnts={["قائمة الخياطات و طلبات الانضمام", "طلبات نشر نماذج الخياطات","طلبات لافاصو"]}
      contenus={[listCouturieresWithFilter, <DemandePublicationModel />, <Commandlafassou/>]}
      headerOptions={headerOptions}
      onTabChange={setActiveTab}
    />
  );
}

export default CouturierePage;