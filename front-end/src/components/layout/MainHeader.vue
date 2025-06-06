<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-dark shadow-sm" data-bs-theme="dark">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#"><i class="bi bi-receipt me-2"></i>Facturator-3000</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink activeClass="active" to="/" class="nav-link"
                ><i class="bi bi-house me-2"></i>Accueil</RouterLink
              >
            </li>
            <li class="nav-item">
              <RouterLink activeClass="active" to="/factures" class="nav-link"
                ><i class="bi bi-file-text me-2"></i>Factures</RouterLink
              >
            </li>
            <li class="nav-item">
              <RouterLink activeClass="active" to="/profile" class="nav-link"
                ><i class="bi bi-people me-2"></i>Utilisateurs</RouterLink
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>