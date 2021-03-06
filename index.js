#!/usr/bin/env node
const runGulpTask = require('run-gulp-task')
const gutil = require('gulp-util')
const tasks = require('./tasks')


const commander = require('commander')
commander
    .description('egret deploy tools')
    .version(require('./package').version)
    .option('-s, --src [value]', 'source path')
    .option('-d, --dest [value]', 'dist path')
    .option('-k, --key [value]', 'tinypng key')
commander.parse(process.argv)

const wrapFun = function (func, opt) {
    return new Promise(function (resolve, reject) {
        opt.callback = function () {
            resolve()
        }
        func(opt)
    })
}


const { src, dest, key } = commander
if (!src || !dest || !key) {
    console.log('-s, --src: %s', 'source path')
    console.log('-d, --dest: %s', 'dist path')
    console.log('-k, --key: %s', 'tinypng key')
    console.log('--help: %s', 'help')
} else {
    const opt = { src, dest, key }
    gutil.log('Starting', gutil.colors.magenta('copy...'))
    wrapFun(tasks.copy, opt)
        .then(function () {
            gutil.log('Starting', gutil.colors.magenta('tinypng...'))
            return wrapFun(tasks.tinypng, opt)
        })
        .then(function () {
            gutil.log('Starting', gutil.colors.magenta('reshash...'))
            return wrapFun(tasks.reshash, opt)
        })
        .then(function () {
            gutil.log('Starting', gutil.colors.magenta('version...'))
            return wrapFun(tasks.version, opt)
        })
        .then(function () {
            gutil.log(gutil.colors.green('Done'))
        })
}



