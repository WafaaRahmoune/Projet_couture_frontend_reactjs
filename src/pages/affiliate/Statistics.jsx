// pages/affiliateDashboard/StatisticsPage.jsx
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance"; 
import SidePanel from "@/components/ui/SidePanelAffilie";
import { Tag, BarChart3, User } from "lucide-react";

const menuItems = [
  { label: "أكواد التخفيض", icon: <Tag size={20} />, path: "/affiliateDashboard/codepromo" },
  { label: "الإحصائيات", icon: <BarChart3 size={20} />, path: "/affiliateDashboard/statistics" },
  { label: "حسابي", icon: <User size={20} />, path: "/affiliate/MyAccount" },
];

export default function StatisticsPage() {
  const [orders, setOrders] = useState([]);
  const [totals, setTotals] = useState({
    total_orders: 0,
    total_discounts: 0,
    total_profit: 0,
  });
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/affiliate/orders/");
        setOrders(res.data.orders);
        setTotals(res.data.totals);
      } catch (err) {
        console.error("Error fetching affiliate orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SidePanel menuItems={menuItems}>
      <div className="flex flex-col w-full h-full space-y-4 pb-4 px-4 overflow-x-hidden">
        
        {/* Titre */}
        <h2 className="font-semibold text-xl text-[#182544]">
          إحصائيات عامة حول أكواد التخفيض:
        </h2>

        {/* ✅ Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 text-center bg-white">
          <div className="rounded-2xl bg-[#FCFBFB] shadow-md py-3 px-6">
            <div className="text-2xl font-bold text-yellow-500">
              {totals.total_discounts} دج
            </div>
            <div className="text-gray-700 font-medium">إجمالي التخفيضات</div>
          </div>
          <div className="rounded-2xl bg-[#FCFBFB] shadow-md py-3 px-6">
            <div className="text-2xl font-bold text-gray-800">
              {totals.total_orders}
            </div>
            <div className="text-gray-700 font-medium">إجمالي عدد الطلبات</div>
          </div>
          <div className="rounded-2xl bg-[#FCFBFB] shadow-md py-3 px-6">
            <div className="text-2xl font-bold text-green-600">
              {totals.total_profit} دج
            </div>
            <div className="text-gray-700 font-medium">إجمالي الربح</div>
          </div>
        </div>

        {/* ✅ Mobile horizontal scroll with spacing */}
        <div className="flex md:hidden space-x-4 overflow-x-auto pb-2 px-1">
          <div className="min-w-[200px] rounded-2xl bg-[#FCFBFB] shadow-md py-3 ml-4 px-6 text-center">
            <div className="text-xl font-bold text-yellow-500">{totals.total_discounts} دج</div>
            <div className="text-gray-700 text-sm  ">إجمالي التخفيضات</div>
          </div>
          <div className="min-w-[200px] rounded-2xl bg-[#FCFBFB] shadow-md py-3 px-6  text-center">
            <div className="text-xl font-bold text-gray-800">{totals.total_orders}</div>
            <div className="text-gray-700 text-sm">إجمالي عدد الطلبات</div>
          </div>
          <div className="min-w-[200px] rounded-2xl bg-[#FCFBFB] shadow-md py-3  ml-6 px-6 text-center">
            <div className="text-xl font-bold text-green-600">{totals.total_profit} دج</div>
            <div className="text-gray-700 text-sm">إجمالي الربح</div>
          </div>
        </div>

        {/* Titre tableau */}
        <h2 className="font-semibold text-xl text-[#182544]">
          تفاصيل طلبات أكواد التخفيض:
        </h2>

        {/* ✅ Desktop Table */}
        <div className="hidden md:block bg-[#FCFBFB] rounded-2xl w-full shadow-md border max-h-[500px] overflow-y-auto">
          <div className="sticky top-0 grid grid-cols-7 gap-4 p-4 bg-[#FCFBFB] border-b-2 border-[#E5B62B] 
                          text-center font-semibold text-[#E5B62B] shadow-sm z-10">
            <div>#</div>
            <div>تاريخ الطلب</div>
            <div>كود التخفيض</div>
            <div>كود المنتج</div>
            <div>الكمية</div>
            <div>المبلغ بعد التخفيض</div>
            <div>ربح الأفلييت</div>
          </div>

          <div className="divide-y">
            {orders.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-7 gap-4 p-4 text-center hover:bg-gray-50 transition-colors"
              >
                <div>{index + 1}</div>
                <div>{new Date(row.created_at).toLocaleDateString("ar-DZ")}</div>
                <div>{row.promo_code}</div>
                <div>{row.fashion_model_code}</div>
                <div>{row.quantity}</div>
                <div>{row.final_price} دج</div>
                <div className="text-green-600 font-semibold">{row.affiliate_profit} دج</div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Mobile Cards */}
        <div className="block md:hidden space-y-4">
          {orders.map((row, index) => (
            <div
              key={index}
              className="border-2 border-[#999EA6] rounded-2xl p-4 shadow-sm bg-white"
            >
              {/* Header with رقم الطلب + toggle button */}
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-gray-800">رقم الطلب : {index + 1}</h2>
                <button
                  onClick={() => toggleExpand(index)}
                  className="text-blue-600 text-sm font-semibold"
                >
                  {expanded[index] ? "عرض أقل ..." : "عرض المزيد ..."}
                </button>
              </div>

              {expanded[index] && (
                <div className="mt-3 text-sm space-y-2">
                  <p>
                    <span className="font-semibold text-[#E5B62B]">تاريخ الطلب:</span>{" "}
                    <span className="text-[#182544]">
                      {new Date(row.created_at).toLocaleDateString("ar-DZ")}
                    </span>
                  </p>
                  <hr />
                  <p>
                    <span className="font-semibold text-[#E5B62B]">كود التخفيض:</span>{" "}
                    <span className="text-[#182544]">{row.promo_code}</span>
                  </p>
                  <hr />
                  <p>
                    <span className="font-semibold text-[#E5B62B]">كود المنتج:</span>{" "}
                    <span className="text-[#182544]">{row.fashion_model_code}</span>
                  </p>
                  <hr />
                  <p>
                    <span className="font-semibold text-[#E5B62B]">الكمية:</span>{" "}
                    <span className="text-[#182544]">{row.quantity}</span>
                  </p>
                  <hr />
                  <p>
                    <span className="font-semibold text-[#E5B62B]">المبلغ بعد التخفيض:</span>{" "}
                    <span className="text-[#182544]">{row.final_price} دج</span>
                  </p>
                  <hr />
                  <p>
                    <span className="font-semibold text-[#E5B62B]">ربح الأفلييت:</span>{" "}
                    <span className="text-green-600 font-bold">{row.affiliate_profit} دج</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SidePanel>
  );
}
