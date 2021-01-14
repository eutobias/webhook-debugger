const express = require('express')
const axios = require('axios')
const compression = require('compression')
const fs = require('fs')
const path = require('path')

const LOGS_PATH = `${path.resolve(__dirname)}${path.sep}store${path.sep}`

const app = express()
app.use(compression())

app.get('/url:*', async (req, res) => {
  try {
    const content = await axios.get(
      req.params[0],
      req.body,
      {
        headers: req.headers
      })

    saveLog(req, content)

    res.header(content.headers)
    res.send(content.data)

  } catch (_e) {
    res.status(500).end(`Server error: ${_e.message}`)
  }
})

app.post('/url:*', async (req, res) => {
  try {
    const content = await axios.post(
      req.params[0],
      req.body,
      {
        headers: req.headers
      })

    saveLog(req, content)

    res.header(content.headers)
    res.send(content.data)

  } catch (_e) {
    res.status(500).end(`Server error: ${_e.message}`)
  }
})

app.put('/url:*', async (req, res) => {
  try {
    const content = await axios.put(
      req.params[0],
      req.body,
      {
        headers: req.headers
      })

    saveLog(req, content)

    res.header(content.headers)
    res.send(content.data)

  } catch (_e) {
    res.status(500).end(`Server error: ${_e.message}`)
  }
})

app.patch('/url:*', async (req, res) => {
  try {
    const content = await axios.patch(
      req.params[0],
      req.body,
      {
        headers: req.headers
      })

    saveLog(req, content)

    res.header(content.headers)
    res.send(content.data)

  } catch (_e) {
    res.status(500).end(`Server error: ${_e.message}`)
  }
})

app.delete('/url:*', async (req, res) => {
  try {
    const content = await axios.delete(
      req.params[0],
      req.body,
      {
        headers: req.headers
      })

    saveLog(req, content)

    res.header(content.headers)
    res.send(content.data)

  } catch (_e) {
    res.status(500).end(`Server error: ${_e.message}`)
  }
})

app.get('/status', async (req, res) => {
  res.json({ status: 'on' })
})

app.get('/logs', async (req, res) => {

  try {
    fs.readdir(LOGS_PATH, (err, files) => {
      if (err) {
        res.status(500).end(`Server error: could not find logs path`)
        return
      }

      const list = []
      files.sort((a, b) => a < b ? 1 : -1)
        .map((v) => {
          if (v.indexOf('.git') === -1)
            list.push(`<li><a href="/log/${v.replace('.json', '')}">${v}</a></li>`)
        })
      res.send(`
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            padding: 0;
            margin: 0;
          }
          h2 {
            margin: 20px;
          }
          ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          li {
            padding: 10px 20px;
            border-bottom: 1px solid #ccc;
          }
          li:nth-child(2n) {
            background: #eee;
          }
          li:last-child {
            border-bottom: none;
          }
        </style>
        <h2>Logs</h2>
        <ul>${list.join('\n')}</ul>
      `)
    })
  } catch (_e) {
    res.status(500).end(`Server error: ${_e.message}`)
  }

})

app.get('/log/*', async (req, res) => {

  try {
    let file = req.params[0]
    file = file.replace('.', '').replace('/', '').replace('\\', '') + '.json'

    fs.readFile(LOGS_PATH + file, (err, data) => {
      if (err) {
        res.status(500).end(`Server error: could not find log`)
        return
      }

      res.send(JSON.parse(data))
    })

  } catch (_e) {
    res.status(500).end(`Server error: ${_e.message}`)
  }

})

function getFileName() {
  const now = new Date(Date.now())
  const d = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
  const m = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  const y = now.getFullYear()
  const h = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
  const i = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  const s = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
  const ms = now.getMilliseconds() < 100 ? now.getMilliseconds() < 10 ? '00' + now.getMilliseconds() : '0' + now.getMilliseconds() : now.getMilliseconds()

  return `${y}-${m}-${d} ${h}:${i}:${s}:${ms}.json`
}

function saveLog(sent, received) {
  const filename = LOGS_PATH + getFileName()
  const output = {
    url: sent.params[0],
    method: sent.method,
    sent: {
      body: sent.body,
      headers: sent.headers
    },
    received: {
      body: received.body,
      headers: received.headers
    }
  }

  fs.writeFile(filename, JSON.stringify(output, null, 4), () => { })
}

module.exports = app
