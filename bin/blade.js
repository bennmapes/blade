#!/usr/bin/env node

var   util = require('util')
	, exec = require('child_process').exec
	, tilde = require('tilde-expansion')
	, match_types = ['phonegap', 'cordova', 'jquery', 'ember', 'sencha', 'backbone', 'jqtouch', 'kendo', 'bootstrap', 'modernizr', 'normalize', 'zepto']
	, matches = {}
	, apps = []
    , running = 0
    , limit = 10
    , apps_path


exec('rm -rf ./temp', function() {
	exec('mkdir ./temp')
	tilde( '~/Music/iTunes/iTunes Media/Mobile Applications/', function(path){
		apps_path = path

		exec('find "'+path+'" -name "*.ipa"', function(error, stdout, stderr) {
			apps = stdout.split('\n')

	        launcher()

		})
	})
	
})

function launcher() {
    while (running < limit && apps.length > 0) {
        var app = apps.shift()
        util.puts(' ++ ' + app.replace(apps_path, ''))
        inspect(app)
        running++
    }
}

function inspect(app) {
	var   root = apps_path
		, app = app.replace(root, '')
		, folder = './temp/'+app.replace('./','')
	//util.puts('  # inspecting ' + app)
    exec('unzip "'+root+app+'" -d "'+folder+'"', function(error, stdout, stderr) {
	    match_types.forEach(function(match_type) {
			exec('find "'+folder+'" | grep -i "'+match_type+'"', function(error, stdout, stderr) {
				console.log(stdout)
				if (stdout != '' && app != '') {
					if (matches[app] == null) {
						matches[app] = {}
						for (var i=0; i<match_types.length; i++) {
							matches[app][match_types[i]] = 0
						}
					}
					matches[app][match_type]++
				}
                running--
                util.puts(' -- ' + app)
    			launcher()
                if (running == 0) done()
			})
		})
	})
}

function done() {
	util.puts(JSON.stringify(matches))
}
