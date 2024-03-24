const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql2/promise');
const app = express();
const expresssession = require('express-session');
const fs = require('fs');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../Vistas'));
app.use(expresssession({
    secret: 'YV',
    resave: false,
    saveUninitialized: false
}));

const db = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: "",
    database: "mdb"
});


app.post('/Crear', async(req, res) => {
    const { Nombre, TipoDocumento, Documento } = req.body;
    try {
        const [indicador] = await db.query('SELECT * FROM usuarios WHERE Documento=? AND TipoDocumento=?', [Documento, TipoDocumento, ]);
        if (indicador.length > 0) {
            res.status(409).send(`<script>alert('Ya existe este usuario');window.location.href="/Vistas/Registro.html";</script>`);
        } else {
            await db.query('INSERT INTO usuarios (Nombre, TipoDocumento, Documento, Rol) VALUES (?, ?, ?, ?)', [Nombre, TipoDocumento, Documento, "usuario"]);
            res.status(201).send(`<script>alert('Su registro fue completado');window.location.href='Iniciodesesion.html';</script>`);
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send("<script>alert('Error en el servidor');window.location.href='Iniciodesesion.html';</script>");
    }
});

app.post("/Iniciar", async(req, res) => {
    const { TipoDocumento, Documento, Man } = req.body;
    try {
        const [usuario] = await db.query('SELECT * FROM usuarios WHERE Documento=? AND TipoDocumento=?', [Documento, TipoDocumento]);
        if (usuario.length > 0) {
            if (usuario[0].Rol === "Administrador") {
                res.redirect(`/Admin?usuario=${usuario[0].Nombre}`);
            } else {
                res.redirect(`/Bienvenida?usuario=${usuario[0].Nombre}`);
            }
        } else {
            res.status(401).send("No existes");
        }
    } catch (error) {
        console.error("Error en el servidor: ", error);
        res.status(500).send("<script>alert('Error en el servidor');window.location.href='Iniciodesesion.html';</script>");
    }
});

app.get('/Bienvenida', (req, res) => {
    res.sendFile('Usuarios.html', { root: __dirname + '/../Vistas' });
});

app.get('/Admin', (req, res) => {
    res.sendFile('Admin.html', { root: __dirname + '/../Vistas' });
});

app.post('/obtener-servicios-usuario', async(req, res) => {
    try {
        const [serviciosData] = await db.query(`
            SELECT Nombre 
            FROM servicios
        `);

        res.json({ servicios: serviciosData.map(row => row.Nombre) });
    } catch (error) {
        console.log('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/guardar-servicios-usuario', async(req, res) => {
    const { usuario, servicios, fecha } = req.body;
    try {
        const [usuarioRow] = await db.query('SELECT Id_usuario FROM usuarios WHERE Nombre = ?', [usuario]);
        const userId = usuarioRow[0].Id_usuario;
        for (const servicio of servicios) {
            await db.query('INSERT INTO solicitudes (Id_usuario, Codigo_servicio, Fecha) VALUES (?, (SELECT Codigo_servicio FROM servicios WHERE Nombre = ?), ?)', [userId, servicio, fecha]);
        }
        res.status(201).send('Servicios guardados correctamente');
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/obtener-solicitudes-usuario', async(req, res) => {
    const { usuario } = req.body;
    try {
        const [usuarioRow] = await db.query('SELECT Id_usuario FROM usuarios WHERE Nombre = ?', [usuario]);
        const userId = usuarioRow[0].Id_usuario;
        const [solicitudesData] = await db.query(`
            SELECT s.ID_solicitud, s.Fecha, se.Nombre 
            FROM solicitudes s 
            INNER JOIN servicios se ON s.Codigo_servicio = se.Codigo_servicio 
            WHERE s.Id_usuario = ?`, [userId]);
        res.json({ solicitudes: solicitudesData });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/borrar-solicitud', async(req, res) => {
    const { solicitudId } = req.body;
    try {
        await db.query('DELETE FROM solicitudes WHERE ID_solicitud = ?', [solicitudId]);
        res.status(200).send('Solicitud borrada correctamente');
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/obtener-manzanas-registradas', async(req, res) => {
    try {
        const [manzanasData] = await db.query('SELECT * FROM manzanas');
        res.json({ manzanas: manzanasData });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/actualizar-manzana', (req, res) => {
    const { manzanaId, nombre, localidad, direccion, codigoServicio } = req.body;

    // Aquí deberías actualizar la manzana en tu base de datos
    // Este es solo un ejemplo y necesitarás adaptarlo a tu base de datos y modelo de datos
    const query = `UPDATE manzanas SET Nombre = ?, Localidad = ?, Dirección = ?, Codigo_servicio = ? WHERE Codigo_manzana = ?`;
    const values = [nombre, localidad, direccion, codigoServicio, manzanaId];

    // Suponiendo que 'db' es tu conexión a la base de datos
    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al actualizar la manzana: ', error);
            res.status(500).send('Error al actualizar la manzana');
        } else {
            console.log('Manzana actualizada correctamente');
            res.status(200).send('Manzana actualizada correctamente');
        }
    });
});

// Ruta para borrar una manzana
app.post('/borrar-manzana', (req, res) => {
    const { manzanaId } = req.body;

    // Aquí deberías borrar la manzana de tu base de datos
    // Este es solo un ejemplo y necesitarás adaptarlo a tu base de datos y modelo de datos
    const query = `DELETE FROM manzanas WHERE Codigo_manzana = ?`;
    const values = [manzanaId];

    // Suponiendo que 'db' es tu conexión a la base de datos
    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al borrar la manzana: ', error);
            res.status(500).send('Error al borrar la manzana');
        } else {
            console.log('Manzana borrada correctamente');
            res.status(200).send('Manzana borrada correctamente');
        }
    });
});

app.post('/obtener-servicios-registrados', async(req, res) => {
    try {
        const [serviciosData] = await db.query('SELECT * FROM servicios');
        res.json({ servicios: serviciosData });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

app.delete('/servicio/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM servicios WHERE Codigo_servicio = ${id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Servicio borrado');
    });
});

app.get('/servicio/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM servicios WHERE Codigo_servicio = ${id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.put('/servicio/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const sql = `UPDATE servicios SET ? WHERE Codigo_servicio = ${id}`;
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send('Servicio actualizado');
    });
});

