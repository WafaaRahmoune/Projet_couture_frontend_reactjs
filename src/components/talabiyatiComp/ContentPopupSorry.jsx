import '../../style/talabiyatiStyle/ContentPopupSorry.css';
import vrai from "../../assets/icons/true.png";
import one from "../../assets/icons/one.png";
import two from "../../assets/icons/two.png";
import three from "../../assets/icons/three.png";
import four from "../../assets/icons/four.png";


export default function ContentPopupSorry() {
  return (
    <div className="ContentPopupSorry">
      <div className="Composant">
           <div className="titlecontenu">  
             قواعد العمل معنا :
             </div>
           <div className="contenuComposant">
            <div className="elementline">
              <img src={vrai} alt="true" className='iconcomp'/>
               نتواصل معك هاتفياً لتأكيد تفاصيل الطلب والعنوان
            </div>

             <div className="elementline">
              <img src={vrai} alt="true" className='iconcomp'/>
نرسل لك رسائل على الواتساب لمتابعة حالة الطلب 
           </div>

             <div className="elementline">
              <img src={vrai} alt="true" className='iconcomp'/>
 نحترم المواعيد المحددة للتسليم والاستلام 
            </div>

             <div className="elementline">
              <img src={vrai} alt="true" className='iconcomp'/>
نحتاج تعاونك لإتمام الطلب بنجاح  
          </div>
           </div>


           
      </div>

      <div className="Composant">
 <div className="titlecontenu">  
الأسباب المحتملة لالغاء طلبك:
             </div>
           <div className="contenuComposant">
            <div className="elementline">
              <img src={one} alt="true" className='iconcomp' />
عدم الرد على المكالمات الهاتفية المتكررة لتأكيد الطلب 
           </div>

             <div className="elementline">
              <img src={two} alt="true" className='iconcomp'/>
الغاؤك للطلب بنفسك عبر رسائل الواتساب       
    </div>

             <div className="elementline">
              <img src={three} alt="true" className='iconcomp' />
تأخير في تأكيد العنوان أو تغييره المستمر     
       </div>

             <div className="elementline">
              <img src={four} alt="true" className='iconcomp'/>
عدم استلام الطلب في الموعد المحدد دون إشعار مسبق  
        </div>
           </div>


      </div>
    </div>
  );
}
