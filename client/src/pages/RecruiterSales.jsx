import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineFilter, AiOutlineCloudDownload } from "react-icons/ai";
import { MdOutlineSearch } from "react-icons/md"; // Corrected import for MdOutlineSearch
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { MetaData } from "../components/MetaData";
import { Loader } from "../components/Loader";
import { getAllTransactionsAdminAction } from "../actions/AdminActions";
import { toast } from "react-toastify";
import { format } from "date-fns";

// PDF Export Function
const exportTransactionsToPDF = (dataToExport) => {
  if (!dataToExport || dataToExport.length === 0) {
    toast.warn("Không có dữ liệu để xuất PDF.");
    return;
  }

  const doc = new jsPDF({
    orientation: "landscape", // Changed to landscape for more columns
    unit: "mm",
    format: "a4",
    compress: true,
    putOnlyUsedFonts: true,
  });

  doc.setFontSize(16);
  doc.setTextColor(30);
  doc.text("Lich su giao dich", doc.internal.pageSize.getWidth() / 2, 20, {
    align: "center",
  });

  const currentDate = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Ngay xuat: ${currentDate}`,
    doc.internal.pageSize.getWidth() / 2,
    28,
    { align: "center" }
  );

  const headers = [
    { label: "ID", dataKey: "_id" },
    { label: "Ten", dataKey: "userName" },
    { label: "Email", dataKey: "userEmail" },
    { label: "Goi dich vu", dataKey: "packageTitle" },
    { label: "So tien", dataKey: "amount" },
    { label: "Tien te", dataKey: "currency" },
    { label: "Ngay thanh toan", dataKey: "paymentDate" },
  ];

  const rows = dataToExport.map((transaction) => [
    transaction._id,
    transaction.user?.name || "N/A",
    transaction.user?.email || "N/A",
    transaction.packageTitle,
    transaction.amount.toLocaleString("vi-VN"),
    transaction.currency,
    format(new Date(transaction.paymentDate), "dd/MM/yyyy HH:mm"),
  ]);

  autoTable(doc, {
    head: [headers.map((h) => h.label)], // Corrected head structure
    body: rows,
    startY: 35,
    theme: "grid",
    styles: {
      font: "helvetica", // Consider embedding a Vietnamese-supporting font if needed
      fontSize: 8, // Reduced font size for landscape and more columns
      cellPadding: 1.5,
      halign: "left",
    },
    headStyles: {
      fillColor: [0, 120, 215],
      textColor: 255,
      fontSize: 9,
      halign: "center",
    },
    columnStyles: {
      // Align amount to the right
      4: { halign: "right" },
      5: { halign: "center" },
    },
  });

  const fileName = `transactions_export_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
  toast.success("Đã xuất file PDF thành công!");
};

export const RecruiterSales = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPackageFilter, setSelectedPackageFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // For controlling filter dropdown visibility
  const { allTransactionsList, transactionsLoading, transactionsError } =
    useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllTransactionsAdminAction());
  }, [dispatch]);
  // Memoize filtered transactions to avoid re-calculating on every render unless dependencies change
  const filteredTransactions = React.useMemo(() => {
    return (
      allTransactionsList?.filter((transaction) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          transaction.user?.name?.toLowerCase().includes(searchLower) ||
          transaction.user?.email?.toLowerCase().includes(searchLower) ||
          transaction.packageTitle?.toLowerCase().includes(searchLower) ||
          transaction._id?.toLowerCase().includes(searchLower);

        const matchesPackage =
          selectedPackageFilter === "all" ||
          transaction.packageTitle === selectedPackageFilter;

        return matchesSearch && matchesPackage;
      }) || []
    );
  }, [searchQuery, selectedPackageFilter]);

  useEffect(() => {
    if (transactionsError) {
      toast.error(transactionsError);
      // Optionally clear the error from Redux state if needed
    }
  }, [transactionsError]);

  const columns = [
    { header: "ID Giao dịch", accessor: "_id" },
    { header: "Tên", accessor: "userName" },
    { header: "Email", accessor: "userEmail" },
    { header: "Gói dịch vụ", accessor: "packageTitle" },
    { header: "Số tiền", accessor: "amount" },
    { header: "Tiền tệ", accessor: "currency" },
    { header: "Ngày thanh toán", accessor: "paymentDate" },
  ];

  return (
    <>
      <MetaData title="Lịch sử Giao dịch Tuyển dụng" />
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen pt-14 md:px-20 px-3 text-gray-900">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Lịch sử Giao dịch
          </h1>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, gói..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm hover:shadow-md"
              />
              <MdOutlineSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            {/* Filter Dropdown - Basic for Package Title */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
              >
                <AiOutlineFilter className="text-blue-500" size={20} />
                <span>Lọc theo gói</span>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-10 py-1">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedPackageFilter("all");
                      setIsFilterOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm ${
                      selectedPackageFilter === "all"
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    Tất cả các gói
                  </a>
                  {[
                    ...new Set(
                      allTransactionsList?.map((t) => t.packageTitle) || []
                    ),
                  ].map((pkgTitle) => (
                    <a
                      key={pkgTitle}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPackageFilter(pkgTitle);
                        setIsFilterOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm ${
                        selectedPackageFilter === pkgTitle
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      {pkgTitle}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {/* Placeholder for Export PDF button */}
            <button
              onClick={() => exportTransactionsToPDF(filteredTransactions)} // Pass filtered data
              disabled={
                !filteredTransactions || filteredTransactions.length === 0
              }
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AiOutlineCloudDownload size={20} />
              <span>Xuất PDF</span>
            </button>
          </div>
        </div>
        {transactionsLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.accessor}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Display filtered transactions */}
                {filteredTransactions.length === 0 && !transactionsLoading && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        <MdOutlineSearch size={48} className="text-blue-400" />
                        <p className="text-xl font-semibold text-blue-700">
                          Không tìm thấy giao dịch
                        </p>
                        <p className="text-gray-500">
                          Vui lòng thử lại với từ khóa hoặc bộ lọc khác.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {/* End of displaying filtered transactions */}
                {transactionsLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        {/* You can add an icon here like in ViewAllUsersAdmin if you have one for transactions */}
                        {/* e.g., <FaFileInvoiceDollar size={48} className="text-blue-400" /> */}
                        <p className="text-xl font-semibold text-blue-700">
                          Không có giao dịch nào
                        </p>
                        <p className="text-gray-500">
                          Hiện tại chưa có lịch sử giao dịch nào được ghi nhận.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allTransactionsList?.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-blue-50 transition-colors duration-150 even:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.user?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.user?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.packageTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        {transaction.amount.toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                        {transaction.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {format(
                          new Date(transaction.paymentDate),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
