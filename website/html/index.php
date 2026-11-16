<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Introdução ao Docker</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-yEPZ7jP9S0QKiUQ0m3jjsO4ProIW7wvR9gXkI7JOGa2XVsw53Yke2bsdkBbjmmiX" crossorigin="anonymous">
</head>
<body>
  <?php
    $result = @file_get_contents("http://node-container-01:9001/product");
    $products = $result !== false ? json_decode($result) : null;
  ?>

  <div class="container py-5">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h3 mb-1">Produtos</h1>
        <p class="text-secondary mb-0">
          Lista de produtos consumida da API Node.js.
        </p>
      </div>
    </div>

    <?php if (!$products || !is_array($products) || count($products) === 0): ?>
      <div class="alert alert-warning" role="alert">
        Não foi possível carregar os produtos. Verifique se o serviço
        <strong>backend</strong> está em execução.
      </div>
    <?php else: ?>
      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        <?php foreach ($products as $product): ?>
          <div class="col">
            <div class="card h-100 shadow border-1">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <span class="badge text-bg-primary">
                    ID <?= htmlspecialchars((string) $product->id) ?>
                  </span>

                  <span class="badge <?= !empty($product->ativo) ? 'text-bg-success' : 'text-bg-secondary' ?>">
                    <?= !empty($product->ativo) ? 'Ativo' : 'Inativo' ?>
                  </span>
                </div>

                <h2 class="h5 card-title mb-2">
                  <?= htmlspecialchars((string) $product->produto) ?>
                </h2>

                <p class="card-text text-secondary mb-4">
                  Preço:
                  <strong class="text-dark">
                    R$ <?= htmlspecialchars(number_format((float) $product->valor, 2, ',', '.')) ?>
                  </strong>
                </p>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</body>
</html>