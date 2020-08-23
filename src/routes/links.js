const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, async (req, res) => {
    const apara = await pool.query('SELECT * FROM aparato where estado_aparato=1');
    console.log(apara);
    res.render('links/add', { apara });
});

router.post('/add', async (req, res) => {
    const { fecha, direccion, barrio, id_aparato } = req.body;
    const newLink = {
        fecha,
        direccion,
        barrio,
        id_aparato,
        iduser: req.user.identificacion        
    };
    await pool.query('INSERT INTO servicioespera set ?', [newLink]);
    req.flash('success', 'Servicio Solicitado Correctamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM servicioespera where iduser=? ', [req.user.identificacion]);
    res.render('links/list', { links });
});

router.get('/delete/:idservicioespera', isLoggedIn, async (req, res) => {
    const { idservicioespera } = req.params;
    await pool.query('DELETE FROM servicioespera WHERE idservicioespera = ?', [idservicioespera]);
    req.flash('success', 'Servicio Cancelado Correctamente');
    res.redirect('/links');
});

router.get('/edit/:idservicioespera', isLoggedIn,async (req, res) => {
    const { idservicioespera } = req.params;
    const links = await pool.query('SELECT * FROM servicioespera WHERE idservicioespera = ?', [idservicioespera]);
 
    res.render('links/edit', { links: links[0] });
});

router.post('/edit/:idservicioespera',isLoggedIn, async (req, res) => {
    const { idservicioespera } = req.params;
    const { fecha, direccion, barrio } = req.body;
    const newLink = {
        fecha,
        direccion,
        barrio
    };
    await pool.query('UPDATE servicioespera set ? WHERE idservicioespera = ?', [newLink, idservicioespera]);
    req.flash('success', 'Servicio Actualizado Correctamente');
    res.redirect('/links');
});

module.exports = router;