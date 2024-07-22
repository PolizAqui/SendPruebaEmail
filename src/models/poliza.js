const pool = require('../utils/mysql.connect');

//--------------Verify Email --------------//

const verifyEmail = async ({ email }) => {
    try {
        const connection = await pool.getConnection();

        // Consulta para verificar si el correo electrónico existe en la base de datos
        const sqlEmail = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await connection.execute(sqlEmail, [email]);

        connection.release();

        if (rows.length === 0) {
            return {
                status: false,
                message: 'Email not found',
                code: 404,
            };
        } else {
            return {
                status: true,
                message: 'Email found',
                code: 200,
            };
        }
    } catch (err) {
        console.error('Error en verifyEmail:', err);
        return {
            status: false,
            message: 'Server error',
            code: 500,
            error: err,
        };
    }
};


module.exports = {
    verifyEmail,
};
