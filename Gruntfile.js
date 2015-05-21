module.exports = function(grunt){
    // Load all tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        html2js: {
            app: {
                options:{
                    base: 'src/app',
                    process: true
                },
                src: 'src/app/**/*.tpl.html',
                dest: 'dist/databases-templates.js',
                module: 'databases.templates'
            }
        },
        concat: {
            dist: {
                src: ['src/app/**/*.js'],
                dest: 'dist/databases.js'
            },
            index: {
                src: 'src/index.html',
                dest: 'dist/index.html',
                options: {
                    process: true
                }
            }
        },
        less: {
            dev: {
                files: {
                    'dist/databases.css': ['src/**/*.less']
                },
                options: {
                    compress: false,
                    // LESS source map
                    // To enable, set sourceMap to true and update sourceMapRootpath based on your install
                    sourceMap: true,
                    sourceMapFilename: 'dist/<%= pkg.name %>.css.map'
                }
            },
            build: {
                files: {
                    'dist/databases.min.css': ['src/**/*.less']
                },
                options: {
                    compress: true
                }
            }
        },
      bump: {
        options: {
          files: ['package.json', 'bower.json'],
          updateConfigs: ['pkg'],
          commit: false,
          commitMessage: 'Release v%VERSION%',
          commitFiles: ['package.json', 'bower.json'],
          createTag: true,
          tagName: 'v%VERSION%',
          tagMessage: 'Version %VERSION%',
          push: false,
          pushTo: 'origin',
          gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
          globalReplace: false,
          prereleaseName: false,
          regExp: false
        }
      }
    });


    grunt.registerTask('default', ['html2js', 'concat', 'less:dev']);
};