import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from 'node:crypto';

const database = new Database();

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            if(!req.body){
                return res.writeHead(400).end('Missing request body.');
            }
            
            const { title, description } = req.body;
            
            if(!title || !description){
                return res.writeHead(400).end('Missing request body.');
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                createdAt: new Date(),
                completedAt: null,
                updatedAt: null
            }

            database.insert('tasks', task);

            return res.writeHead(201).end();
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks');

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            
            if(!req.body){
                return res.writeHead(400).end('Missing request body.');
            }
            
            const { title, description } = req.body;
            
            if(!title || !description){
                return res.writeHead(400).end('Missing request body.');
            }

            const tasks = database.select('tasks', {id});

            if(tasks){
                const task = tasks[0];

                const data = {
                    id: task.id,
                    title,
                    description,
                    createdAt: task.createdAt,
                    updatedAt: new Date(),
                    completedAt: task.completedAt
                }

                database.update('tasks', id, data);

                return res.writeHead(204).end();
            }

            return res.writeHead(404).end("Resource not found.");
        }
    },
    {
     method: 'DELETE',
     path: buildRoutePath('/tasks/:id'),
     handler: (req, res) => {
        const { id } = req.params;

        database.delete('tasks', id);

        return res.writeHead(204).end();
     }   
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;

            const tasks = database.select('tasks', {id});

            if(tasks){
                const task = tasks[0];

                const data = {
                    ...task,
                    updatedAt: new Date(),
                    completedAt: new Date()
                }

                database.update('tasks', id, data);

                return res.writeHead(204).end();
            }

            return res.writeHead(404).end("Resource not found.");
        }
    }
]