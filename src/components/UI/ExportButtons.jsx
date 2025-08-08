import React from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { FaFileWord } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";
import SwalHelper from "../../utils/SwalHelper";

const ExportButtons = ({ userList, getRoleLabel }) => {
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const tableColumn = [
        "Nom",
        "Email",
        "Rôle",
        "Téléphone",
        "Poste",
        "Département",
        "Date d'embauche",
      ];
      const tableRows = userList.map((user) => [
        user.name,
        user.email,
        getRoleLabel(user.role),
        user.phone || "-",
        user.poste || "-",
        user.department,
        new Date(user.joinDate).toLocaleDateString(),
      ]);
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 8 },
        margin: { top: 20 },
      });
      doc.save("utilisateurs.pdf");
    } catch (error) {
      SwalHelper.error("Erreur", "Échec de l'exportation PDF");
    }
  };

  const exportToExcel = () => {
    try {
      const data = userList.map((user) => ({
        Nom: user.name,
        Email: user.email,
        Rôle: getRoleLabel(user.role),
        Téléphone: user.phone || "-",
        Poste: user.poste || "-",
        Département: user.department,
        "Date d'embauche": new Date(user.joinDate).toLocaleDateString(),
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Utilisateurs");
      XLSX.writeFile(workbook, "utilisateurs.xlsx");
    } catch (error) {
      SwalHelper.error("Erreur", "Échec de l'exportation Excel");
    }
  };

  const exportToWord = async () => {
    try {
      const rows = [
        new TableRow({
          children: [
            "Nom",
            "Email",
            "Rôle",
            "Téléphone",
            "Poste",
            "Département",
            "Date d'embauche",
          ].map(
            (header) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: header, bold: true })],
                  }),
                ],
              })
          ),
        }),
        ...userList.map(
          (user) =>
            new TableRow({
              children: [
                user.name,
                user.email,
                getRoleLabel(user.role),
                user.phone || "-",
                user.poste || "-",
                user.department,
                new Date(user.joinDate).toLocaleDateString(),
              ].map(
                (text) =>
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun(text)] }),
                    ],
                  })
              ),
            })
        ),
      ];

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Liste des Utilisateurs",
                    size: 24,
                    bold: true,
                  }),
                ],
                spacing: { after: 300 },
              }),
              new Table({ rows, width: { size: 100, type: "pct" } }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "utilisateurs.docx");
    } catch (error) {
      SwalHelper.error("Erreur", "Échec de l'exportation Word");
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        onClick={exportToPDF}
      >
        <FileText size={18} />
        <span>PDF</span>
      </button>
      <button
        className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={exportToExcel}
      >
        <FileSpreadsheet size={18} />
        <span>Excel</span>
      </button>
      <button
        className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        onClick={exportToWord}
      >
        <FaFileWord size={18} />
        <span>Word</span>
      </button>
    </div>
  );
};

export default ExportButtons;
