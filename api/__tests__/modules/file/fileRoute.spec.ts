import { FileService } from './../../../src/modules/file/services/FileService';
import { Maybe } from 'tsmonad';
import { FileRouter } from './../../../src/modules/file/routes/FileRouter';
import { IFileService } from "../../../src/modules/file/services/IFileService";
import { IO } from "../../../src/libs/IO";
import * as supertest from "supertest"
import * as express from "express"
import * as bodyParser from "body-parser"
import { JWT, UserId, User, UserUUID } from "../../../src/modules/user/models/User";
import {} from "jest";
import { FileUUID } from '../../../src/modules/file/models/File';
import { WriteStream } from 'fs';
import { UserFactory } from '../../factories/UserFactory';
import { Trace } from '../../../src/modules/common/models';
import * as mockFs from "mock-fs"

describe("file route tests", () => {
  mockFs({
    'uploads': {
    },
    // 'path/to/some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
    // 'some/other/path': {/** another empty directory */}
  });

  const token = "123"
  const userFactory = new UserFactory
  const userId: UserId = new UserId(1)
  const userModel: User = new User(this.userId, new UserUUID("test"), userFactory.userData, Trace.createTrace(this.userId))

  const fileService = new class extends FileService {
    // upload(stream: NodeJS.ReadableStream, fileName: string, userId: UserId): WriteStream {
    //   let fstream = fs.createWriteStream('uploads') 
    //   stream.pipe(fstream)
    //   return fstream
    // }
    insert(uuid: FileUUID, userId: UserId): IO<number> {
      return IO.successful(1)
    }
  }

  let fileRoute = new FileRouter(fileService)

  const app = express()
  app.use(bodyParser.json())
  app.use((req, _, next) => {
    req.body.user = IO.successful(Maybe.just(userModel))
    next()
  })
  app.use(fileRoute.route())
  console.log(`${__dirname}/../../factories/elm.png`)
  test("file upload route", (done) => {
    supertest(app)
    .post('/upload')
    .attach('file', new Buffer([8, 6, 7, 5, 3, 0, 9]))
    .expect(200)
    .end(function(err, res) {
      if (err) throw err      
      done()
    });
  })
})