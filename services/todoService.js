const{Op}=require('sequelize')

class TodoService{
    constructor(db){
        this.client=db.sequelize
        this.todo=db.Todo
        this.category=db.Category
        this.status=db.Status
    }

     async createTodos(name, description, categoryId, statusId, userId) {
         //to check if the category belongs to the user
         const category = await this.category.findOne({
            where: {
                id: categoryId,
                UserId: userId
            }
        });
        if (!category) {
            throw new Error("Category does not belong to the user");
        }

        return await this.todo.create({
            name: name,
            description: description,
            CategoryId: categoryId,
            StatusId: statusId,
            UserId: userId
        });
    }

    async changeTodo(name, description, categoryId, statusId, userId, todoId) {
        //to check if the category belongs to the user
        const category = await this.category.findOne({
            where: {
                id: categoryId,
                UserId: userId
            }
        });
        if (!category) {
            throw new Error("Category does not belong to the user");
        }

        //to check if the todo belongs to the user
        const todos=await this.todo.findOne({
            where:{
                id:todoId,
                UserId:userId
            }
        })
        if(!todos){
            throw new Error("Todo does not belong to the user")
        }

        return await this.todo.update({
            name: name,
            description: description,
            CategoryId: categoryId,
            StatusId: statusId,
        },
        {
            where: {
                id: todoId
            }
        });
    }
    

    async getTodos(userId) {
        return await this.todo.findAll({
            where: {
                UserId: userId
            },
            include: [{
                model: this.category,
                attributes: ['name']
            },
            {
                model: this.status,
                attributes: ['status'],
                where: { status: { [Op.ne]: 'Deleted' } }  // Exclude deleted status
            }
            ]
        });
    }

    async getAlltodos(userId) {
        return await this.todo.findAll({
            where: {
                UserId: userId
            },
            include:[{
                model:this.status,
                attributes:['status']
            }]
        });
    }

    async getDeleteTodos() {
        return await this.todo.findAll({
          include:{
            model:this.status,
            attributes:['status'],
            where:{status:{[Op.eq]:'Deleted'}}
          }
        })
    }

    async getStatus(){
       return await this.status.findAll()
    }

    async deleteTodos(todoId, userId) {
        // Check if this todoId belongs to the user
        const todo = await this.todo.findOne({
            where: {
                id: todoId,
                userId: userId,
            }
        });
    
        if (!todo) {
            throw new Error("Todo does not belong to the user");
        }
        
        // Update the specific todo's StatusId to 4
        return await this.todo.update({
            StatusId: 4
        }, {
            where: {
                id: todoId
            }
        });
    }
    






}

module.exports=TodoService