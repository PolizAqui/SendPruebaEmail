const path = require('path');

const controller = {};

controller.sendPdf = async (req, res) => {
    try {
        const pdfPath = path.join(__dirname, '../assets/APIOCC01.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(pdfPath);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Error en el Servidor' });
    }
};

module.exports = controller;
