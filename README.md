# Per vedere la Web Page [Progetto WoT - Palumbo & Pierri](https://unisalento-idalab-iotcourse-2023-2024.github.io/wot-project-presentation-PalumboPierri/)

# Progetto Monitoraggio Rumore e Beacon

Questo progetto permette di monitorare il livello di rumore e la distanza di un beacon Bluetooth tramite MQTT e visualizzare i dati su una dashboard web. Inoltre, offre la possibilità di eseguire uno script Python per effettuare analisi sui dati.

## Funzionalità principali

1. **Monitoraggio del rumore**: 
   - I livelli di rumore sono monitorati e pubblicati tramite MQTT.
   - Se il rumore supera una soglia predefinita, viene generata un'allerta.

2. **Rilevamento beacon**:
   - La distanza del beacon viene calcolata in tempo reale.
   - Se il beacon si avvicina troppo (meno di 1 metro), viene generata un'allerta.

3. **Dashboard web**:
   - I dati relativi al rumore e al beacon sono visualizzati in tempo reale su una dashboard accessibile tramite browser.

4. **Integrazione MongoDB**:
   - I dati sono salvati in un database MongoDB.
   - È possibile recuperare i dati e visualizzarli sotto forma di grafici.

5. **Esecuzione script Python**:
   - Tramite una richiesta POST, è possibile eseguire uno script Python e ottenere il risultato direttamente dall'applicazione.

## Requisiti

- **Node.js** (versione 14 o successiva)
- **MongoDB**
- **Broker MQTT** (ad esempio Mosquitto)
- Moduli Node.js:
  - `express`
  - `mqtt`
  - `mongoose`
  - `path`
  - `child_process` (per eseguire lo script Python)
- Moduli Python:
  - `librosa`
  - `soundfile`
  - `bluepy`
  - `paho-mqtt`
  - `numpy`

## Installazione

1. Clonare il repository:

   ```bash
   git clone https://github.com/tuo-repository/monitoraggio-rumore-beacon.git
   cd monitoraggio-rumore-beacon

2. Installare le dipendenze Node.js:

```bash
npm install
```

3. Assicurarsi che MongoDB sia installato e in esecuzione

```bash
mongod
```

4. Configurare il broker MQTT (ad esempio Mosquitto) e modificarne l'indirizzo IP nel codice, se necessario.

## Avvio del server

1. Avviare il server Node.js:

```bash
node app.js
```

2. Aprire il browser e accedere all'indirizzo: http://localhost:3000

## API Endpoints

- **GET /**: Restituisce la pagina principale (index.html).
- **GET /analizzasuono**: Restituisce la pagina per l'analisi del suono.
- **GET /dashboard**: Restituisce la dashboard per visualizzare i dati relativi al rumore e al beacon.
- **GET /status**: Fornisce lo stato attuale del rumore e del beacon.
- **GET /chart-data**: Restituisce i dati dei grafici basati sui documenti salvati nel database MongoDB.
- **POST /esegui-codice-python**: Esegue uno script Python e restituisce il risultato.
