const gulp = require('gulp'),
svgstore = require('gulp-svgstore'),
svgmin = require('gulp-svgmin'),
rename = require('gulp-rename'),
frontMatter = require('gulp-front-matter'),
filenames = require("gulp-filenames"),
exec = require('child_process').exec;


gulp.task('icons', function () {
  return gulp.src('./assets/images/icons/src/*')
    .pipe(svgmin())
    .pipe(svgstore({ inlineSvg: true, prefix: 'icon-'}))
    .pipe(rename('icons.svg'))
    .pipe(gulp.dest('./assets/images/icons/'));
});



gulp.task('ebook-prep-copy', function() {
  return gulp.src(['_unit_*/**/*']).pipe(gulp.dest('./tmp'))
})

gulp.task('ebook-prep', function() {
  return gulp.src('./tmp/_unit_*/*.markdown')
  .pipe(frontMatter({
    property: 'frontMatter',
    remove: true
  }))
  .pipe(makeChange())
  .pipe(gulp.dest((file) => file.base))
});

gulp.task('ebook', function(cb) {
  exec('gulp ebook-prep-copy && gulp ebook-prep && gulp ebook-panda && rm -rf ./tmp', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  })
});

/*
pandoc -S -o intro-web-architecture.epub title.txt  tmp/_unit_0/becoming-a-social-architect.markdown && say ebook generated && open intro-web-architecture.epub 
pandoc -S -o intro-web-architecture.epub title.txt    && say ebook generated && open intro-web-architecture.epub 
*/

gulp.task('ebook-panda', function(cb) {
  return gulp.src('_unit_*/*')
  .pipe(filenames("panda"))
  .on('end', function() {
    let sources = filenames.get("panda").sort().map((file) => (
      `./tmp/${file}`
    )).join(' ');
    exec(`pandoc --toc -S -o intro-web-architecture.epub title.txt ${sources}`, function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      
    });
  })
});

function tracePanda() {
  //console.log(filenames.get('./'));
  function transform(file, cb) {
    //console.log(file.base, file.path);
    
    cb(null, file);
    
  }
  return require('event-stream').map(transform);
}

function makeChange() {
  // you're going to receive Vinyl files as chunks
  function transform(file, cb) {
    // read and modify file contents
    
    let contents = String(file.contents);
    contents = contents.replace(/ *{%\scomment[^]*endcomment\s%}*/gi, '');
    contents = contents.replace(/{{\ssite.baseurl\s}}/g, '.');
    
    contents = contents.replace(/<picture>[^]*<\/picture>/gi, function(picture) {
      //return 'YOLO';
      try {
        return picture.match(/<img([\w\W]+?)\/>/i)[0];
      } catch (e) {
        return '';
      } 
    });
    const frontMatter = Object.assign({}, {title:''}, file.frontMatter);
    
    file.contents = new Buffer(`
# ${frontMatter.title}

${contents}
`);

    // if there was some error, just pass as the first parameter here
    cb(null, file);
  }

  // returning the map will cause your transform function to be called
  // for each one of the chunks (files) you receive. And when this stream
  // receives a 'end' signal, it will end as well.
  // 
  // Additionally, you want to require the `event-stream` somewhere else.
  return require('event-stream').map(transform);
}