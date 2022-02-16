const request = require('supertest')
const app = require('../app')
const seed= require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const db = require('../db/connection')

// Closes database connection after each test.
afterAll(() => {db.end() });
// Re-seeds data before each test.
beforeEach(() => seed(testData))

describe("api/topics Tests", ()=>{
    test("api/topics items all contain slug and description.", ()=>{
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({body:{topics}})=>{
                expect(topics.length).toBe(testData.topicData.length)
                topics.forEach(item => {
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
    })
    test("Incorrect APIs return a 404 if the path does not exist.", ()=>{
        return request(app)
            .get("/api/thisisabadpath")
            .expect(404)
            .then(({body:{msg}})=>{
                expect(msg).toEqual("Bad endpoint - File not found.")
            })
    })
})