app.post('/obtener-solicitudes-registradas', async(req, res) => {
    try {
        const [solicitudesData] = await db.query('SELECT * FROM solicitudes');
        res.json({ solicitudes: solicitudesData });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

app.delete('/solicitud/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM solicitudes WHERE ID_solicitud = ${id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Solicitud borrada');
    });
});

app.get('/solicitud/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM solicitudes WHERE ID_solicitud = ${id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.put('/solicitud/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const sql = `UPDATE solicitudes SET ? WHERE ID_solicitud = ${id}`;
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send('Solicitud actualizada');
    });
});

app.post('/obtener-usuarios-registrados', async(req, res) => {
    try {
        const [usuariosData] = await db.query('SELECT * FROM usuarios');
        res.json({ usuarios: usuariosData });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});


app.delete('/usuario/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM usuarios WHERE ID_Usuario = ${id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Usuario borrado');
    });
});

app.get('/usuario/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM usuarios WHERE ID_Usuario = ${id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.put('/usuario/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const sql = `UPDATE usuarios SET ? WHERE ID_Usuario = ${id}`;
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send('Usuario actualizado');
    });
});

function generatePdf(user, service, time, res) {
    const documentDefinition = {
        content: [
            { text: 'Usuario:', bold: true },
            { text: user },
            { text: 'Servicio:', bold: true },
            { text: service },
            { text: 'Hora:', bold: true },
            { text: time },
        ],
        defaultStyle: {
            fontSize: 12,
        },
    };

    pdfMake.createPdf(documentDefinition).getBuffer(function(error, buffer) {
        if (error) {
            console.error('Error al crear el PDF:', error);
            res.status(500).send('Error al crear el PDF');
        } else {
            const filename = `${user}_servicio.pdf`;
            fs.writeFileSync(filename, buffer);
            res.status(200).send(`PDF guardado exitosamente como ${filename}`);
        }
    });
}

app.post('/generar-pdf', async(req, res) => {
    const { usuario, servicios, fecha } = req.body;
    generatePdf(usuario, servicios.join(', '), fecha, res);
});

app.post('/cerrar-sesion', (req, res) => {
    req.session.destroy((error) => {
            if (error) {
                console.error('Error Cerrar Sesion', err);
                res.status(500).send('Error al Cerrar Sesion')
            } else {
                res.status(200).send('Sesion Cerrada')
            }
        })
        /* res.status(200).send('Sesión cerrada correctamente'); */
});

app.listen(3000, () => {
    console.log("Servidor Node.js escuchando");
});