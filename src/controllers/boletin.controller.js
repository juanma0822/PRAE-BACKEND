const { generateBoletinPdf } = require('../services/generateBoletinPdf.service');

const getBoletinPdf = async (req, res) => {
  const { documento_identidad } = req.params;

  try {
    const pdfBuffer = await generateBoletinPdf(documento_identidad);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="boletin-${documento_identidad}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.end(pdfBuffer); // 💯
  } catch (error) {
    console.error('Error generando el boletín:', error);

    // Para desarrollo: log completo
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: error.message });
    }

    res.status(500).json({ error: 'Error al generar el boletín PDF' });
  }
};

module.exports = { getBoletinPdf };
