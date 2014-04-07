module.exports = function(grunt) {

  var jsPath = 'app/scripts/';
  var jsLibPath = jsPath + 'lib/';
  var jsCPPath = jsLibPath + 'CrispyPear/';
  var plzAppFiles = [jsPath+'MainScene.js', jsPath+'lib/require.js', jsPath+'plzupload.js'];

  var cssPath = 'app/stylesheets/';

  var buildPath = 'public/build/';
  
  var minExt = '.min';

  function format(fileName) {
    return jsCPPath + fileName + minExt + '.js';
  }

  // Files for crispypear.js, in order.
  var cpFiles = [format('lib/PxLoader-min'), format('CPUtils'), format('CPDisplayObject'),
                format('CPImage'), format('CPSprite'), format('CPText'), format('CPDisplayGroup'),
                format('CPButton'), format('CPActionCanvas'), format('CPSceneManager'),
                format('CPResourceManager'), format('CPGame'), format('CPLayer'),
                format('CPScene')];

  // Project configuration.
  grunt.initConfig({


    pkg: grunt.file.readJSON('package.json'),


    uglify: {
      all: {
        files: [{
            expand: true,       // Enable dynamic expansion.
            flatten: false,     // keep subdirectories archi
            cwd: jsPath,        // Src matches are relative to this path.
            src: ['**/*.js'],   // Actual pattern(s) to match.
            dest: jsPath,       // Destination path prefix.
            ext: minExt+'.js',  // Dest filepaths will have this extension.
          }]
      }
    },


    cssmin: {
      all: {
        files: [{
          expand: true,
          cwd: cssPath,
          ext: '.css',
          src: ['**/*.css'],
          dest: buildPath 
        }]
      }
    },


    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        separator: ';'
      },
      // build crispyPear.js
      cp: {
        src: cpFiles,
        dest: jsLibPath + 'crispypear'+minExt+'.js',
      },
      // build libs.js
      lib: {
        src: [jsLibPath+'*'+minExt+'.js'], // Actual pattern(s) to match.
        dest: buildPath+'libs.js',   // Destination path prefix.
      },
      // build app.js
      app: {
        src: [jsPath+'*'+minExt+'.js', jsPath+'scenes/*'+minExt+'.js'], // Actual patterns to match.
        dest: buildPath+'app.js',   // Destination path prefix.
      },
    },


    clean: {
      js: {
        expand: true,     // Enable dynamic expansion.
        flatten: true,   // keep subdirectories archi
        cwd: jsPath,   // Src matches are relative to this path.
        src: ['**/*'+minExt+'.js'], // Actual pattern(s) to match.
      },
      css: {
        expand: true,     // Enable dynamic expansion.
        flatten: true,   // keep subdirectories archi
        cwd: cssPath,   // Src matches are relative to this path.
        src: ['**/*'+minExt+'.css'], // Actual pattern(s) to match.
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');


  // Default task(s).
  grunt.registerTask('default', ['clean', 'uglify', 'cssmin', 'concat', 'clean']);

};