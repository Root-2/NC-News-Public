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
    test("api/topics returns a 200 status and an array of at least one item.", ()=>{
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((data)=>{
                console.log(data.body)
                expect(Array.isArray(data.body)).toBe(true)
                expect(data.body.length).toBeGreaterThan(0)
            })            
    })
    test("api/topics items all contain slug and description.", ()=>{
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((data)=>{
                for( let i = 0; i < data.body.length; i++) {
                    expect(data.body[i].hasOwnProperty('slug')).toBe(true);
                    expect(data.body[i].hasOwnProperty('description')).toBe(true);
                }
            })
    })
    test.only("Incorrect APIs return a 404 if the path does not exist.", ()=>{
        return request(app)
            .get("/api/thisisabadpath")
            .expect(404)
            .then((data)=>{
                expect(data.text).toEqual("Bad endpoint - File not found.")
            })
            
    })
})