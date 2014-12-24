module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			build: ['src/**/*.js']
		},

		clean: {
			dependencies: ['lib/'],
			css: ['test/js/css']
		},
		connect: {
			test: {
				options: {
					port: 3000,
					hostname: '0.0.0.0',
					base: '.'
				}
			}
		},
		karma: {
			options: {
				browsers: ['Chrome']
			},
			ui_dev: {
				configFile: 'karma.ui.conf.js',
				autoWatch: true
			},
			ui: {
				configFile: 'karma.ui.conf.js',
				singleRun: true
			},
			
			unit_dev: {
				configFile: 'karma.unit.conf.js',
				autoWatch: true
			},
			unit: {
				configFile: 'karma.unit.conf.js',
				singleRun: true
			}
		},
		shell: {
			bower_install: {
				command: 'node node_modules/bower/bin/bower install'
			}
		},
		stylus: {
			compile: {
				files: {
					'test/js/css/test.css': 'test/js/styl/test.styl'
				}
			}
		},
		watch: {
			stylus: {
				files: ['src/styl/scrollable.styl', 'test/js/styl/test.styl'],
				tasks: ['stylus:compile']
			}
		},
		jscs: {
			options: {
				config: '.jscsrc'
			},
			files: ['src/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jscs-checker');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-interactive-shell');

	grunt.registerTask('build', ['clean:css', 'stylus:compile']);
	grunt.registerTask('install', ['clean:dependencies', 'shell:bower_install']);
	grunt.registerTask('check_style', ['jscs', 'jshint']);
	grunt.registerTask('test', ['build', 'jshint:build', 'check_style', 'karma:unit', 'connect:test', 'karma:ui']);
	grunt.registerTask('test_unit', ['karma:unit_dev']);
	grunt.registerTask('test_ui', ['connect:test', 'karma:ui_dev']);
	grunt.registerTask('default', ['build', 'watch']);
};