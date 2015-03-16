var shelljs = require('shelljs');
module.exports = function(grunt) {

  var watchFiles = {
    jsFiles: ['src/js/**/*.js'],
    cssFiles: ['src/css/**/*.css'],
    htmlFiles: ['src/html/**/*.html']
  };

  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      // Concat all js files
      js: {
        src: ['src/lib/ionic/js/ionic.bundle.js',
        'src/lib/ng-cordova/dist/ng-cordova.js',
        'src/lib/jquery/dist/jquery.js',
        'src/js/**/*.js'],
        dest: 'www/js/moonSongsIonic.js',
      },
      // Concat all css files
      css: {
        src: ['src/lib/ionic/css/ionic.css', 'src/css/min/*.min.css'],
        dest: 'www/css/style.css'
      }
    },
    // Minify css
    cssmin: {
      target: {
        files: [{
          expand: true,
          src: ['www/css/style.css'],
          ext: '.min.css'
        }]
      }
    },
    // Uglify js
    uglify: {
      options: {
        mangle: false,
        compress: {
          drop_console: true
        }
      },
      js: {
        files: {
          'www/js/moonSongsIonic.min.js': ['www/js/moonSongsIonic.js']
        }
      }
    },
    // Clean www/ directory
    clean: {
      js: ['www/js'],
      css: ['www/css', 'src/css/**/*.min.css'],
      html: ['www/index.html', 'www/modals', 'www/templates'],
      fonts: ['www/fonts'],
      img: ['www/img'],
      release: ['www/js/moonSongsIonic.js', 'www/css/style.css'],
      www: ['www/**']
    },
    // Copy static html and resources to www/ directory
    sync: {
      fonts: {
        files: [{
          cwd: 'src/lib/ionic/fonts',
          src: [
            '**'
          ],
          dest: 'www/fonts',
        }],
        verbose: true
      },
      html: {
        files: [{
          cwd: 'src/html/',
          src: [
            '**'
          ],
          dest: 'www/'
        }]
      },
      img: {
        files: [{
          cwd: 'src/img/',
          src: [
            '**'
          ],
          dest: 'www/img/'
        }]
      }
    },
    // Check js syntaxy
    jshint: {
      all: ['Gruntfile.js', 'src/js/**/*.js']
    },
    watch: {
      options: {
        spawn: false,
        livereload: 1335
      },
      // Watch any js/css change and re-concat it
      js: {
        files: watchFiles.jsFiles,
        tasks: ['jshint', 'concat:js']
      },
      css: {
        files: watchFiles.cssFiles,
        tasks: ['concat:css']
      },
      // Watch any html change and re-sync it
      html: {
        files: watchFiles.htmlFiles,
        tasks: ['sync:html']
      }
    },
    // launchs watch and ionic task at the same time
    concurrent: {
      dev: ['watch', 'ionic'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  // Installs bower dependences
  grunt.registerTask('bower', function() {
    var done = this.async();
    if (!shelljs.which('bower')) {
      grunt.log.error('Bower is not installed');
      return false;
    }
    shelljs.exec('bower install', function() {
      done();
    });
  });

  // Starts ionic serve
  grunt.registerTask('ionic', function() {
    var done = this.async();
    if (!shelljs.which('ionic')) {
      grunt.log.error('Ionic is not installed');
      return false;
    }
    grunt.log.writeln('To finish wath + ionic type ctrl + c').ok();
    shelljs.exec('ionic serve', function(code, output) {
      done();
    });
  });

  // Install bower dependences and build project
  grunt.registerTask('install', ['clean', 'bower', 'build']);
  // Build project and uglify
  grunt.registerTask('build', ['jshint', 'concat', 'cssmin', 'sync', 'uglify']);
  // Build project without minify and uglify
  grunt.registerTask('build-dev', ['jshint', 'concat', 'sync']);
  // Build project and start ionic serve
  grunt.registerTask('dev', ['jshint', 'concat', 'cssmin', 'sync', 'concurrent:dev']);
  // Build project and clean dev files
  grunt.registerTask('release', ['install', 'clean:release']);
};
