import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatCurrency } from "./utils";
import { Transaction } from "./db/schema";

interface ReportData {
  period: string;
  totalInvested: number;
  realizedPnL: number;
  winRate: number;
  portfolioValue: number;
  transactions: Transaction[];
  holdings: { symbol: string; quantity: number; value: number }[];
  assets: any[]; // Map or Array to resolve symbols
}

export function generatePDFReport(data: ReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.text("Portfolio Performance Report", pageWidth / 2, 20, {
    align: "center",
  });

  // Date/Period
  doc.setFontSize(12);
  doc.text(`Period: ${data.period}`, pageWidth / 2, 30, { align: "center" });
  doc.text(
    `Date Generated: ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    36,
    {
      align: "center",
    }
  );

  // Summary Metrics
  doc.line(20, 45, pageWidth - 20, 45); // Horizontal line

  doc.setFontSize(14);
  doc.text("Summary", 20, 55);
  doc.setFontSize(12);

  const metrics = [
    ["Total Invested", formatCurrency(data.totalInvested)],
    ["Portfolio Value", formatCurrency(data.portfolioValue)],
    ["Realized PnL", formatCurrency(data.realizedPnL)],
    ["Win Rate", `${data.winRate.toFixed(2)}%`],
  ];

  autoTable(doc, {
    startY: 60,
    head: [["Metric", "Value"]],
    body: metrics,
    theme: "striped",
    headStyles: { fillColor: [0, 0, 0] },
    margin: { left: 20, right: 20 },
  });

  // Holdings Table
  let finalY = (doc as any).lastAutoTable.finalY + 20;

  doc.setFontSize(14);
  doc.text("Current Holdings", 20, finalY);

  const holdingsData = data.holdings.map((h) => [
    h.symbol,
    h.quantity.toFixed(4),
    formatCurrency(h.value),
  ]);

  autoTable(doc, {
    startY: finalY + 5,
    head: [["Asset", "Quantity", "Value"]],
    body: holdingsData,
    theme: "striped",
    headStyles: { fillColor: [66, 66, 66] },
  });

  // Transaction History (Last 50?)
  finalY = (doc as any).lastAutoTable.finalY + 20;

  // Add new page if needed
  if (finalY > 250) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFontSize(14);
  doc.text("Recent Transactions", 20, finalY);

  const txData = data.transactions
    .slice(0, 50) // Limit to 50 for performance/size
    .map((t) => {
      const asset = data.assets.find((a) => a.id === t.assetId);
      return [
        new Date(t.date).toLocaleDateString(),
        t.type,
        asset?.symbol || "Unknown",
        t.quantity.toFixed(4),
        formatCurrency(t.price),
        formatCurrency(t.totalValue),
      ];
    });

  autoTable(doc, {
    startY: finalY + 5,
    head: [["Date", "Type", "Asset", "Qty", "Price", "Total"]],
    body: txData,
    theme: "plain",
    styles: { fontSize: 8 },
  });

  doc.save(`hodlr-report-${new Date().toISOString().split("T")[0]}.pdf`);
}

export function generateExcelReport(data: ReportData) {
  const wb = XLSX.utils.book_new();

  // 1. Summary Sheet
  const summaryData = [
    ["Metric", "Value"],
    ["Period", data.period],
    ["Generated Date", new Date().toLocaleDateString()],
    ["Total Invested", data.totalInvested],
    ["Portfolio Value", data.portfolioValue],
    ["Realized PnL", data.realizedPnL],
    ["Win Rate (%)", data.winRate],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // 2. Holdings Sheet
  const wsHoldings = XLSX.utils.json_to_sheet(data.holdings);
  XLSX.utils.book_append_sheet(wb, wsHoldings, "Holdings");

  // 3. Transactions Sheet
  // Flatten transaction object
  const flatTxs = data.transactions.map((t) => {
    const asset = data.assets.find((a) => a.id === t.assetId);
    return {
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type,
      Symbol: asset?.symbol || "Unknown",
      Quantity: t.quantity,
      Price: t.price,
      TotalValue: t.totalValue,
    };
  });
  const wsTxs = XLSX.utils.json_to_sheet(flatTxs);
  XLSX.utils.book_append_sheet(wb, wsTxs, "Transactions");

  XLSX.writeFile(
    wb,
    `hodlr-report-${new Date().toISOString().split("T")[0]}.xlsx`
  );
}
