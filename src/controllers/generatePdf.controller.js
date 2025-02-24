const { generatePdfService } = require("../services/generatePdf.service");

const generatePdf = async (req, res) => {
    try {
        const {title}=req.params
        console.log(title)
        await generatePdfService(res,title); 
    } catch (e) {
        console.error("Error en el controlador", e);
        res.status(500).send("Error al generar el PDF");
    }
};

module.exports = { generatePdf };
