<template>
  <div class="container mt-5">
    <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
      <div class="card-header bg-gradient-primary text-white py-4">
        <h1 class="card-title mb-0 text-center">
          <i class="fas fa-edit me-3"></i>
          Modification de Facture
        </h1>
      </div>

      <div class="card-body p-5">
        <!-- Message d'erreur -->
        <div v-if="error" class="alert alert-danger rounded-3 mb-4">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
          <p class="text-muted">Chargement de la facture...</p>
        </div>

        <!-- Formulaire -->
        <div v-if="!loading && facture" class="row g-4">
          <div class="col-12">
            <label class="form-label fw-semibold text-dark">
              <i class="fas fa-hashtag me-2 text-primary"></i>
              Numéro de facture
            </label>
            <input
              type="text"
              :value="facture.numero"
              class="form-control form-control-lg rounded-3 bg-light"
              readonly
            >
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold text-dark">
              <i class="fas fa-user me-2 text-primary"></i>
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
              <i class="fas fa-calendar me-2 text-primary"></i>
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
              <i class="fas fa-file-text me-2 text-primary"></i>
              Description
            </label>
            <textarea
              v-model="facture.description"
              class="form-control form-control-lg rounded-3"
              rows="4"
              placeholder="Description de la facture"
            ></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold text-dark">
              <i class="fas fa-euro-sign me-2 text-primary"></i>
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

          <div class="col-md-6">
            <label class="form-label fw-semibold text-success">
              <i class="fas fa-calculator me-2"></i>
              Prix TTC (TVA 20%)
            </label>
            <div class="form-control form-control-lg rounded-3 bg-light d-flex align-items-center">
              <span class="fw-bold text-success fs-5">{{ calculerPrixTTC() }} €</span>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div v-if="!loading && facture" class="d-flex flex-wrap gap-3 justify-content-center mt-5">
          <button 
            @click="sauvegarderFacture" 
            class="btn btn-success btn-lg px-4 py-2 rounded-3 shadow-sm"
            :disabled="saving || deleting"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-save me-2"></i>
            {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
          </button>

          <button
            @click="supprimerFacture"
            class="btn btn-danger btn-lg px-4 py-2 rounded-3 shadow-sm"
            :disabled="saving || deleting"
          >
            <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-trash me-2"></i>
            {{ deleting ? 'Suppression...' : 'Supprimer' }}
          </button>

          <button 
            @click="annuler" 
            class="btn btn-secondary btn-lg px-4 py-2 rounded-3 shadow-sm"
            :disabled="saving || deleting"
          >
            <i class="fas fa-times me-2"></i>
            Annuler
          </button>
        </div>

        <!-- Message si aucune facture -->
        <div v-if="!loading && !facture && !error" class="text-center py-5">
          <i class="fas fa-search text-muted" style="font-size: 4rem;"></i>
          <h4 class="text-muted mt-3">Facture introuvable</h4>
          <p class="text-muted">Aucune facture trouvée avec l'ID: {{ factureId }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFacturesStore } from '../stores/factures.js'

const route = useRoute()
const router = useRouter()
const facturesStore = useFacturesStore()

const facture = ref({
  numero: '',
  client: '',
  date: '',
  description: '',
  prixHT: 0
})

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const error = ref(null)
const factureId = route.params.id

const calculerPrixTTC = () => {
  return (facture.value.prixHT * 1.2).toFixed(2)
}

const supprimerFacture = async () => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer la facture ${facture.value.numero} ?`)) {
    return
  }
  
  try {
    deleting.value = true
    error.value = null
    
    await facturesStore.deleteFacture(facture.value.numero)
    router.push('/factures')
    
  } catch (err) {
    error.value = 'Erreur lors de la suppression de la facture'
  } finally {
    deleting.value = false
  }
}

const chargerFacture = async () => {
  try {
    loading.value = true
    error.value = null
    
    const factureData = await facturesStore.getFactureById(factureId)
    
    if (factureData) {
      facture.value = {
        numero: factureData.numero || '',
        client: factureData.client || '',
        date: factureData.date || '',
        description: factureData.description || '',
        prixHT: factureData.prixHT || 0
      }
    } else {
      error.value = `Facture non trouvée avec l'ID: ${factureId}`
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement de la facture'
  } finally {
    loading.value = false
  }
}

const sauvegarderFacture = async () => {
  try {
    saving.value = true
    error.value = null
    
    if (!facture.value.client || !facture.value.date || !facture.value.description) {
      error.value = 'Veuillez remplir tous les champs obligatoires'
      return
    }
    
    await facturesStore.updateFacture(factureId, facture.value)
    router.push('/factures')
    
  } catch (err) {
    error.value = 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}

const annuler = () => {
  router.push('/factures')
}

onMounted(() => {
  chargerFacture()
})
</script>

<style scoped>
.container {
  max-width: 800px;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  transition: transform 0.2s ease-in-out;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
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
    padding: 0.6rem 1.2rem;
  }
}
</style>
