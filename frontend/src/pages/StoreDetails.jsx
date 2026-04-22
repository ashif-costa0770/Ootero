// src/pages/StoreDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StatCard } from "../components/store/StatCard";
import { StatusBadge } from "../components/store/StatusBadge";
import { getStoreDetails } from "../services/store.api";
import { StoreInfoCard } from "../components/store/StoreInfoCard";

export default function StoreDetails() {
  const { storeId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  useEffect(() => {

    const numericStoreId = Number(storeId);
    if (!Number.isInteger(numericStoreId) || numericStoreId <= 0) {
      setError("Invalid store ID");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getStoreDetails(numericStoreId);
        setData(res.data.data);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load store details";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [storeId]);

  // ── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4 text-sm">Fetching store data...</p>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100 text-center max-w-sm">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="font-bold text-gray-800 mb-1">Something went wrong</h2>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const { store, stats } = data;

  const statCards = [
    {
      icon: "📦",
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      sub: "All time",
      color: "bg-indigo-100",
    },
    {
      icon: "🛍️",
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      sub: "In your catalog",
      color: "bg-purple-100",
    },
    {
      icon: "👥",
      label: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      sub: "Registered accounts",
      color: "bg-sky-100",
    },
    {
      icon: "💰",
      label: "Total Revenue",
      value: `$${parseFloat(stats.totalRevenue).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      sub: "Last 12 months",
      color: "bg-green-100",
    },
  ];

  const statusColors = {
    pending: "bg-yellow-400",
    processing: "bg-blue-500",
    onHold: "bg-orange-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
   
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                Connected
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>

            <a
              href={store.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-indigo-500 hover:underline mt-1 inline-block"
            >
              {store.url} ↗
            </a>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Connected on</p>
            <p className="font-medium text-gray-600">
              {new Date(store.connectedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* ── Stat Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Status Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Orders by Status
            </h2>
            <div className="flex flex-col gap-2">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <StatusBadge
                  key={status}
                  label={status}
                  count={count}
                  color={statusColors[status] || "bg-gray-500"}
                />
              ))}
            </div>
          </div>

          {/* Store Info Card */}
          <StoreInfoCard store={store} />
        </div>
      </div>
    </div>
  );
}
