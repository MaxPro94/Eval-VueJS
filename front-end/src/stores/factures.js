import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useFacturesStore = defineStore('factures', () => {
  const factures = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getAllFactures = computed(() => factures.value)

  const getFactureByNumero = computed(() => {
    return (numero) => factures.value.find(f => f.numero === numero)
  })

  const fetchFactures = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/factures`)
      if (response.data.factures) {
        factures.value = response.data.factures
      } else {
        factures.value = response.data
      }
    } catch (err) {
      error.value = 'Erreur lors de la récupération des factures'
      console.error('Erreur lors de la récupération des factures:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createFacture = async (factureData) => {
    loading.value = true
    error.value = null
    try {
      
      const response = await axios.post('http://localhost:3000/factures', factureData)
    
      factures.value.push(response.data)
      
      return response.data
    } catch (err) {
      error.value = 'Erreur lors de la création de la facture'
      console.error('Erreur lors de la création de la facture:', err)
      throw err
    } finally {
      loading.value = false
    }
  }


  const updateFacture = async (numero, factureData) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.patch(`http://localhost:3000/factures/${numero}`, factureData)
      
      const index = factures.value.findIndex(f => f.numero === numero)
      if (index !== -1) {
        factures.value[index] = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour de la facture'
      console.error('Erreur lors de la mise à jour de la facture:', err)
      throw err
    } finally {
      loading.value = false
    }
  }



  const deleteFacture = async (numero) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`http://localhost:3000/factures/${numero}`)
      
      console.log('Facture supprimée avec succès')
      
      const index = factures.value.findIndex(f => f.numero === numero)
      if (index !== -1) {
        factures.value.splice(index, 1)
        console.log('Facture supprimée du store local')
      }
    } catch (err) {
      error.value = 'Erreur lors de la suppression de la facture'
      console.error('Erreur lors de la suppression de la facture:', err)
      throw err
    } finally {
      loading.value = false
    }
  }


  const getFactureById = async (numero) => {
    console.log('Store: recherche facture avec numero:', numero)
    try {
      const localFacture = factures.value.find(f => f.numero === numero)
      console.log('Facture trouvée localement:', localFacture)
      
      if (localFacture) {
        return localFacture
      }
      
      console.log('Appel API pour facture:', numero)
      const response = await axios.get(`http://localhost:3000/factures/${numero}`)
      console.log('Réponse API:', response.data)
      return response.data

    } catch (err) {
      console.error('Erreur lors de la récupération de la facture:', err)
      throw err
    }
  }


  const clearError = () => {
    error.value = null
  }

  return {
    factures,
    loading,
    error,
    getAllFactures,
    getFactureByNumero,
    fetchFactures,
    createFacture,
    updateFacture,
    deleteFacture,
    getFactureById,
    clearError
  }
})
