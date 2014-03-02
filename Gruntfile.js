module.exports = function(grunt) {'use strict';

  var pkg = grunt.file.readJSON('package.json');
  var today = new Date();

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsonlint: {
      pkg: {
        src: ['package.json']
      },
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/',
          optimize: 'none',
          useStrict: true,
          name: 'warmsea',
          out: function(text) {
            text = text
            // $VERSION$, x.y.z
            .replace('$VERSION$', pkg.version)
            // $YEAR$, yyyy
            .replace('$YEAR$', today.getFullYear())
            // $DATE$, yyyy-mm-dd
            .replace('$DATE$', today.toISOString().substring(0, 10));
            // Write concatenated source to file
            grunt.file.write('dist/' + pkg.name + '.js', text);
          },
          skipSemiColonInsertion: true,
          wrap: {
            startFile: 'src/intro.js',
            endFile: 'src/outro.js'
          },
          onBuildWrite: function(moduleName, path, contents) {
            var header = contents.indexOf('$HEADER$');
            header = contents.indexOf('\n', header);
            var footer = contents.lastIndexOf('$FOOTER$');
            footer = contents.lastIndexOf('\n', footer);
            contents = contents.substring(header, footer);
            contents = contents.replace(/^\n+/, '').replace(/\n+$/, '\n');
            return contents.trim() ? contents : '';
          },
        }
      }
    },
    jshint: {
      options: {
        // Enforcing options
        'camelcase': true,
        'curly': true,
        'eqeqeq': true,
        'freeze': true,
        'immed': true,
        'latedef': true,
        'noarg': true,
        'newcap': true,
        'nonbsp': true,
        'nonew': true,
        'quotmark': 'single',
        'undef': true,
        'unused': true,
        'strict': true,
        'trailing': true,
        // Globals
        'globals': {
          'module': false,
          'define': false,
          'require': false
        },
        // Ignores
        'ignores': ['src/intro.js', 'src/outro.js'],
      },
      src: {
        files: {
          src: ['Gruntfile.js', 'src/**/*.js']
        }
      },
      test: {
        files: {
          src: ['test/test.js', 'test/units/**/*.js']
        },
        options: {
          // Enforcing options
          'strict': false,
          // Globals
          'globals': {
            'module': false,
            'define': false,
            'require': false,
            'test': false,
            'ok': false
          }
        }
      },
      compiled: {
        files: {
          src: ['dist/warmsea.js']
        }
      }
    },
    uglify: {
      options: {
        preserveComments: 'some',
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jsonlint', 'jshint:src', 'jshint:test', 'requirejs', 'jshint:compiled', 'uglify']);

};
