const express = require("express");
const router = express.Router();

/* GET Customer page. */

router.get("/", function (req, res, next) {
  req.getConnection(function (err, connection) {
    const query = connection.query(
      `SELECT * FROM customer ; `,
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("customer/list", { title: "Customers", data: rows });
      }
    );
    // console.log(query.sql);
  });
});

/* Get date */
router.get("/date/:fecha", function (req, res, next) {
  let fecha = req.param("buscar");
  const dete = req.getConnection(function (err, connection) {
    const query = connection.query(
      `SELECT
					  (
						sum(SALON) 
					  ) as TOTALSALON,
					  ( 
						sum(ALIMENTOS) 
					  ) as TOTALALIMENTOS,
					  (
						sum(BEBIDAS) 
					  ) as TOTALBEBIDAS,
					  (
					   sum(EQUIPOS)
					  ) as TOTALEQUIPOS,
					  (
						sum(MESEROS)
					  ) as TOTALMESEROS,
					  (
						sum(CANTMESEROS)
					  ) as TOTALCANTMESEROS,
					  (
						sum(PROPINA)
					  )  as TOTALPROPINA,
					  (
					  sum(TOTAL) 
					  ) as TOTALTOTAL 
					  from customer where FECHAEVENTO = '${fecha}'`,
      function hand(err, max) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);

        req.getConnection(function (err, connection) {
          const query = connection.query(
            `select * from customer where FECHAEVENTO = '${fecha}'`,
            function (err, rows) {
              if (err) var errornya = ("Error Selecting : %s ", err);
              req.flash("msg_error", errornya);
              res.render("customer/list-date", {
                fecha,
                data: rows,
                johan: max,
              });
            }
          );
        });
      }
    );

    // console.log(query.sql);
  });
});

/* Get date */

router.delete("/delete/(:id)", function (req, res, next) {
  req.getConnection(function (err, connection) {
    const customer = {
      id: req.params.id,
    };

    const delete_sql = "delete from customer where ?";
    req.getConnection(function (err, connection) {
      const query = connection.query(
        delete_sql,
        customer,
        function (err, result) {
          if (err) {
            const errors_detail = ("Error Delete : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/customers");
          } else {
            req.flash("msg_info", "El registro se elimino exitosamente");
            res.redirect("/customers");
          }
        }
      );
    });
  });
});

router.get("/edit/(:id)", function (req, res, next) {
  req.getConnection(function (err, connection) {
    const query = connection.query(
      "SELECT * FROM customer where id=" + req.params.id,
      function (err, rows) {
        if (err) {
          const errornya = ("Error Selecting : %s ", err);
          req.flash("msg_error", errors_detail);
          res.redirect("/customers");
        } else {
          if (rows.length <= 0) {
            req.flash("msg_error", "Customer can't be find!");
            res.redirect("/customers");
          } else {
            console.log(rows, "obtenerrrrrrrrrrrrrrrrr");
            res.render("customer/edit", { title: "Edit ", data: rows[0] });
          }
        }
      }
    );
  });
});

