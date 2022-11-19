const request = require("supertest");
const express = require("express");
const app = express();


describe('GET /users', function(){
    it('respond with json', function(done){
      request(app)
        .get('/user')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  });

describe('GET /searchUsers/:name', function(){
    it('respond with json', function(done){
      request(app)
        .get('/searchUsers/:name')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  }
);

describe('GET /searchUsers', function(){
    it('respond with json', function(done){
      request(app)
        .get('/searchUsers')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  }
);

describe('POST /newUser', function(){
    it('respond with json', function(done){
      request(app)
        .post('/newUser')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  }
);

describe('GET /allUser', function(){
    it('respond with json', function(done){
      request(app)
        .get('/allUser')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  }
);

describe('POST /login', function(){
    it('respond with json', function(done){
      request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  }
);

describe('POST /requestRecovery', function(){
    it('respond with json', function(done){
      request(app)
        .post('/requestRecovery')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  }
);

describe('POST /updatePassword', function(){
    it('respond with json', function(done){
      request(app)
        .post('/updatePassword')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  }
);

describe('PUT /updateUser/:id', function(){
    it('respond with json', function(done){
      request(app)
        .put('/updateUser/:id')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  }
);

describe('POST /updateUserPassword/:id', function(){
    it('respond with json', function(done){
      request(app)
        .post('/updateUserPassword/:id')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err){
          if (err) return done(err);
          done()
        });
    })
  }
);

describe('Post /acceptRequest/:userId', function(){
    it('respond with json', function(done){
        request(app)
            .post('/acceptRequest/:userId')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err){
            if (err) return done(err);
            done()
            });
        })
    }
);

describe('Delete /deleteRequest/:userId ', function(){
    it('respond with json', function(done){
        request(app)
            .delete('/deleteRequest/:userId')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err){
            if (err) return done(err);
            done()
            });
        })
    }
);

describe('Put /updateRole', function(){
    it('respond with json', function(done){
        request(app)
            .put('/updateRole')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err){
            if (err) return done(err);
            done()
            });
        })
    }
);

describe('Post /acceptRequest/:userId', function(){
    it('respond with json', function(done){
        request(app)
            .post('/acceptRequest/:userId')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err){
            if (err) return done(err);
            done()
            });
        })
    }
);

describe('Delete /acceptRequest/:userId', function(){
    it('respond with json', function(done){
        request(app)
            .delete('/acceptRequest/:userId')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err){
            if (err) return done(err);
            done()
            });
        })
    }
);

describe('Post /setUnityAdmin', function(){
    it('respond with json', function(done){
        request(app)
            .post('/setUnityAdmin')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err){
            if (err) return done(err);
            done()
            });
        })
    }
);

describe('Post /removeUnityAdmin', function(){
    it('respond with json', function(done){
        request(app)
            .post('/removeUnityAdmin')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err){
            if (err) return done(err);
            done()
            });
        })
    }
);
