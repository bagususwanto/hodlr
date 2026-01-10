"use client";

import { Button } from "@/components/ui/button";
import { generateExcelReport, generatePDFReport } from "@/lib/reporting";
import { Download, FileText, TableProperties } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonsProps {
  data: any; // Using simplified type for now, corresponds to ReportData structure
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const handleExportPDF = () => {
    if (!data) return;
    generatePDFReport(data);
  };

  const handleExportExcel = () => {
    if (!data) return;
    generateExcelReport(data);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Export Report</span>
          <span className="lg:hidden">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <TableProperties className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
