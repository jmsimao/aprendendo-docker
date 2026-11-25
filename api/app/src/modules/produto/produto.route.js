import { getProduto, getProdutoCache } from "./produto.controller.js";

async function produto_route(app) {
  
    app.get('/produto', getProdutoCache, getProduto);
    
};

export default produto_route;