var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/middleware');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jsend=require('jsend');
const db = require('../models');

const TodoService=require('../services/todoService')
const todoService = new TodoService(db);
const CategoryService=require('../services/categoryService')
const categoryService = new CategoryService(db);

router.use(jsend.middleware);


/* Return all the logged in users todo's with the category associated with each todo and
status that is not the deleted status */
router.get('/', isAuth, async(req, res) => {
	const userId = req.userData.id;
    try {
        const data = await todoService.getTodos(userId);
        res.jsend.success({ statusCode: 200, result: data });
    } catch (err) {
        res.jsend.error(err)
    }
	return ;
});


// Return all the users todos including todos with a deleted status
router.get('/all', isAuth, async (req, res) => {
	const userId=req.userData.id
	try{
		const data=await todoService.getAlltodos(userId)
		res.jsend.success({statusCode:200, result:data})
	} catch(err){
		res.jsend.error(err)
	}
	
});

// Return all the todos with the deleted status
router.get('/deleted', async (req, res) => {
    try {
        const data = await todoService.getDeleteTodos();
        res.jsend.success({ statusCode: 200, result: data });
    } catch (err) {
        console.error("Error fetching deleted todos:", err);  
        res.jsend.error(err);
    }
});


// Add a new todo with their category for the logged in user
router.post('/', isAuth, jsonParser,async (req, res) => {
    const userId = req.userData.id;
    const { name, description, categoryId } = req.body;
    const statusId = 1
    if (name == null || description == null || categoryId == null) {
		return res.jsend.fail({ statusCode: 400, result: "Name, description and category are required." })
	}
	try {
        const data = await todoService.createTodos(name, description, categoryId, statusId, userId);
		res.jsend.success({ statusCode: 200, result: data });
    } catch (err) {
		res.jsend.error(err)
    }
});


//Return all the statuses from the database
router.get('/statuses', async (req, res) => {
	try {
		const data = await todoService.getStatus();
		const statusNames = data.map(entry => entry.status); 
		console.log(statusNames); 
		res.jsend.success({ statusCode: 200, result: statusNames });
	} catch (err) {
		res.jsend.error(err);
	}
});


// Change/update a specific todo for logged in user
router.put('/:id', isAuth, jsonParser, async(req, res) => {
	const userId=req.userData.id
	const{name,description,categoryId,statusId}=req.body
	const todoId=req.params.id

  	if(name==null||description==null||categoryId==null||statusId==null){
	  return res.jsend.fail({statusCode:400,result:"Name, description, category and status are required."})	
	}
	try {
		await todoService.changeTodo(name, description, categoryId, statusId, userId, todoId);
		res.jsend.success({ statusCode: 200, result: "you have succesfully changed the data"});
	}
	catch (err) {
		res.jsend.error(err)
	}

});

// Delete a specific todo if for the logged in user
router.delete('/:id', isAuth, jsonParser, async (req, res) => {
    const todoId = req.params.id;
    const userId = req.userData.id;

    try {
        const data=await todoService.deleteTodos(todoId, userId);
        res.jsend.success({ statusCode: 200, result: "You have successfully marked the todo as deleted" });
    } catch (err) {
        res.jsend.error(err);
    }
});

module.exports = router;

