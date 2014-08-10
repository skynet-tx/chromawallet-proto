module.exports = function(grunt) {
    grunt.initConfig({
        srcPath: '.',
        buildPath: 'build',
        react: {
            jsx: {
                files: [{
                    expand: true,
                    cwd: 'jsx',
                    src: [ '**/*.js' ],
                    dest: 'build/',
                    ext: '.js'
                }]
            }
        },        
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '.'
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'css',
                    environment: 'production'

                    // raw: "\
                    //     require 'modular-scale'\n\
                    //     project_path = '.'\n\
                    //     preferred_syntax = :scss\n\
                    //     css_dir = './css'\n\
                    //     sass_dir = './sass'\n\
                    //     images_dir = './images'\n\
                    //     relative_assets = true\n\
                    //     line_comments = false\n\
                    // "
                }
            }
        },
        cacheBust: {
          options: {
            algorithm: 'sha1',
            length: 32
            //dir: '.'
          },
          assets: {
              files: [{
                          expand: true,
                          //cwd: 'src',
                          src: ['demo.html', 'demo_eng.html']
                          //          dest: 'dest/'
                      }]
          }
        },

        copy: {
            demo_eng: {
                src: 'demo.html',
                dest: 'demo_eng.html',
                options: {
                    process: function (content, srcpath) {
                        content = content.replace("build/models", "build/cc-eng-model");
                        content = content.replace("<!-- load engines here -->",
                                                  '<script src="cc-wallet-engine.js"></script>');
                        return content;
                    }
                }
            },
            cc_wallet_eng: {
                src: "node_modules/cc-wallet-engine/cc-wallet-engine.js",
                dest: "cc-wallet-engine.js"
            }
        },
        subgrunt: {
            cc_wallet_eng: {
                projects: {
                    "node_modules/cc-wallet-engine": "compile"
                }
            }
        },
        watch: {
          scripts: {
            files: ['jsx/*.js', '!jsx/*_*.js', '!jsx/\.#*'],
            //Second is to exclude flymake files, third auto-save emacs files
            tasks: ['build'],
            options: {
              spawn: false
            }
          },
          sass: {
            files: ['sass/*.scss','sass/var/*.scss'],
            tasks: ['compass'],
            options: {
              spawn: false
            }
          }
        }
    });
    
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-subgrunt');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cache-bust');

    
    grunt.registerTask('build-eng', [
                         'subgrunt:cc_wallet_eng',
                         'copy:cc_wallet_eng'
                       ]);

    grunt.registerTask('build', [
                           'react',
                           'copy:demo_eng',
                           'cacheBust'
                       ]);

    grunt.registerTask('default', [
                           'build',
                           'connect',
                           'watch'
                       ]);

};
