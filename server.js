const express = require('express');
const mqtt = require('mqtt');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Variabili globali per MQTT
let noiseLevel = null;
let beaconDistance = null;
const noiseThreshold = 85; // Soglia di esempio per il rumore in dB
const beaconThreshold = 1.0; // Distanza limite per il beacon (in metri)

// Connessione al broker MQTT
const client = mqtt.connect('mqtt://192.168.1.26');

client.on('connect', () => {
  console.log('Connesso al broker MQTT');
  client.subscribe('sensor/noise', (err) => {
    if (err) {
      console.error('Errore nella sottoscrizione al topic noise:', err);
    }
  });
  client.subscribe('sensor/beacon_distance', (err) => {
    if (err) {
      console.error('Errore nella sottoscrizione al topic beacon_distance:', err);
    }
  });
  client.subscribe('sensor/beacon_alarm', (err) => {
    if (err) {
      console.error('Errore nella sottoscrizione al topic beacon_alarm:', err);
    }
  });
});

client.on('message', (topic, message) => {
  const data = message.toString();

  if (topic === 'sensor/noise') {
    noiseLevel = parseFloat(data);
    console.log(`Livello di rumore ricevuto: ${noiseLevel} dB`);
  } else if (topic === 'sensor/beacon_distance') {
    beaconDistance = parseFloat(data);
    console.log(`Distanza del beacon ricevuta: ${beaconDistance} metri`);
  } else if (topic === 'sensor/beacon_alarm') {
    console.log(`Allarme ricevuto: ${data}`);
  }
});

client.on('reconnect', () => {
  console.log('Tentativo di riconnessione al broker MQTT...');
});

client.on('offline', () => {
  console.log('Connessione al broker MQTT persa. Tentativo di riconnessione in corso...');
});

client.on('error', (err) => {
  console.error('Errore nella connessione al broker MQTT:', err);
});


// Connessione a MongoDB
const mongoURI = 'mongodb://localhost:27017/cavia';
mongoose.connect(mongoURI).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.log('MongoDB connection error:', err));

// Definizione dello schema e del modello
const YourSchema = new mongoose.Schema({
    slice_file_name: String,
    fsID: Number,
    start: Number,
    end: Number,
    salience: Number,
    fold: Number,
    classID: Number,
    class: String
});

const YourModel = mongoose.model('first', YourSchema, 'first');

// Servire la pagina HTML principale (index1.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/analizzasuono', (req, res) => {
  res.sendFile(path.join(__dirname, 'analizzaaudio.html'));
});

// Endpoint per la dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.post('/esegui-codice-python', (req, res) => {
  console.log('Richiesta POST ricevuta su /esegui-codice-python');

  // Comando per eseguire lo script Python
  exec('python3 machinelearing.py', (error, stdout, stderr) => {
      if (error) {
          console.error(`Errore durante l'esecuzione: ${error.message}`);
          return res.status(500).json({ message: 'Errore durante l\'esecuzione del codice Python', error: error.message });
      }
      if (stderr) {
          console.error(`Errore stderr: ${stderr}`);
          return res.status(500).json({ message: 'Errore durante l\'esecuzione del codice Python', error: stderr });
      }
      console.log(`Risultato stdout: ${stdout}`);
      res.json({ message: 'Codice Python eseguito con successo', output: stdout });
  });
});

app.get('/chart-data', async (req, res) => {
  try {
      const documents = await YourModel.find(); // Recupera tutti i dati dal database

      // Esempio di conteggio basato sulla colonna 'class'
      const categoryCounts = {};
      documents.forEach(doc => {
          if (categoryCounts[doc.class]) {
              categoryCounts[doc.class]++;
          } else {
              categoryCounts[doc.class] = 1;
          }
      });

      // Esempio di conteggio basato sulla colonna 'salience'
      const salienceCounts = {};
      documents.forEach(doc => {
          if (salienceCounts[doc.salience]) {
              salienceCounts[doc.salience]++;
          } else {
              salienceCounts[doc.salience] = 1;
          }
      });

      const labels = Object.keys(categoryCounts);
      const data = Object.values(categoryCounts);

      // Puoi includere altri set di dati per altre categorie
      const salienceLabels = Object.keys(salienceCounts);
      const salienceData = Object.values(salienceCounts);

      res.json({ labels, data, salienceLabels, salienceData });
  } catch (error) {
      res.status(500).json({ message: 'Errore durante il recupero dei dati', error });
  }
});

// Endpoint per ottenere il livello di rumore e lo stato del beacon (per index1.html)
app.get('/status', (req, res) => {
  let noiseStatus = noiseLevel !== null && noiseLevel >= noiseThreshold ? 'Allerta: Rumore sopra la soglia!' : 'Rumore sotto la soglia';
  let beaconStatus = beaconDistance !== null && beaconDistance <= beaconThreshold ? 
    `Allerta: lavoratore troppo vicino (${beaconDistance.toFixed(2)} metri)!` : 
    `Lavoratore a distanza sicura (${beaconDistance !== null ? beaconDistance.toFixed(2) : 'N/D'} metri)`;

  res.json({ noiseLevel, noiseStatus, beaconDistance, beaconStatus });
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
