import pessoa_route from "../modules/pessoa/pessoa.route.js";
import produto_route from "../modules/produto/produto.route.js";

function routes(app) {

    app.get("/", (req, res, next) => {
        res.status(200).send('<p><h3>Aprendendo Docker, com MySQL, NodeJS e Apache !</h3></p><p>E redis...</p>');
    });

    pessoa_route(app);
    produto_route(app);

};

export default routes;


