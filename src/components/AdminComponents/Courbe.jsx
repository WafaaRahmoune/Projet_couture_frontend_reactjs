import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import useErreur401Handler from '../generalComponents/Erreur401Handle';

const Courbe = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { handle401Error } = useErreur401Handler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        
       

        const response = await fetch(
          "http://127.0.0.1:8000/adminapi/gettotalbenificefromsalingproductspersonlaised&standardinmonth",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

         if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchData();
        }
      }
      else 

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const result = await response.json();
        
        // Transformer les données de l'API pour les adapter au graphique
        const formattedData = Object.entries(result.daily_benefits).map(([date, benefits]) => ({
          date: date, // Format: "YYYY-MM-DD"
          total_benefit: benefits.total_benefit,
        }));
        
        setData(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        direction: "rtl", 
        textAlign: "center",
        padding: "20px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: "#374151", marginBottom: "10px" }}>
          تطور الأرباح خلال 30 يوم
        </h2>
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        direction: "rtl", 
        textAlign: "center",
        padding: "20px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: "#374151", marginBottom: "10px" }}>
          تطور الأرباح خلال 30 يوم
        </h2>
        <p style={{ color: "red" }}>خطأ: {error}</p>
      </div>
    );
  }

  // Trouver la valeur maximale pour ajuster dynamiquement l'échelle Y
  const maxBenefit = Math.max(...data.map(item => item.total_benefit));

  return (
    <div style={{ 
      direction: "rtl", 
      textAlign: "center",
      padding: "20px",
      borderRadius: "12px",
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      marginBottom: "30px"
    }}>
      <h2 style={{ color: "#374151", marginBottom: "10px" }}>
        تطور الأرباح خلال 30 يوم
      </h2>

      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 50, left: 70, bottom: 50 }}
          >
            {/* ✅ Zone colorée à l'intérieur du graphique */}
            <ReferenceArea
              x1={data[0]?.date} 
              x2={data[data.length - 1]?.date}   // couvre tout l'axe X
              y1={0} 
              y2={maxBenefit * 1.1} // ajusté dynamiquement
              fill="#FAF3DD"
              fillOpacity={1}
            />

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fill: "#101011ff" }}
              tickMargin={10}
              label={{ 
                value:"التاريخ", 
                position: "insideBottomRight",
                dy: 25, 
                fill: "#111827",
                fontSize: "14px"
              }}
            />

            <YAxis
              domain={[0, maxBenefit * 1.1]} // Ajustement dynamique avec marge
              tick={{ fill: "#101011ff" }}
              tickMargin={15}
              tickLine={false}
              label={{ 
                value: "إجمالي الأرباح", 
                angle: -90, 
                position: "insideTopLeft", 
                dx: -10,
                dy: 20,
                fill: "#111827",
                fontSize: "14px"
              }}
            />

            <Tooltip
              formatter={(value) => [`${value} د.ج`, "الأرباح"]}
              labelFormatter={(label) => `التاريخ: ${label}`}
              contentStyle={{ 
                borderRadius: "8px",
                textAlign: "right",
                direction: "rtl"
              }}
            />

            <Line 
              type="monotone" 
              dataKey="total_benefit" 
              stroke="#E5B62B" 
              strokeWidth={2} 
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Courbe;