module.exports = function(grunt) {
  'use strict';

  var pkg = grunt.file.readJSON('package.json');
  var gzip = require('gzip-js');
  var today = new Date();

  // Project configuration.
  // jshint -W106
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsonlint: {
      pkg: {
        src: ['package.json']
      }
    },
    jscs: {
      src: 'src/**/*.js',
      options: {
        config: '.jscs.json'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/',
          optimize: 'none',
          useStrict: true,
          name: 'warmsea',
          out: function(text) {
            var underscore = grunt.file.read('lib/underscore/underscore.js').replace(/\$/g, '$$$$');
            text = text
              // $VERSION$, x.y.z
                .replace(/\$VERSION\$/g, pkg.version)
              // $YEAR$, yyyy
                .replace(/\$YEAR\$/g, today.getFullYear())
              // $DATE$, yyyy-mm-dd
                .replace(/\$DATE\$/g, today.toISOString().substring(0, 10))
              // $UNDERSCORE$, the underscore.js source code
                .replace(/\$UNDERSCORE\$/g, underscore);
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
            header = header >= 0 ? contents.indexOf('\n', header) : 0;
            var footer = contents.lastIndexOf('$FOOTER$');
            footer = footer >= 0 ? contents.lastIndexOf('\n', footer) : contents.length;
            contents = contents.substring(header, footer);
            contents = contents.replace(/^\n+/, '').replace(/\n+$/, '\n');
            return contents.trim() ? contents : '';
          }
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
          '_': false,
          'module': false,
          'define': false,
          'require': false
        },
        // Ignores
        'ignores': ['src/intro.js', 'src/outro.js']
      },
      src: {
        files: {
          src: ['Gruntfile.js', 'src/**/*.js']
        }
      },
      test: {
        files: {
          src: ['test/*.js']
        },
        options: {
          // Enforcing options
          'strict': false,
          // Globals
          'globals': {
            'require': false,
            'describe': false,
            'it': false,
            'beforeEach': false,
            'afterEach': false
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
        preserveComments: 'some'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    mochaTest: {
      options: {
        reporter: 'dot'
      },
      src: ['test/*.js']
    },
    jsdoc: {
      dist: {
        src: ['dist/warmsea.js'],
        options: {
          destination: 'jsdoc'
        }
      }
    },
    compare_size: {
      files: ['dist/warmsea.js', 'dist/warmsea.min.js'],
      options: {
        compress: {
          gz: function(contents) {
            return gzip.zip(contents, {}).length;
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-compare-size');

  // Default task(s).
  grunt.registerTask('default', [
    'jsonlint',
    'jscs',
    'jshint:src',
    'jshint:test',
    'requirejs',
    'uglify',
    'mochaTest',
    'compare_size'
  ]);

  grunt.registerTask('doc', [
    'jsdoc'
  ]);

};
