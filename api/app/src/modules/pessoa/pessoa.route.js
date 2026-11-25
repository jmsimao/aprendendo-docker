import { getPessoa, getPessoaCache, getPessoaId, getPessoaIdCache } from "./pessoa.controller.js";

async function pessoa_route(app) {
    
    //app.get('/pessoa', getPessoaCache, getPessoa);
    app.get('/pessoa', getPessoaCache, getPessoa);
    app.get('/pessoa/:id', getPessoaIdCache, getPessoaId);
   
};

export default pessoa_route;