import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_DB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGO_DB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

// 👇 Extend global type (only needed in development)
declare global {
  // Allow adding custom properties to the Node.js global object
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri!, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri!, options)
  clientPromise = client.connect()
}

export default clientPromise