router.put("/edit/(:id)", function (req, res, next) {
  req.assert("EVENTO", "Please fill the EVENTO").notEmpty();

  const errors = req.validationErrors();
  if (!errors) {
    v_EVENTO = req.sanitize("EVENTO").escape().trim();
    v_FECHAEVENTO = req.sanitize("FECHAEVENTO").escape().trim();
    v_PM = req.sanitize("PM").escape().trim();
    v_SALON = req.sanitize("SALON").escape().trim();
    v_ALIMENTOS = req.sanitize("ALIMENTOS").escape().trim();
    v_BEBIDAS = req.sanitize("BEBIDAS").escape();
    v_EQUIPOS = req.sanitize("EQUIPOS").escape().trim();
    v_ALQUILEREQUIPOS = req.sanitize("ALQUILEREQUIPOS").escape().trim();
    v_GANANCIAEQUIPOS = req.sanitize("GANANCIAEQUIPOS").escape();
    v_MESEROS = req.sanitize("MESEROS").escape().trim();
    v_CANTMESEROS = req.sanitize("CANTMESEROS").escape();
    v_PROPINA = req.sanitize("PROPINA").escape().trim();
    v_TOTAL = req.sanitize("TOTAL").escape();
    v_VENDEDORA = req.sanitize("VENDEDORA").escape();

    // Calcular cantidad de meseros en editar customer
    const calcularMeseros = () => {
      const valorMeseros = req.body.MESEROS;
      const cantidadMeseros = 121000;

      return parseInt(valorMeseros) / parseInt(cantidadMeseros);
    };
    const customer = {
      EVENTO: v_EVENTO,
      FECHAEVENTO: v_FECHAEVENTO,
      PM: v_PM,
      SALON: parseInt(v_SALON),
      ALIMENTOS: parseInt(v_ALIMENTOS),
      BEBIDAS: parseInt(v_BEBIDAS),
      EQUIPOS: parseInt(v_EQUIPOS),
      ALQUILEREQUIPOS: parseInt(v_ALQUILEREQUIPOS),
      GANANCIAEQUIPOS: parseInt(v_EQUIPOS) - parseInt(v_ALQUILEREQUIPOS),
      MESEROS: parseInt(v_MESEROS),
      CANTMESEROS: calcularMeseros(),
      PROPINA: parseInt(v_PROPINA),
      TOTAL:
        parseInt(v_SALON) +
        parseInt(v_ALIMENTOS) +
        parseInt(v_BEBIDAS) +
        parseInt(v_EQUIPOS) +
        parseInt(v_MESEROS) +
        parseInt(v_PROPINA),

      VENDEDORA: v_VENDEDORA,
    };
    const update_sql = "update customer SET ? where id = " + req.params.id;

    req.getConnection(function (err, connection) {
      const query = connection.query(
        update_sql,
        customer,
        function (err, result) {
          if (err) {
            const errors_detail = ("Error Update : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("customer/edit", {
              EVENTO: req.params("EVENTO"),
              FECHAEVENTO: req.params("FECHAEVENTO"),
              PM: req.params("PM"),
              SALON: req.params("SALON"),
              ALIMENTOS: req.params("ALIMENTOS"),
              BEBIDAS: req.params("BEBIDAS"),
              EQUIPOS: req.params("EQUIPOS"),
              ALQUILEREQUIPOS: req.params("ALQUILEREQUIPOS"),
              GANANCIAEQUIPOS: req.params("GANANCIAEQUIPOS"),
              MESEROS: req.params("MESEROS"),
              CANTMESEROS: req.params("CANTMESEROS"),
              PROPINA: req.params("PROPINA"),
              TOTAL: req.params("TOTAL"),
              VENDEDORA: req.params("VENDEDORA"),
            });
          } else {
            req.flash("msg_info", "El registro se actualizo exitosamente");
            res.redirect("/customers/edit/" + req.params.id);
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("customer/add-customer", {
      EVENTO: req.params("EVENTO"),
      SALON: req.params("SALON"),
    });
  }
});

router.post("/add", function (req, res, next) {
  // req.assert('EVENTO', 'Please fill the name').notEmpty(); INGRESAR CAMPO OBLIGATORIO
  const errors = req.validationErrors();
  if (!errors) {
    v_EVENTO = req.sanitize("EVENTO").escape().trim();
    v_FECHAEVENTO = req.sanitize("FECHAEVENTO").escape().trim();
    v_PM = req.sanitize("PM").escape();
    v_SALON = req.sanitize("SALON").escape().trim();
    v_ALIMENTOS = req.sanitize("ALIMENTOS").escape().trim();
    v_BEBIDAS = req.sanitize("BEBIDAS").escape();
    v_EQUIPOS = req.sanitize("EQUIPOS").escape().trim();
    v_ALQUILEREQUIPOS = req.sanitize("ALQUILEREQUIPOS").escape().trim();
    v_GANANCIAEQUIPOS = req.sanitize("GANANCIAEQUIPOS").escape();
    v_MESEROS = req.sanitize("MESEROS").escape().trim();
    v_CANTMESEROS = req.sanitize("CANTMESEROS").escape();
    v_PROPINA = req.sanitize("PROPINA").escape().trim();
    v_TOTAL = req.sanitize("TOTAL").escape();
    v_VENDEDORA = req.sanitize("VENDEDORA").escape();

    // Calcular cantidad de meseros en añadir customer
    const calcularMeseros = () => {
      const valorMeseros = req.body.MESEROS;
      const cantidadMeseros = 121000;

      return parseInt(valorMeseros) / parseInt(cantidadMeseros);
    };

    const customer = {
      EVENTO: v_EVENTO,
      FECHAEVENTO: v_FECHAEVENTO,
      PM: v_PM,
      SALON: parseInt(v_SALON),
      ALIMENTOS: parseInt(v_ALIMENTOS),
      BEBIDAS: parseInt(v_BEBIDAS),
      EQUIPOS: parseInt(v_EQUIPOS),
      ALQUILEREQUIPOS: parseInt(v_ALQUILEREQUIPOS),
      GANANCIAEQUIPOS: parseInt(v_EQUIPOS) - parseInt(v_ALQUILEREQUIPOS),
      MESEROS: parseInt(v_MESEROS),
      CANTMESEROS: calcularMeseros(),
      PROPINA: parseInt(v_PROPINA),
      TOTAL:
        parseInt(v_SALON) +
        parseInt(v_ALIMENTOS) +
        parseInt(v_BEBIDAS) +
        parseInt(v_EQUIPOS) +
        parseInt(v_MESEROS) +
        parseInt(v_PROPINA),

      VENDEDORA: v_VENDEDORA,
    };

    const insert_sql = "INSERT INTO customer SET ?";
    req.getConnection(function (err, connection) {
      const query = connection.query(
        insert_sql,
        customer,
        function (err, result) {
          if (err) {
            const errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("customer/add-customer", {
              EVENTO: req.params("EVENTO"),
              FECHAEVENTO: req.params("FECHAEVENTO"),
              PM: req.params("PM"),
              SALON: req.params("SALON"),
              ALIMENTOS: req.params("ALIMENTOS"),
              BEBIDAS: req.params("BEBIDAS"),
              EQUIPOS: req.params("EQUIPOS"),
              ALQUILEREQUIPOS: req.params("ALQUILEREQUIPOS"),
              GANANCIAEQUIPOS: req.params("GANANCIAEQUIPOS"),
              MESEROS: req.params("MESEROS"),
              CANTMESEROS: req.params("CANTMESEROS"),
              PROPINA: req.params("PROPINA"),
              TOTAL: req.params("TOTAL"),
              VENDEDORA: req.params("VENDEDORA"),
            });
          } else {
            req.flash("msg_info", "Registro creado exitosamente");
            res.redirect("/customers");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Hay un error!</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("customer/add-customer", {
      EVENTO: req.params("EVENTO"),
      SALON: req.params("SALON"),
    });
  }
});

router.get("/add", function (req, res, next) {
  res.render("customer/add-customer", {
    title: "Add New Customer",
    EVENTO: "",
    FECHAEVENTO: "",
    PM: "",
    SALON: "",
    ALIMENTOS: "",
    BEBIDAS: "",
    EQUIPOS: "",
    ALQUILEREQUIPOS: "",
    GANANCIAEQUIPOS: "",
    MESEROS: "",
    CANTMESEROS: "",
    PROPINA: "",
    TOTAL: "",
    VENDEDORA: "",
  });
});

module.exports = router;
