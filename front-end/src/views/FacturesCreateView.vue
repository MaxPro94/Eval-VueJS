<template>
  <div class="container mt-5">
    <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
      <div class="card-header bg-gradient-success text-white py-4">
        <h1 class="card-title mb-0 text-center">
          <i class="bi bi-plus-circle me-3"></i>
          Création de Facture
        </h1>
      </div>

      <div class="card-body p-5">
        <div v-if="error" class="alert alert-danger rounded-3 mb-4">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
        </div>

        <div class="row g-4">
          <div class="col-12">
            <label class="form-label fw-semibold text-dark">
              <i class="fas fa-hashtag me-2 text-success"></i>
              Numéro de facture
            </label>
            <input
              type="text"
              v-model="facture.numero"
              class="form-control form-control-lg rounded-3"
              placeholder="Ex: ABC-0000-000"
            >
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold text-dark">
              <i class="fas fa-user me-2 text-success"></i>
              Nom du client
            </label>
            <input
              type="text"
              v-model="facture.client"
              class="form-control form-control-lg rounded-3"
              placeholder="Nom du client"
            >
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold text-dark">
              <i class="fas fa-calendar me-2 text-success"></i>
              Date
            </label>
            <input
              type="date"
              v-model="facture.date"
              class="form-control form-control-lg rounded-3"
            >
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold text-dark">
              <i class="fas fa-file-text me-2 text-success"></i>
              Description
            </label>
            <textarea
              v-model="facture.description"
              class="form-control form-control-lg rounded-3"
              rows="4"
              placeholder="Description de la facture"
            ></textarea>
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold text-dark">
              <i class="fas fa-euro-sign me-2 text-success"></i>
              Prix HT
            </label>
            <input
              type="number"
              v-model.number="facture.prixHT"
              class="form-control form-control-lg rounded-3"
              step="0.01"
              min="0"
            >
          </div>
        </div>

        <div class="d-flex flex-wrap gap-3 justify-content-center mt-5">
          <button
            @click="sauvegarderFacture"
            class="btn btn-success btn-lg px-5 py-3 rounded-3 shadow-sm"
            :disabled="saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-save me-2"></i>
            {{ saving ? 'Création...' : 'Créer la facture' }}
          </button>

          <button
            @click="annuler"
            class="btn btn-secondary btn-lg px-5 py-3 rounded-3 shadow-sm"
            :disabled="saving"
          >
            <i class="bi bi-arrow-return-left"></i>
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFacturesStore } from '../stores/factures.js'

const router = useRouter()
const facturesStore = useFacturesStore()

const facture = ref({
  numero: '',
  client: '',
  date: '',
  description: '',
  prixHT: 0
})

const saving = ref(false)
const error = ref(null)

const sauvegarderFacture = async () => {
  try {
    saving.value = true
    error.value = null

    if (!facture.value.numero) {
      error.value = 'Le numéro de facture est obligatoire'
      return
    }

    if (!facture.value.client) {
      error.value = 'Le nom du client est obligatoire'
      return
    }

    if (!facture.value.date) {
      error.value = 'La date est obligatoire'
      return
    }

    if (!facture.value.description) {
      error.value = 'La description est obligatoire'
      return
    }

    if (facture.value.prixHT <= 0) {
      error.value = 'Le prix HT doit être supérieur à 0'
      return
    }

    const factureData = {
      numero: facture.value.numero.trim(),
      client: facture.value.client.trim(),
      date: facture.value.date,
      description: facture.value.description.trim(),
      prixHT: parseFloat(facture.value.prixHT)
    }

    const result = await facturesStore.createFacture(factureData)
    router.push('/factures')

  } catch (err) {
    error.value = 'Erreur lors de la création de la facture: ' + (err.response?.data?.message || err.message)
  } finally {
    saving.value = false
  }
}

const annuler = () => {
  router.push('/factures')
}
</script>

<style scoped>
.container {
  max-width: 800px;
}

.bg-gradient-success {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
}

.card {
  transition: transform 0.2s ease-in-out;
}

.form-control:focus {
  border-color: #56ab2f;
  box-shadow: 0 0 0 0.2rem rgba(86, 171, 47, 0.25);
}

.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .card-body {
    padding: 2rem 1.5rem;
  }
  
  .btn-lg {
    font-size: 0.9rem;
    padding: 0.8rem 2rem;
  }
}
</style>
