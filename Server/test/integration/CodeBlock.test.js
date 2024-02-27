const request = require('supertest');
const mongoose = require('mongoose');
const { CodeBlock } = require('../../models/codeBlock');
const { server } = require('../../index'); 

describe('/api/codeblocks', () => {
  beforeEach(async () => {
    await CodeBlock.deleteMany({});
  });

  afterAll(async () => {
    // Close the server and disconnect from the database after all tests are finished
    await server.close();
    await mongoose.disconnect();
  });

  describe('GET /', () => {
    it('should return all code blocks', async () => {
      await CodeBlock.collection.insertMany([
        { title: 'Title 1', code: 'Code 1' },
        { title: 'Title 2', code: 'Code 2' }
      ]);

      const res = await request(server).get('/api/codeblocks');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(cb => cb.title === 'Title 1')).toBeTruthy();
      expect(res.body.some(cb => cb.title === 'Title 2')).toBeTruthy();
      expect(res.body.some(cb => cb.code === 'Code 1')).toBeTruthy();
      expect(res.body.some(cb => cb.code === 'Code 2')).toBeTruthy();
    });
  });
  
  describe('GET /:id', () => {
    it('should return a code block if valid id is passed', async () => {
        const codeBlock = new CodeBlock({ title: 'Title', code: 'Code' });
        await codeBlock.save();
        
        const res = await request(server).get('/api/codeblocks/' + codeBlock._id);
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('title', codeBlock.title);
    });
    
    it('should return 404 if invalid id is passed', async () => {
        const res = await request(server).get('/api/codeblocks/1');
        
        expect(res.status).toBe(404);
    });
    
    it('should return 404 if no code block with the given id exists', async () => {
        const id = new mongoose.Types.ObjectId(); // Create a new ObjectId instance
        const res = await request(server).get('/api/codeblocks/' + id);
        
        expect(res.status).toBe(404);
    });
  });
  
  
  
  describe('POST /', () => {
          it('should save the code block if it is valid', async () => {
                const res = await request(server)
                  .post('/api/codeblocks') // Use post method for sending POST requests
                  .send({ title: 'Valid title', code: 'Valid code' });
          
                const codeBlock = await CodeBlock.findOne({ title: 'Valid title' }); // Use findOne instead of find

      expect(codeBlock).not.toBeNull();
    });

    it('should return the code block if it is valid', async () => {
          const res = await request(server)
            .post('/api/codeblocks') 
            .send({ title: 'Valid title', code: 'Valid code' });
    
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'Valid title');
      expect(res.body).toHaveProperty('code', 'Valid code');
    });
});


describe('PUT /:id', () => {
    it('should return 404 if id is invalid', async () => {
        const res = await request(server)
        .put('/api/codeblocks/1')
        .send({ title: 'Valid title', code: 'Valid code' });
        expect(res.status).toBe(404);
    });
    
    it('should return 404 if code block with the given id was not found', async () => {
        const id = new mongoose.Types.ObjectId();
        const res = await request(server)
        .put('/api/codeblocks/' + id)
        .send({ title: 'Valid title', code: 'Valid code' });
        
        expect(res.status).toBe(404);
    });
    
    it('should update the code block if input is valid', async () => {
        const codeBlock = new CodeBlock({ title: 'Title', code: 'Code' });
        await codeBlock.save();
        
        const res = await request(server)
        .put('/api/codeblocks/' + codeBlock._id)
        .send({ title: 'Updated title', code: 'Updated code' });
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('title', 'Updated title');
        expect(res.body).toHaveProperty('code', 'Updated code');
    });
    
    it('should return the updated code block if it is valid', async () => {
        const codeBlock = new CodeBlock({ title: 'Title', code: 'Code' });
        await codeBlock.save();
        
        const res = await request(server)
        .put('/api/codeblocks/' + codeBlock._id)
        .send({ title: 'Updated title', code: 'Updated code' });
        
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('title', 'Updated title');
        expect(res.body).toHaveProperty('code', 'Updated code');
    });
});


  describe('DELETE /:id', () => {
        it('should return 404 if id is invalid', async () => {
      const res = await request(server)
        .delete('/api/codeblocks/1')

      expect(res.status).toBe(404);
    });

    it('should return 404 if no code block with the given id was found', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server)
        .delete('/api/codeblocks/' + id)

      expect(res.status).toBe(404);
    });

    it('should delete the code block if input is valid', async () => {
      const codeBlock = new CodeBlock({ title: 'Title', code: 'Code' });
      await codeBlock.save();

      const res = await request(server)
        .delete('/api/codeblocks/' + codeBlock._id)

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', codeBlock._id.toHexString());
      expect(res.body).toHaveProperty('title', codeBlock.title);
      expect(res.body).toHaveProperty('code', codeBlock.code);
    });
  });
});
