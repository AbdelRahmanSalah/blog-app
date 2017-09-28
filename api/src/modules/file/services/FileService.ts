import { File, FileData, FileUUID, fileEntity } from './../models/File'
import * as fs from "fs"
import * as multer from "multer"
import * as uuid from "uuid"
import { Request, Response } from "express"

export class FileService {


  public upload(req: Request, res: Response) {
    // return new Promise<boolean>((resolve, reject) => {
      const fileUUID = new FileUUID(uuid.v1()) 
      let fileData: FileData
    
      let storage = multer.diskStorage({
        destination: function(req, file, callback) {
          let uploadDir: string = './uploads/'
          let dest: string = uploadDir + fileUUID.value
          let stat: fs.Stats
          try {
            stat = fs.statSync(dest)
          }
          catch (err) {
            try {
              fs.statSync(uploadDir);
            }
            catch (err) {
              fs.mkdirSync(uploadDir);
            }
            fs.mkdirSync(dest);
          }
          if (stat && !stat.isDirectory()) {
            res.json("error create directory")
          }
          callback(null, dest);
        },
        filename: function(req, file, callback) {
          fileData = new FileData(file.originalname, "blog")
          callback(null, file.originalname);
        }
      });
      let upload = multer({ storage: storage }).single('file');
    
      upload(req, res, async function(err) {
        if (err) {
          res.json("error");
        }
    
        // Add new file
        let response = await fileEntity.insert(fileEntity.uuid.set(fileUUID), ...fileEntity.data.columns(fileData));
        res.json(response)
      });
    // })
  }

  // abstraction for finding file
  public find(guid?: string) {
    if (guid)
      return this.findByGuid(guid);
    else
      return this.findAll();
  }

  // Get all files
  public async findAll() {
    return await fileEntity
      .find()
      .catch(function(err) {
        return err
      });
  }

  // Get file by guid
  public async findByGuid(guid: string) {
    return await fileEntity
      .find()
      .where('guid', guid)
      .catch(function(err) {
        return err
      });
  }

  // Get file by guid
  public async findByObject(objectId: number, objectModel: string) {
    return await fileEntity
      .find()
      .where('object_id', objectId)
      .where('object_model', objectModel)
      .catch(function(err) {
        return err
      });
  }

  // Add new file
  public async insert(file: File) {
    return await fileEntity
      .insert(file)
      .catch(function(err) {
        return err
      });
  }

  // Update file
  public async update(guid: string, updates: any) {
    return await fileEntity
      .update(updates)
      .where('guid', guid)
      .catch(function(err) {
        return err
      });
  }

  // Delete file
  public async delete(guid: string) {
    return await fileEntity
      .delete()
      .where('guid', guid)
      .catch(function(err) {
        return err
      });
  }

  // Attach file
  public attach(objectId: number, objectModel: string, files: string[]) {
    return fileEntity.update(fileEntity.ref.objectId.set(objectId),  
      .attach(objectId, objectModel, files)
      .catch(function(err) {
        return err
      });
  }
}
