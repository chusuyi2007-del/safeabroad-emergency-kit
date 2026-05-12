"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { CardPreview } from "@/components/CardPreview";
import { DeleteKitButton } from "@/components/DeleteKitButton";
import { KitLoader } from "@/components/KitLoader";
import { Shell } from "@/components/Shell";
import { buildCards, lockScreenText, updatedDate } from "@/lib/cards";
import type { KitRecord } from "@/lib/types";

function downloadUrl(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
}

async function capture(id: string) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing export node: ${id}`);
  return html2canvas(element, { backgroundColor: "#ffffff", scale: 2 });
}

function ExportContent({ kit }: { kit: KitRecord }) {
  const [busy, setBusy] = useState(false);
  const cards = useMemo(() => buildCards(kit), [kit]);

  async function exportPngs() {
    setBusy(true);
    try {
      for (const card of cards) {
        const canvas = await capture(`export-${card.id}`);
        downloadUrl(canvas.toDataURL("image/png"), `safeabroad-${card.id}.png`);
      }
      const lockCanvas = await capture("export-lock");
      downloadUrl(lockCanvas.toDataURL("image/png"), "safeabroad-lock-screen.png");
      const walletCanvas = await capture("export-wallet");
      downloadUrl(walletCanvas.toDataURL("image/png"), "safeabroad-wallet-card.png");
    } finally {
      setBusy(false);
    }
  }

  async function exportPdf() {
    setBusy(true);
    try {
      const pdf = new jsPDF({ unit: "pt", format: "letter" });
      const ids = [...cards.map((card) => `export-${card.id}`), "export-lock", "export-wallet", "export-medical-id"];

      for (let index = 0; index < ids.length; index += 1) {
        const canvas = await capture(ids[index]);
        const image = canvas.toDataURL("image/png");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const width = pageWidth - 72;
        const height = Math.min((canvas.height * width) / canvas.width, pageHeight - 72);

        if (index > 0) pdf.addPage();
        pdf.addImage(image, "PNG", 36, 36, width, height);
      }

      pdf.save("safeabroad-emergency-kit.pdf");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-ink">导出应急包</h1>
          <p className="mt-2 text-gray-700">可分别导出 PNG，或合并为一个 PDF。导出后可删除临时数据。</p>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            PNG 适合单张保存到相册或发给联系人；PDF 适合打印或存在云盘。导出文件可能包含敏感信息，请只保存到可信设备。
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button disabled={busy} onClick={exportPngs}>{busy ? "正在导出..." : "导出每张 PNG"}</Button>
          <Button disabled={busy} onClick={exportPdf} variant="secondary">导出完整 PDF</Button>
          <DeleteKitButton token={kit.token} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {cards.map((card) => (
            <CardPreview card={card} exportId={`export-${card.id}`} key={card.id} kit={kit} />
          ))}
          <article className="card-export rounded-md border border-line bg-white p-5" id="export-lock">
            <p className="text-sm font-bold uppercase tracking-wide text-calm">Lock-screen Card</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">只包含最少信息，适合放在手机锁屏、Medical ID 或紧急备注里。</p>
            <p className="mt-4 text-2xl font-bold leading-9">{lockScreenText(kit)}</p>
            <p className="mt-5 text-sm text-gray-500">Last updated: {updatedDate(kit)}</p>
          </article>
          <article className="card-export rounded-md border border-line bg-white p-5" id="export-wallet">
            <p className="text-sm font-bold uppercase tracking-wide text-calm">Printable Wallet Card</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">适合打印后放在钱包、学生证套或随身包里。请定期更新。</p>
            <p className="mt-3 text-lg font-semibold">Name: {kit.parent.studentEnglishName || "Student"}</p>
            <p className="mt-2">Interpreter: Mandarin Chinese</p>
            <p>Emergency contact: {kit.student.usContactName || kit.parent.familyContactName || "Contact"} / {kit.student.usContactPhone || kit.parent.familyContactPhone || "Phone"}</p>
            <p>Location: {kit.student.address || "Address"} {kit.student.floorRoom || ""}</p>
            <p className="mt-4 text-sm text-gray-500">Last updated: {updatedDate(kit)}</p>
          </article>
          <article className="card-export rounded-md border border-line bg-white p-5 lg:col-span-2" id="export-medical-id">
            <p className="text-sm font-bold uppercase tracking-wide text-calm">iPhone Medical ID Setup Guide</p>
            <h2 className="mt-3 text-2xl font-bold text-ink">复制到 iPhone Medical ID 的内容</h2>
            <div className="mt-4 space-y-2 leading-7 text-gray-700">
              <p>Medical Notes: I need a Mandarin medical interpreter. Emergency kit available.</p>
              <p>Allergies: Use the allergy text from the ER Medical Summary Card.</p>
              <p>Medications: Use the current medications text from the ER Medical Summary Card.</p>
              <p>Emergency Contacts: Add {kit.student.usContactName || kit.parent.familyContactName || "your emergency contact"} and phone {kit.student.usContactPhone || kit.parent.familyContactPhone || "phone number"}.</p>
              <p>中文说明：打开健康 App → 头像 → 医疗急救卡，复制以上英文摘要和紧急联系人。</p>
              <p>提醒：Medical ID 不适合放护照号、SSN、完整保险号或完整医疗文件。</p>
            </div>
            <p className="mt-5 text-sm text-gray-500">Last updated: {updatedDate(kit)}</p>
          </article>
        </div>
      </div>
    </Shell>
  );
}

export default function ExportPage({ params }: { params: { token: string } }) {
  return <KitLoader token={params.token}>{(kit) => <ExportContent kit={kit} />}</KitLoader>;
}
