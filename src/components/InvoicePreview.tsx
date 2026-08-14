import React, { useRef, useState } from 'react';
import { Download, Printer, Send, CheckCircle2, Building, Mail, Phone, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice, User } from '../types';

interface InvoicePreviewProps {
  invoice: Invoice;
  user: User | null;
  onSend?: () => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, user, onSend }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setDownloading(true);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber || 'Invoice'}_Extract.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback print dialog if html2canvas fails
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleSendInvoice = () => {
    if (onSend) onSend();
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  const formatCurrency = (amount: number) =>
    '¢' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200/80">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Preview</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              invoice.status === 'Paid'
                ? 'bg-emerald-100 text-emerald-700'
                : invoice.status === 'Sent'
                ? 'bg-blue-100 text-blue-700'
                : invoice.status === 'Overdue'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {invoice.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-purple-200 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Exporting PDF...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handleSendInvoice}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Invoice</span>
          </button>
        </div>
      </div>

      {sentSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Invoice dispatched to {invoice.clientEmail || invoice.clientName} successfully!</span>
        </div>
      )}

      {/* Printable Invoice Container Matching Screenshot Design */}
      <div
        ref={printRef}
        className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200/80 text-slate-800 max-w-3xl mx-auto space-y-8 font-sans"
      >
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                E
              </div>
              <h2 className="text-xl font-bold text-indigo-950 tracking-tight">
                {user?.companyName || 'Extract Financials'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">
              {user?.companyAddress || 'Accra - Ghana\nhello@extract.com\n+233 24 123 4567'}
            </p>
          </div>

          <div className="sm:text-right">
            <h1 className="text-2xl font-black text-purple-600 uppercase tracking-wider mb-2">
              INVOICE
            </h1>
            <p className="text-sm font-extrabold text-slate-900">{invoice.invoiceNumber}</p>
            <div className="mt-2 text-xs space-y-1 text-slate-500">
              <p><span className="font-semibold text-slate-700">Issue Date:</span> {invoice.issueDate}</p>
              <p><span className="font-semibold text-slate-700">Due Date:</span> {invoice.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Billed To Section */}
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest block mb-1">
              BILLED TO
            </span>
            <h3 className="text-sm font-bold text-slate-900">{invoice.clientName}</h3>
            {invoice.clientAttn && (
              <p className="text-xs text-slate-500">Attn: {invoice.clientAttn}</p>
            )}
            <p className="text-xs text-slate-500 leading-relaxed mt-1 whitespace-pre-line">
              {invoice.clientAddress || 'Client Address Unspecified'}
            </p>
          </div>

          {invoice.clientEmail && (
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700 block mb-0.5">Contact Email:</span>
              <p className="text-purple-700 font-medium">{invoice.clientEmail}</p>
            </div>
          )}
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 pr-4 font-bold">DESCRIPTION</th>
                <th className="py-3 px-2 font-bold text-center">QTY</th>
                <th className="py-3 px-2 font-bold text-right">RATE</th>
                <th className="py-3 pl-4 font-bold text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-4 font-semibold text-slate-800">{item.description}</td>
                    <td className="py-3.5 px-2 text-center text-slate-600">{item.qty}</td>
                    <td className="py-3.5 px-2 text-right text-slate-600">{formatCurrency(item.rate)}</td>
                    <td className="py-3.5 pl-4 text-right font-bold text-slate-900">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-400 italic">
                    No items listed
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Summary Box */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-4 border-t border-slate-100">
          <div className="max-w-xs">
            <p className="text-xs font-semibold text-slate-700 mb-1">Payment Instructions / Notes:</p>
            <p className="text-xs text-slate-500 italic bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              {invoice.notes || 'Payment due within 30 days.'}
            </p>
          </div>

          <div className="w-full sm:w-64 bg-purple-600 text-white p-5 rounded-2xl shadow-lg shadow-purple-600/20 space-y-2">
            <div className="flex justify-between text-xs text-purple-100">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between text-xs text-purple-100">
                <span>Tax ({invoice.taxPercent}%)</span>
                <span className="font-semibold">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-200">
                <span>Discount</span>
                <span className="font-semibold">-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-purple-400/50">
              <span>Total Due</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center pt-8 border-t border-slate-100 text-[10px] text-slate-400">
          Thank you for trusting {user?.companyName || 'Extract Financials'}. For billing inquiries, contact hello@extract.com.
        </div>
      </div>
    </div>
  );
};
