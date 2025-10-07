import RegistrationSuccess from "./pages/user/Registration-success-to-verified";
import RegistrationCouturiere from "./pages/user/Registration-form-couturiere";
import ForgotPassword from "./pages/user/Forgot-password";
import VerificationCode from "./pages/user/VerificationCode";
import PasswordSuccess from "./pages/user/PasswordSuccess";
import ResetPassword from "./pages/user/ResetPassword";
import LoginPage from "./pages/user/LoginPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './pages/client/Landingpage';
import ShoppingPage from './pages/client/ShoppingPage'
import ShoppingDropshipper from './pages/dropshipper/ShoppingDropshipper'
import FormAcheter from './pages/client/FormAcheterPage'
import ModelSpecialPage from "./pages/client/ModelSpecialPage";
import CompteclientPage from "./pages/client/CompteclientPage";
import CompteDropshipperPage from "./pages/dropshipper/CompteDropshipperPage";

import Talabiyati from "./pages/client/Talabiyati";
import Popupimages from "./components/generalComponents/Popupimages";
import RegistrationClient from "./pages/client/RegistrationClient";
import LoginAdmin from "./pages/admin/LoginAdmin";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./apimanagement/ProtectedRoute.jsx";
import TermsAndPolicy from "./pages/client/TermsAndPolicy";
import TermsAndPolicyDropshipper from "./pages/dropshipper/TermsAndPolicyDropshipper";

// Import des composants Admin
import Sidebaradmin from "./components/AdminComponents/Sidebaradmin.jsx";
import ParametreSite from "./pages/admin/ParametreSite";
import DropshipperCard from "./components/AdminComponents/DropshipperCard"
import DemandeCard from "./components/AdminComponents/DemandeCard";
import ContainerPagesAdmin from "./components/AdminComponents/ContainerPagesAdmin";
import DropshipperPage from "./pages/admin/DropshipperPage";
import AffiliatePage from "./pages/admin/AffiliatePage";
import ModelPage from "./pages/admin/ModelPage";
import DemandePage from "./pages/admin/DemandePage";
import AddNewAffilier from "./components/AdminComponents/AddAffiliatePopup";
import CouturierePage from "./pages/admin/CouturierePage";
import AddAffiliatePopup from "./components/AdminComponents/AddAffiliatePopup";
import Reworkwithaffiliate from "./pages/admin/Reworkwithaffiliate"
import SignupDropshipper from "./pages/dropshipper/SignupDropshipper";
import FormAcheterPageDropshipper from "./pages/dropshipper/FormAcheterPageDropshipper";
import TalabiyatiDropshipper from "./pages/dropshipper/TalabiyatiDropshipper"
import RegistrationSuccessDropshipper from "./pages/dropshipper/RegistrationSuccessDropshipper";
import RefuseDropshipperPage from "./pages/dropshipper/RefuseDropshipperPage";
import NotActiveDropshipper from "./pages/dropshipper/NotActiveDropshipper";
import RefuseCouturierePage from "./pages/user/RefuseCouturierePage";
import NotActiveCouturiere from "./pages/user/NotActiveCouturiere";

// Import des pages de ta camarade
import Policy from "./pages/couturiere/Policy";
import Demandes from "./pages/couturiere/Demandes";
import AffiliateCodePromoDashboard from "./pages/affiliate/Mescodepromo";
import MyAccount from "./pages/couturiere/Moncompte";
import AffiliateAccount from "./pages/affiliate/Moncompte";
import MesModels from "./pages/couturiere/Mesmodels";
import AddNewModel from "./pages/couturiere/Addmodel";
import StatisticsPage from "./pages/affiliate/Statistics";
import DemandesOffresFassou from "./pages/couturiere/Demandeoffrefassou";
import PolicyAffiliate from "./pages/affiliate/Policy";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedWrapper from "./components/ProtectedWrapper";

