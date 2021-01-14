const test = require('ava')
const app = require('./app')
const request = require('supertest')(app)

test('Health check', async t => {
  const res = await request.get('/status')

  t.is(res.status, 200)
  t.deepEqual(res.body, { status: 'on' })
})

// test('Capture', async t => {
//   const res = await request.get('/url?s=https://apiprofhistoria.eutobias.com/api/v1/news')

//   t.is(res.status, 200)
//   t.deepEqual(res.body, { status: 'on' })
// })

// test('Logs', async t => {
//   const res = await request.get('/logs')
//   t.is(res.status, 200)
// })

// test('RichRelevance JS Lib p13n.js', async t => {
//   const res = await request.get('/p13n.js')

//   t.is(res.status, 200)
// })

// test('RichRelevance getting recomendations from generated data (/p13n_generated.js)', async t => {
//   const params = 'a=1a37b6c52222480d&ts=1576001377094&v=1.2.6.20191022&ssl=t&pt=%7Chome_page.rr1&u=105775058c4259181c1db7b740a015a1088d0c78d478ec0c321cb105fde256cd&s=8324a129-1c31-1595-3904-106d1eb43a9a&cts=https%3A%2F%2Fwww.usereserva.com&rid=ECOMMERCE&p=%7C0047916101%7C0052795307%7C0043955014%7C0049705312&rcs=eF5jYSlN9jAwS041TDVK0TUwNrPQNTE3NNVNNkq21E0xNE2ySE2zMDFPseTKLSvJTBEwNLc01AVCAJTBDkU&l=1'
//   const res = await request.get(`/p13n_generated.js?${params}`)

//   t.is(res.status, 200)
// })

// test('RichRelevance search + hardcoded params (/search?...)', async t => {
//   const params = 'ssl=true&start=0&rows=5&region=ECOMMERCE&placement=search_page.find&lang=pt&sessionId=8324a129-1c31-1595-3904-106d1eb43a9a&userId=105775058c4259181c1db7b740a015a1088d0c78d478ec0c321cb105fde256cd&filter={!tag=product_brand}product_brand:%22adulto%22&query=bermuda'
//   const res = await request.get(`/search?${params}`)

//   t.is(res.status, 200)
// })
