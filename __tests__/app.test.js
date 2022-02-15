const request = require('supertest')
const app = require('../app')
const seed= require('../db/seeds/seed')
const data = require('../db/data/test-data')
const db = require('../db/connection')

// Closes database connection after each test.
afterAll(() => {db.end() });
// Re-seeds data before each test.
beforeEach(() => seed(data))

describe("api/topics Tests", ()=>{
    test("api/topics returns a 200 status", ()=>{
        return request(app)
            .get("/api/topics")
            .expect(200)
    })
})