export default function App() {
  return (
    <Router>
      <ProtectedWrapper>
        <Routes>
          {/* Routes publiques - accessibles sans authentification */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/rules" element={<TermsAndPolicy/>} />
          <Route path="/rulesdropshipper" element={<TermsAndPolicyDropshipper/>} />

          {/* Routes d'authentification */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registerclient" element={<RegistrationClient />} />
          <Route path="/signup" element={<RegistrationCouturiere />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verification" element={<VerificationCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-success" element={<PasswordSuccess />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/NotActiveDropshipper" element={<NotActiveDropshipper />} />
          <Route path="/NotActiveCouturiere" element={<NotActiveCouturiere />} />
          
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/SignupDropshipper" element={<SignupDropshipper/>} />
          <Route path="/RegistrationSucess" element={<RegistrationSuccessDropshipper/>} />
          <Route path="/RefuseDropshipperPage" element={<RefuseDropshipperPage/>} />
          <Route path="/registration-couturiere-refused" element={<RefuseCouturierePage/>} />

          {/* Routes publiques de ta camarade */}
          <Route path="/Policy" element={<Policy />} />
          <Route path="/affiliate/policy" element={<PolicyAffiliate />} />

          {/* Routes protégées pour clients */}
          <Route path="/shopping" element={
            <ProtectedRoute requiredUserType="client">
              <ShoppingPage />
            </ProtectedRoute>
          } />

          <Route path="/special" element={
            <ProtectedRoute requiredUserType="client">
              <ModelSpecialPage />
            </ProtectedRoute>
          } />
          
          <Route path="/shopping/acheter" element={
            <ProtectedRoute requiredUserType="client">
              <FormAcheter />
            </ProtectedRoute>
          } />
          
          <Route path="/compte" element={
            <ProtectedRoute requiredUserType="client">
              <CompteclientPage />
            </ProtectedRoute>
          } />

          <Route path="/compte" element={
            <ProtectedRoute requiredUserType="client">
              <CompteclientPage />
            </ProtectedRoute>
          } />

          
          
          <Route path="/mycommands" element={
            <ProtectedRoute requiredUserType="client">
              <Talabiyati />
            </ProtectedRoute>
          } />
          
          <Route path="/mycommandsdropshipper" element={
            <ProtectedRoute requiredUserType="dropshipper">
              <TalabiyatiDropshipper />
            </ProtectedRoute>
          } />

          {/* Routes protégées pour admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredUserType="admin">
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/parametres" element={
            <ProtectedRoute requiredUserType="admin">
              <ParametreSite />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/gestionAffiliates/AddNewAffilier" element={
            <ProtectedRoute requiredUserType="admin">
              <AddAffiliatePopup />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/gestionAffiliates/Reworkwithaffiliate" element={
            <ProtectedRoute requiredUserType="admin">
              <Reworkwithaffiliate />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/livraison" element={
            <ProtectedRoute requiredUserType="admin">
              <ParametreSite />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/gestiondropshippers" element={
            <ProtectedRoute requiredUserType="admin">
              <DropshipperPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/gestionAffiliates" element={
            <ProtectedRoute requiredUserType="admin">
              <AffiliatePage/>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/gestionCouturieres" element={
            <ProtectedRoute requiredUserType="admin">
              <CouturierePage/>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/gestionModels" element={
            <ProtectedRoute requiredUserType="admin">
              <ModelPage/>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/gestinDemandes" element={
            <ProtectedRoute requiredUserType="admin">
              <DemandePage/>
            </ProtectedRoute>
          } />

          {/* Routes protégées pour dropshipper */}
          <Route path="/shoppingDropshipper" element={
            <ProtectedRoute requiredUserType="dropshipper">
              <ShoppingDropshipper/>
            </ProtectedRoute>
          } />
          
          <Route path="/FormAcheterPageDropshipper" element={
            <ProtectedRoute requiredUserType="dropshipper">
              <FormAcheterPageDropshipper/>
            </ProtectedRoute>
          } />

          {/* Routes protégées de ta camarade - sans requiredUserType spécifique */}
          <Route path="/demandes" element={
            <ProtectedRoute>
              <Demandes />
            </ProtectedRoute>
          } />
          
          <Route path="/MesModels" element={
            <ProtectedRoute>
              <MesModels />
            </ProtectedRoute>
          } />
          
          <Route path="/AddNewModel" element={
            <ProtectedRoute>
              <AddNewModel />
            </ProtectedRoute>
          } />
          
          <Route path="/couturiere/MyAccount" element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          } />
          
          <Route path="/affiliate/MyAccount" element={
            <ProtectedRoute>
              <AffiliateAccount />
            </ProtectedRoute>
          } />
          
          <Route path="/affiliateDashboard/codepromo" element={
            <ProtectedRoute>
              <AffiliateCodePromoDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/AffiliateDashboard/Statistics" element={
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/DemandesOffresFassou" element={
            <ProtectedRoute>
              <DemandesOffresFassou />
            </ProtectedRoute>
          } />

          {/* Routes protégées sans type spécifique */}
          <Route path="/popup" element={
            <ProtectedRoute>
              <Popupimages />
            </ProtectedRoute>
          } />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar
          closeOnClick
          draggable={false}
          pauseOnHover
          rtl={true}
          toastStyle={{
            backgroundColor: "#fff",
            color: "#333",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            padding: "20px",
            fontSize: "15px",
            fontFamily: "Tajawal, sans-serif",
            textAlign: "center",
            border: "1px solid #e5e5e5",
          }}
        />
      </ProtectedWrapper>
    </Router>
  );
}