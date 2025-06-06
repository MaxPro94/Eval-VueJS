<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-5">
    <h1 class="display-6 fw-bold text-white mb-0">
      <i class="bi bi-receipt text-primary me-3"></i>
      Gestion des Factures
    </h1>
      <RouterLink to="/factures/create" class="btn btn-primary btn-lg px-4 py-2 rounded-3 shadow-sm">
        <i class="fas fa-plus me-2"></i>Nouvelle facture
      </RouterLink>
    </div>

    <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="bg-gradient-primary text-white">
            <tr>
              <th class="border-0 px-4 py-4 fw-semibold">N° Facture</th>
              <th class="border-0 px-4 py-4 fw-semibold">Date</th>
              <th class="border-0 px-4 py-4 fw-semibold">Client</th>
              <th class="border-0 px-4 py-4 fw-semibold">Description</th>
              <th class="border-0 px-4 py-4 fw-semibold text-end">Prix HT</th>
              <th class="border-0 px-4 py-4 fw-semibold text-end">Prix TTC</th>
              <th class="border-0 px-4 py-4 fw-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="facture in factures" :key="facture.numero" class="border-bottom">
              <td class="px-4 py-4">
                <span class="badge bg-light text-dark fs-6 px-3 py-2 rounded-3">
                  {{ facture.numero }}
                </span>
              </td>
              <td class="px-4 py-4 text-muted">{{ formatDate(facture.date) }}</td>
              <td class="px-4 py-4">
                <div class="fw-semibold text-dark">{{ facture.client }}</div>
              </td>
              <td class="px-4 py-4">
                <span class="text-muted">{{ truncateText(facture.description, 50) }}</span>
              </td>
              <td class="px-4 py-4 text-end">
                <span class="fw-bold text-primary fs-6">{{ facture.prixHT }} €</span>
              </td>
              <td class="px-4 py-4 text-end">
                <span class="fw-bold text-success fs-6">{{ calculerPrixTTC(facture.prixHT) }} €</span>
              </td>
              <td class="px-4 py-4 text-center">
                <div class="btn-group" role="group">
                  <RouterLink 
                    class="btn btn-outline-primary btn-sm px-3 py-2 rounded-start-3" 
                    :to="`/factures/edit/${facture.numero}`"
                  >
                    <i class="fas fa-edit"></i>
                  </RouterLink>
                  <button 
                    class="btn btn-outline-danger btn-sm px-3 py-2 rounded-end-3" 
                    @click="supprimerFacture(facture.numero)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="factures.length === 0" class="text-center py-5">
      <i class="fas fa-inbox text-muted" style="font-size: 4rem;"></i>
      <h4 class="text-muted mt-3">Aucune facture trouvée</h4>
      <p class="text-muted">Commencez par créer votre première facture</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const factures = ref([])

const fetchFactures = async () => {
  try {
    const response = await axios.get('http://localhost:3000/factures')
    factures.value = response.data.factures
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error)
  }
}

const supprimerFacture = async (numero) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer la facture ${numero} ?`)) {
    return
  }
  
  try {
    await axios.delete(`http://localhost:3000/factures/${numero}`)
    await fetchFactures()
  } catch (error) {
    console.error('Erreur lors de la suppression de la facture:', error)
  }
}

const calculerPrixTTC = (prixHT) => {
  return (prixHT * 1.2).toFixed(2)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

onMounted(() => {
  fetchFactures()
})
</script>

<style scoped>
.container {
  max-width: 1400px;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  transition: transform 0.2s ease-in-out;
}

.table tbody tr {
  transition: all 0.2s ease-in-out;
}

.table tbody tr:hover {
  background-color: #f8f9ff;
  transform: translateY(-1px);
}

.btn-group .btn {
  border: 1px solid #dee2e6;
}

.btn-group .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.badge {
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .display-6 {
    font-size: 1.5rem;
  }
  
  .btn-lg {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}
</style>
