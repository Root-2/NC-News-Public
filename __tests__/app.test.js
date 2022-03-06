const request = require('supertest')
const app = require('../app')
const seed= require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const db = require('../db/connection')
const { forEach } = require('../db/data/test-data/articles')

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

describe("/api/articles", ()=>{
    test("Status 200 - Returns an array of article objects.", ()=>{
        return (request(app)
        .get("/api/articles")
        .expect(200)
        .then((response)=>{
            response.body.forEach(article =>
            expect(article).toEqual(
                expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            ))
        })

        )

    })
    test("Status 200 - Also returns a comment count.", ()=> {
        return (request(app)
        .get("/api/articles")
        .expect(200)
        .then((response)=>{
            response.body.forEach(article =>
            expect(article).toEqual(
                expect.objectContaining({
                    comment_count: expect.any(Number)
                })
            ))
        })

        ) 
    })
})




describe("/api/articles/:article_id", ()=>{
    test("Status 200 - Returns an object that resembles an article.", ()=>{
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    author: expect.any(String),  
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                })
            )}
        )
     })
    test("Status 200 - Contains a comment count.", ()=>{
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    comment_count: expect.any(Number)
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

describe("patch api/articles/article_id", ()=> {
    test("Status 200 - Vote increments by requested amount.", () => {
         return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 5})
        .expect(200)
        .then(({body})=>{
          expect(body.votes).toBe(105)
        })
    })
    test("Status 200 - Vote decrements normally.", () => {
        return request(app)
       .patch("/api/articles/1")
       .send({ inc_votes: -5})
       .expect(200)
       .then(({body})=>{
         expect(body.votes).toBe(95)
       })
       
   })
   test("Status 400 - Bad request - Bad patch object.", () => {
    return request(app)
   .patch("/api/articles/1")
   .send({ eat_votes: -5})
   .expect(400)
   .then(({body})=>{
     expect(body.msg).toBe("400 - Bad request - Bad patch object.")
        })
    })
    test("Status 404 - Reports if no item found.", ()=>{
        return request(app)
        .patch("/api/articles/987654")
        .send({ inc_votes: 5})
        .expect(404)
        .then((body)=>{
            expect(body.text).toBe("404 - No article at ID.")
        })
     })
        test("Status 404 - Reports if no item found.", ()=>{
        return request(app)
        .patch("/api/articles/987654")
        .send({ inc_votes: 5})
        .expect(404)
        .then((body)=>{
            expect(body.text).toBe("404 - No article at ID.")
        })
     })

})

describe("/api/articles/:article_id/comments", ()=>{
    test("Status 200 - Returns an array of comments.", ()=>{
        const article3comments = [{"author": "icellusedkars", "body": "git push origin master", "comment_id": 10, "created_at": "2020-06-20T07:24:00.000Z", "votes": 0}, {"author": "icellusedkars", "body": "Ambidextrous marsupial", "comment_id": 11, "created_at": "2020-09-19T23:10:00.000Z", "votes": 0}]
        return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({body})=>{
            expect(body).toEqual(article3comments)
        })
    })
})



describe("api/users", ()=>{
    test("200 - Returns an array of objects with the username property.", ()=>{
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body:{users}})=>{
            expect(users.length).toBe(testData.userData.length)
            users.forEach(item => {
                expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe("/api/articles/:article_id/comments", ()=>{
    test("200 - Posts a comment and returns the posted comment.", ()=> {
        return request(app)
        .post("/api/articles/1/comments")
        .send({
            username: "butter_bridge",
            body: "This is an article."}) 
        .expect(200)
        .then(({body})=>{
            expect(body).toEqual({
                comment_id: 19,
                body: 'This is an article.',
                article_id: 1,
                author: 'butter_bridge',
                votes: 0,
                created_at: expect.any(String)
              })
        })
    })
})