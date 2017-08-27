import * as express from 'express'
import { Blog } from '../models/Blog'

export let blogRouter = express.Router();

// Default get route
blogRouter.get('/', async (req, res, next) => {
    
    let blog = new Blog();

    // Get all blogs
    let blogs = await blog.getAllBlogs();

    // Return to response
    res.json( blogs );
});


// Default post route
blogRouter.post('/', async (req, res, next) => {
    
    let blog = new Blog();
    
    blog.title = req.body.title;
    blog.description = req.body.description;
    blog.created_by = req.body.user_id;
    blog.updated_by = req.body.user_id;

    // Add new blog
    let response = await blog.add();

    // Return to response
    res.json( response );
});

// Default delete route
blogRouter.delete('/:guid', async (req, res, next) => {
    let blog = new Blog();
    blog.guid = req.params.guid;
    
    // Add new blog
    let response = await blog.delete();
    
    // Return to response
    res.json( response );
});