import { Entity, Primative, Composite, Column } from './../../entity/models/Entity'
import { UUID, Id, Trace, CompositeTrace, stringColumn } from "../../common/models";
import { UserId } from "../../user/models/User";
// import { IFileRepository } from './../repositories/IFileRepository'
// import { FileMysqlRepository } from './../repositories/FileMysqlRepository'

// File repository
// let _fileRepository: IFileRepository = new FileMysqlRepository();

export class FileId {
  constructor(public value: Id) {}
}

export class FileUUID {
  constructor(public value: UUID) {}
}

export class FileRef {
  constructor(public objectId: Id) {}
}

export class FileData {
  constructor(public title: string, public objectModel: string) {}
}

export class File {
  constructor(
    public id: FileId, 
    public guid: FileUUID, 
    public ref: FileRef, 
    public data: FileData, 
    public trace: Trace) {}
}

type FileEntityType = FileId | UserId | Date | string | number

export class FileEntity extends Entity<FileEntityType, Primative> {

  public id = new class extends Column<FileId, Id> {
    constructor() { super("id") }
    public getValue(value: FileId): Id {
      return value.value
    }
  }
  public uuid = new class extends Column<FileUUID, UUID> {
    constructor() { super("guid") }
    public getValue(value: FileUUID): string {
      return value.value
    }
  }

  public ref = new class extends Composite<FileRef, Id> {
    public objectId = new class extends Column<Id, Id> {
      constructor() { super("id") }
      public getValue(value: Id): Id {
        return value
      }
    }

    public columns = (composite: FileRef) => {
      return [
        this.objectId.set(composite.objectId),
      ]
    }
  }

  public data = new class extends Composite<FileData, string> {
    public title = stringColumn("title")
    public objectModel = stringColumn("object_model")

    public columns = (composite: FileData) => {
      return [
        this.title.set(composite.title),
        this.objectModel.set(composite.objectModel)
      ]
    }
  }

  public trace = CompositeTrace
  
  public tableName() {
    return "file";
  }

  public tableColumns() {
    return ['id', 'title', 'object_id', 'object_model', 'guid', 'created_by', 'created_at', 'updated_by', 'updated_at'];
  }

  // Attach file with object
  // public attach(objectId: number, objectModel: string, files: string[]) {
  //   return _fileRepository.attach(objectId, objectModel, files);
  // }
}

export const fileEntity = new FileEntity()