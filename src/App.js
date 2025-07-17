import React, { useState } from "react";
import axios from "axios";

function App() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  const normalizeNumber = (input) => {
    return input.replace(/\D/g, "").replace(/^(\+?2|002)?/, "");
  };

  const handleSearch = async () => {
    if (!phone) {
      setResult({ type: "warning", message: "يرجى إدخال رقم أولاً." });
      return;
    }

    setStatus("loading");
    setResult(null);

    try {
    const baseURL = "https://7053a43b-27f1-42a1-8a1c-d887831f3f03-00-1ijb7rrt1ctvi.riker.replit.dev";
    const response = await axios.get(`${baseURL}/check_number`, {
      params: { phone: normalizeNumber(phone) },
    });

      if (response.status === 200) {
        if (response.data.found) {
          setResult({
            type: "success",
            message: ` الرقم ${response.data.raw_input} نصاب و موجود في البيانات.`,
            row: response.data.row,
          });
        } else {
          setResult({
            type: "error",
            message: response.data.message || ` الرقم ${phone} غير موجود.ممكن يكون نصاب بس لسه متسجلش في الداتا معنى كدا اننا معندناش بيانات ليه، ممكن يبقى نصاب ولسة متسجلش، وممكن يكون امان فخد احتياطاتك \n No risk No rizk`,
          });
        }
      }
    } catch (error) {
      console.error("Request failed:", error);
      setResult({
        type: "error",
        message:
          error?.response?.data?.details ||
          " لم يتم تلقي أي رد من الخادم. تحقق من أن الخادم يعمل وأن الاتصال صحيح.",
      });
    }

    setStatus("idle");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 space-y-8">
        <div className="text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 p-1 shadow-inner">
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`} 
              alt="logo" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-400 mt-3">الموقع مدعوم بالكامل من قبل فريق UFRC</p>
          <div>
            <a href="https://chat.whatsapp.com/HHDi9FdBzKp09Qp27Rd9LU" className="text-blue-400 hover:underline text-sm">
              لينك الجروب
            </a>
          </div>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSe3nP9yS7Bj227inkn5JH_jxI-1PD599qbkMj1QIfLKaHe5YQ/viewform" className="text-blue-400 hover:underline text-sm">
            لينك البلاغ
          </a>
        </div>

        <h1 className="text-2xl font-bold text-center text-indigo-400">البحث عن الرقم في داتا النصابين</h1>

        <input
          type="text"
          placeholder="أدخل الرقم الذي ترغب في البحث عنه"
          className="w-full p-4 rounded-xl text-right bg-white dark:bg-gray-800 border dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:text-white"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

<div className="flex justify-center">
  <button
    onClick={handleSearch}
    disabled={status === "loading"}
    className="w-60 py-3 px-8 rounded-full font-semibold text-indigo-600 border border-indigo-600 bg-transparent transition duration-300 ease-in-out hover:bg-indigo-600 hover:text-white disabled:opacity-50"
  >
    {status === "loading" ? "جاري البحث..." : "بحث"}
  </button>
</div>


        {result && (
          <div
            className={`p-5 rounded-xl text-sm ${
              result.type === "success"
                ? "bg-green-100 text-green-900"
                : result.type === "error"
                ? "bg-red-100 text-red-900"
                : "bg-yellow-100 text-yellow-900"
            }`}
          >
            <p>{result.message}</p>
            {result.row && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full table-auto text-right text-sm border rounded-lg">
                  <tbody>
                    <tr className="bg-gray-100">
                      {result.row.map((cell, idx) => (
                        <td key={idx} className="px-3 py-2 border">{cell}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;