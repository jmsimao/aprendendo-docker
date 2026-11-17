<?php
$pagina = $_GET['pagina'] ?? 'produtos';

if (!in_array($pagina, ['produtos', 'pessoas'], true)) {
    $pagina = 'produtos';
}

function buscarDados(string $url): array
{
    $resposta = @file_get_contents($url);

    if ($resposta === false) {
        return [];
    }

    $dados = json_decode($resposta);

    return is_array($dados) ? $dados : [];
}

$url = "http://node-container:9001";
$produtos = buscarDados($url . '/produto');
$pessoas = buscarDados($url . '/pessoa');
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Introdução ao Docker</title>

  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-yEPZ7jP9S0QKiUQ0m3jjsO4ProIW7wvR9gXkI7JOGa2XVsw53Yke2bsdkBbjmmiX"
    crossorigin="anonymous"
  >
</head>

<body class="bg-light">

  <nav class="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
    <div class="container">
      <a class="navbar-brand fw-bold" href="index.php">
        Introdução ao Docker
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#menuPrincipal"
        aria-controls="menuPrincipal"
        aria-expanded="false"
        aria-label="Alternar navegação"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="menuPrincipal">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a
              class="nav-link <?= $pagina === 'produtos' ? 'active' : '' ?>"
              <?= $pagina === 'produtos' ? 'aria-current="page"' : '' ?>
              href="index.php?pagina=produtos"
            >
              Produtos
            </a>
          </li>

          <li class="nav-item">
            <a
              class="nav-link <?= $pagina === 'pessoas' ? 'active' : '' ?>"
              <?= $pagina === 'pessoas' ? 'aria-current="page"' : '' ?>
              href="index.php?pagina=pessoas"
            >
              Pessoas
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="container py-5">

    <?php if ($pagina === 'produtos'): ?>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Produtos</h1>
          <p class="text-secondary mb-0">Lista de produtos cadastrados.</p>
        </div>
      </div>

      <?php if (empty($produtos)): ?>
        <div class="alert alert-warning">
          Nenhum produto encontrado ou a API não está disponível.
        </div>
      <?php else: ?>
        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          <?php foreach ($produtos as $produto): ?>
            <div class="col">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body d-flex flex-column">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge text-bg-primary">
                      ID <?= htmlspecialchars((string) $produto->id) ?>
                    </span>

                    <span class="badge <?= !empty($produto->ativo) ? 'text-bg-success' : 'text-bg-secondary' ?>">
                      <?= !empty($produto->ativo) ? 'Ativo' : 'Inativo' ?>
                    </span>
                  </div>

                  <h2 class="h5 card-title">
                    <?= htmlspecialchars((string) $produto->produto) ?>
                  </h2>

                  <p class="card-text text-secondary">
                    Preço:
                    <strong class="text-dark">
                      R$ <?= htmlspecialchars(number_format((float) $produto->valor, 2, ',', '.')) ?>
                    </strong>
                  </p>

                  <div class="mt-auto">
                    <a href="#" class="btn btn-outline-primary w-100">
                      Ver detalhes
                    </a>
                  </div>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>

    <?php else: ?>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Pessoas</h1>
          <p class="text-secondary mb-0">Lista de pessoas cadastradas.</p>
        </div>
      </div>

      <?php if (empty($pessoas)): ?>
        <div class="alert alert-warning">
          Nenhuma pessoa encontrada ou a API não está disponível.
        </div>
      <?php else: ?>
        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          <?php foreach ($pessoas as $pessoa): ?>
            <div class="col">
              <div class="card h-100 border-1 shadow">
                <div class="card-body d-flex flex-column">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge text-bg-primary">
                      ID <?= htmlspecialchars((string) $pessoa->id) ?>
                    </span>
                  </div>

                  <h2 class="h5 card-title">
                    <?= htmlspecialchars((string) $pessoa->nome) ?>
                  </h2>

                  <ul class="list-unstyled text-secondary small mb-4">
                    <li class="mb-1">
                      <strong>E-mail:</strong>
                      <?= htmlspecialchars((string) $pessoa->email) ?>
                    </li>

                    <li class="mb-1">
                      <strong>Telefone:</strong>
                      <?= htmlspecialchars((string) $pessoa->fone) ?>
                    </li>

                    <li class="mb-1">
                      <strong>Companhia:</strong>
                      <?= htmlspecialchars((string) $pessoa->companhia) ?>
                    </li>

                    <li>
                      <strong>Cidade:</strong>
                      <?= htmlspecialchars((string) $pessoa->cidade) ?>
                    </li>
                    
                    <li>
                      <strong>Registro:</strong>
                      <?= htmlspecialchars(date("d/m/Y", strtotime($pessoa->registro))) ?>
                    </li>
                  </ul>

                  <div class="mt-auto">
                    <a href="#" class="btn btn-outline-primary w-100">
                      Ver perfil
                    </a>
                  </div>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>

    <?php endif; ?>
  </main>

  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-HwwfP6Qb6Hq6b6V2s5j5m5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5"
    crossorigin="anonymous"
  ></script>
</body>
</html>