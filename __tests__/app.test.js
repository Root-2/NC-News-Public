const request = require('supertest')
const app = require('../app')
const seed= require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const db = require('../db/connection')

// Closes database connection after each test.
afterAll(() => {db.end() });
// Re-seeds data before each test.
beforeEach(() => seed(testData))

describe("api/topics", ()=>{
    test("Status 200 - Items all contain slug and description.", ()=>{
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
    test("Status 404 - Incorrect endpoint if path does not exist.", ()=>{
        return request(app)
            .get("/api/thisisabadpath")
            .expect(404)
            .then(({body:{msg}})=>{
                expect(msg).toEqual("Bad endpoint - Path not found.")
            })
    })
})

describe("/api/articles/:article_id", ()=>{
    test("Status 200 - Returns an object that resembles an article.", ()=>{
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((article)=>{

            expect(article.body).toEqual(
                expect.objectContaining({
                    author: expect.any(String),  
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            )}
        )
     })
     test("Status 404 - Reports if no item found.", ()=>{
        return request(app)
        .get("/api/articles/987654")
        .expect(404)
        .then((body)=>{
            expect(body.text).toBe("404 - No article at ID.")
        })
     })
     test("Status 400 - Bad ID", ()=>{
        return request(app)
        .get("/api/articles/badID")
        .expect(400)
        .then((body)=>{
            expect(body.text).toBe("400 - Bad request, ID should be a number.")
        })
     })
})

