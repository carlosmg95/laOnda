describe('a suite of tests', function() {
  this.timeout(500);

  it('should take less than 500ms', function(done){
    setTimeout(done, 500);
  });

  it('should take less than 500ms as well', function(done){
    setTimeout(done, 250);
  });
})
