import { deletePessoaId, getPessoa, getPessoaCache, getPessoaId, getPessoaIdCache, postPessoa } from "./pessoa.controller.js";

async function pessoa_route(app) {
    
    app
        .get('/pessoa', getPessoaCache, getPessoa)
        .get('/pessoa/:id', getPessoaIdCache, getPessoaId)
        .post('/pessoa', postPessoa)
        .delete('/pessoa/:id', deletePessoaId);
   
};

export default pessoa_route;