const PDFDocument = require('pdfkit');

const generatePdfService = async (res,title) => {
    try {
         const change=title.split("-").join(" ")
         
        const doc = new PDFDocument();
        const filename = `documento-${Date.now()}.pdf`;

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text(`${change}`,{ align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text('Este es un documento PDF generado con Node.js y PDFKit.');
        doc.moveDown();
        doc.text(`Fecha de generación: ${new Date().toLocaleString()}`);

        doc.end(); 
    } catch (error) {
        console.error("Error en generatePdfService:", error);
        throw new Error("Error al generar el PDF");
    }
};

module.exports = { generatePdfService };
