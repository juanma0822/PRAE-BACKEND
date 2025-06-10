const { generateBoletinPdf, generateBoletinFinalPdf } = require('../services/generateBoletinPdf.service');

const getBoletinPdfEstudiante = async (req, res) => {
  const {documento_identidad} = req.params; 
  try {
    const pdfBuffer = await generateBoletinFinalPdf(documento_identidad);

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

const getBoletinPdf = async (req, res) => {
  const documento_identidad = req.user.id; // o req.user.documento_identidad según tu token

  try {
    const pdfBuffer = await generateBoletinPdf(documento_identidad);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="boletin-${documento_identidad}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.error('Error generando el boletín:', error);

    // Para desarrollo: log completo
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: error.message });
    }

    res.status(500).json({ error: 'Error al generar el boletín PDF' });
  }
};

const getBoletinFinalPdf = async (req, res) => {
  const documento_identidad = req.user.id;
  try {
    const pdfBuffer = await generateBoletinFinalPdf(documento_identidad);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="boletin-final-${documento_identidad}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.error('Error generando el boletín final:', error);
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al generar el boletín final PDF' });
  }
};

module.exports = { getBoletinPdfEstudiante, getBoletinPdf, getBoletinFinalPdf };
