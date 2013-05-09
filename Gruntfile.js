module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: '.'
                }
            }
        },
        less: {
            development: {
                files: {
                    'css/pagelist.min.css': 'less/pagelist.less'
                },
                options: {
                    yuicompress: true
                }
            }
        },
        watch: {
            less: {
                files: ['**/*.less'],
                tasks: ['compile-less'],
                options: {
                    nospawn: true
                }
            },
            js: {
                files: ['**/pagelist.js'],
                tasks: ['compile-js'],
                options: {
                    nospawn: true
                }
            }
        },
        shell: {
            requireBuild: {
                command: 'r.js -o js/build.js',
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    execOptions: {
                        encoding: 'utf8',
                        timeout: 0,
                        maxBuffer: 500*1024,
                        killSignal: 'SIGTERM',
                        cwd: null,
                        env: null
                    }
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-shell');

    // Tasks
    grunt.registerTask('compile-less', ['less:development']);
    grunt.registerTask('compile-js', ['shell:requireBuild']);
    grunt.registerTask('serve', ['connect', 'watch']);

    // Custom Tasks

    // Build task
    grunt.registerTask('build', 'Build documentation assets', function() {
        grunt.task.run([
            'compile-less',
            'compile-js'
        ]);
    });

    // Default task(s).
    grunt.registerTask('default', ['serve']);

};
