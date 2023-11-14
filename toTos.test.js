const express = require('express');
const request = require('supertest');
const URL = 'http://localhost:3000/users';
const toDosURL='http://localhost:3000/todos'
const categpriesURL='http://localhost:3000/category'
const bodyParser = require("body-parser");

//IMPORTANT! CHANGE the category name before every test OR delete the last created category from the database mannualy 

//signup a new user using postman before you run the test,and use that to loggin
describe('testing-guest-routes', () => {

  let token;
  let UserId
  let categoryId
  let todoId

  test('POST /login - success', async () => {
    const credentials = { email: 'arafa_poper@hotmail.com', password: '0000' };
    const { body } = await request(URL).post('/login').send(credentials);
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('token');
    token = body.data.token;
  });

  test('Get /todos - success', async ()=>{
    const { body } =await request(toDosURL).get('/all').
    set('Authorization', `Bearer ${token}`).expect(200)
    expect(body).toHaveProperty('data')
})

 //to add a new todo , create a new category first
  test('Add new category',async()=>{
      const category={name:"newTest"}
      const {body}=await request(categpriesURL).post('/').send(category)
      .set('Authorization', `Bearer ${token}`).expect(200)
      //expect(body).toHaveProperty('status')
      expect(body.status).toEqual('success')
      UserId=body.data.UserId
      categoryId=body.data.id
  })

 test('Add new todo',async()=>{
    const todo={name:"test",description:"test",categoryId:categoryId}
     const {body}=await request(toDosURL).post('/').send(todo)
    .set('Authorization', `Bearer ${token}`).expect(200)
    expect(body.status).toEqual('success')
    expect(body.data.result).toHaveProperty('name')
    todoId=body.data.result.id
})

test('delete the todo',async()=>{
    const {body}=await request(toDosURL).delete(`/${todoId}`)
    .set('Authorization', `Bearer ${token}`).expect(200)
    expect(body.status).toEqual('success')
    expect(body.data.result).toBe("You have successfully marked the todo as deleted"); 
})
})

describe('testing JWT-fail',()=>{
     
  test('POST /login - success', async () => {
    const credentials = { email: 'arafa_poper@hotmail.com', password: '0000' };
    const { body } = await request(URL).post('/login').send(credentials);
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('token');
  });

  test('Get todos-fail',async()=>{
    const {body}=await request(toDosURL).get('/all').expect(401)
    expect(body).toHaveProperty('error')
  })

  test('invalid JWT token -fail',async()=>{
    const invalidToken='123456789'
    const {body}=await request(toDosURL).get('/all')
    .set('Authorization', `Bearer ${invalidToken}`)
    expect(body).toHaveProperty('status')
    expect(body.data.result).toBe('jwt malformed')
  })
})



