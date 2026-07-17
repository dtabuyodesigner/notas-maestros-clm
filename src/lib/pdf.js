import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// Genera y descarga un PDF con el ranking de la especialidad (con la línea de
// corte marcada). `filas` = salida de ordenarConCorte (fila, posicion, entra).
export function exportarPDF({ especialidad, plazas, filas }) {
  const doc = new jsPDF()

  doc.setFontSize(14)
  doc.text('Notas Oposición · Maestros CLM 2026', 14, 16)
  doc.setFontSize(10)
  doc.setTextColor(90)
  doc.text(`${especialidad} — ${filas.length} notas · ${plazas} plazas`, 14, 23)
  doc.setFontSize(7)
  doc.text('Orientativo · datos autoinformados, no oficiales · el corte real lo fija la Administración', 14, 28)
  doc.setTextColor(0)

  const body = []
  filas.forEach(({ fila, posicion }, i) => {
    if (i === plazas) {
      body.push([{
        content: `— corte estimado · ${plazas} plazas —`, colSpan: 3,
        styles: { halign: 'center', fillColor: [254, 226, 226], textColor: [185, 28, 28], fontStyle: 'bold' },
      }])
    }
    body.push([posicion, fila.nombre || fila.dni_parcial || 'Anónimo', String(Number(fila.nota))])
  })

  autoTable(doc, {
    startY: 32,
    head: [['#', 'Nombre', 'Nota']],
    body,
    styles: { fontSize: 8, cellPadding: 1.5 },
    headStyles: { fillColor: [79, 70, 229] },
    columnStyles: { 0: { cellWidth: 15 }, 2: { cellWidth: 28, halign: 'right' } },
  })

  const slug = especialidad.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-')
  doc.save(`notas-${slug}-clm2026.pdf`)
}
