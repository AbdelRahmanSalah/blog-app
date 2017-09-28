import { FileData, FileEntity, fileEntity } from './../models/File';
import * as express from 'express'
import { File, FileUUID } from '../models/File'
import { FileService } from '../services/FileService'
var multer = require('multer')
var fs = require('fs')

export let fileRouter = express.Router();

let fileService = new FileService();

// Get files by object_model, object_id
fileRouter.get('/all/:model/:id', async (req, res, next) => {
  let objectId = req.params.id;
  let objectModel = req.params.model;
  let files = await fileService.findByObject(objectId, objectModel);
  res.json(files);
});

// Get file with guid
fileRouter.get('/:guid', async (req, res, next) => {
  let guid = req.params.guid;
  let file = await fileService.find(guid);
  res.json(file);
});

fileRouter.post('/upload', async function(req, res) {

  fileService.upload(req, res)
  
});

// Attach files with object_id, object_model
fileRouter.put('/attach', async (req, res, next) => {
  let response = await fileService.attach(req.body.object_id, req.body.object_model, req.body.files);
  res.json(response);
});

// Update file
fileRouter.put('/:guid', async (req, res, next) => {
  let guid = req.params.guid;
  let updates = req.body;

  let response = await fileService.update(guid, updates);
  res.json(response);
});

// Default delete route
fileRouter.delete('/:guid', async (req, res, next) => {
  let guid = req.params.guid;
  let response = await fileService.delete(guid);
  res.json(response);
});
