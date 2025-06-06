  import fs from 'fs'
  import { v4 as uuidv4 } from 'uuid'

  const getFactures = async (req, res) => {
    try {
      const data = await fs.promises.readFile('./db/factures.json', 'utf8')
      const factures = JSON.parse(data)
      res.json(factures)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: true, message: 'Error reading factures' })
    }
  }

  const getFacture = async (req, res) => {
    try {
      const data = await fs.promises.readFile('./db/factures.json', 'utf8')
      const facturesData = JSON.parse(data)
      
      const factures = facturesData.factures || facturesData
      
      const facture = factures.find(f => f.numero === req.params.id)
      
      if (!facture) {
        return res.status(404).json({ error: true, message: 'Facture not found' })
      }
      
      res.json(facture)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: true, message: 'Error reading facture' })
    }
  }

  const createFactures = async (req, res) => {
    try {
      const data = await fs.promises.readFile('./db/factures.json', 'utf8')
      let facturesData = JSON.parse(data)
      
      let factures = facturesData.factures || facturesData
      
      const newFacture = {
        ...req.body,
        createdAt: new Date()
      }
      
      factures.push(newFacture)
      
      if (facturesData.factures) {
        facturesData.factures = factures
        await fs.promises.writeFile('./db/factures.json', JSON.stringify(facturesData, null, 2))
      } else {
        await fs.promises.writeFile('./db/factures.json', JSON.stringify(factures, null, 2))
      }
      
      res.status(201).json(newFacture)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: true, message: 'Error creating facture' })
    }
  }


  const updateFacture = async (req, res) => {
    try {
      const data = await fs.promises.readFile('./db/factures.json', 'utf8')
      let facturesData = JSON.parse(data)
      
      let factures = facturesData.factures || facturesData
      
      const index = factures.findIndex(f => f.numero === req.params.id)
      
      if (index === -1) {
        return res.status(404).json({ error: true, message: 'Facture not found' })
      }
      
      factures[index] = {
        ...factures[index],
        ...req.body,
        updatedAt: new Date()
      }
      
      if (facturesData.factures) {
        facturesData.factures = factures
        await fs.promises.writeFile('./db/factures.json', JSON.stringify(facturesData, null, 2))
      } else {
        await fs.promises.writeFile('./db/factures.json', JSON.stringify(factures, null, 2))
      }
      
      res.json(factures[index])
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: true, message: 'Error updating facture' })
    }
  }


  const deleteFacture = async (req, res) => {
    try {
      const data = await fs.promises.readFile('./db/factures.json', 'utf8')
      let facturesData = JSON.parse(data)
      
      let factures = facturesData.factures || facturesData
      
      const index = factures.findIndex(f => f.numero === req.params.id)
      
      if (index === -1) {
        return res.status(404).json({ error: true, message: 'Facture not found' })
      }
      
      factures.splice(index, 1)
      
      if (facturesData.factures) {
        facturesData.factures = factures
        await fs.promises.writeFile('./db/factures.json', JSON.stringify(facturesData, null, 2))
      } else {
        await fs.promises.writeFile('./db/factures.json', JSON.stringify(factures, null, 2))
      }
      
      res.sendStatus(204)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: true, message: 'Error deleting facture' })
    }
  }


  export { getFactures, getFacture, createFactures, updateFacture, deleteFacture }