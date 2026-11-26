import { getPessoa, getPessoaCache, getPessoaId, getPessoaIdCache, postPessoa } from "./pessoa.controller.js";

async function pessoa_route(app) {
    
    app.get('/pessoa', getPessoaCache, getPessoa);
    app.get('/pessoa/:id', getPessoaIdCache, getPessoaId);
    app.post('/pessoa', postPessoa);
   
};

export default pessoa_route;