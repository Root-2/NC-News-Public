const request = require('supertest')
const app = require('../app')
const seed= require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const db = require('../db/connection')

console.log(testData.topicData)

// Closes database connection after each test.
afterAll(() => {db.end() });
// Re-seeds data before each test.
beforeEach(() => seed(testData))

describe("api/topics Tests", ()=>{
    test("api/topics returns a 200 status and an array of at least one item.", ()=>{
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((data)=>{
                expect(Array.isArray(data.body)).toBe(true)
                expect(data.body.length).toBe(testData.topicData.length)
            })            
    })
    test("api/topics items all contain slug and description.", ()=>{
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((data)=>{
                data.body.forEach(item => {
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
            .then((data)=>{
                expect(data.text).toEqual("Bad endpoint - File not found.")
            })
    })
})