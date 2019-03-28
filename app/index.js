const Generator = require('yeoman-generator');
const path = require('path');
const glob = require('glob');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }
    willCreateDir() {
        return this.prompt([{
            type: 'confirm',
            name: 'willCreateDir',
            message: 'Create a new folder?'
        }]).then(response => {
            this.options.willCreateDir = response.willCreateDir;
        });
    }
    dirName() {
        let parentDir = './modules/'
        let z = this;
        return z.prompt([{
                type: 'input',
                name: 'dirName',
                message: 'Input the dir name:'
            },

        ]).then(res => {
            z.options.dirName = res.dirName;
        })
    }
    parentDir() {
        let z = this
        return z.prompt([{
            type: 'confirm',
            name: 'underModule',
            message: `Would you like to put the module under './modules/'?`
        }]).then(res => {
            if (res.underModule) {
                z.options.parentDir = parentDir;

            } else {
                z.options.parentDir = false;
            }
        });
    }
    setParentDir() {
        let z = this;
        if(z.options.parentDir) return;
        return z.prompt([{
            type: 'list',
            name: 'parentDir',
            message: `Select the parent folder name(s):`,
            choices: [
                './',
                './src/modules',
                '../modules/'
            ]
        }]).then(res => {
            z.options.parentDir = res.parentDir;
            // z.log(z.options, '\n');
        })
    }
    writing() {
        let z = this;
        if (z.options.willCreateDir) {
            z.destinationRoot(path.resolve(z.options.parentDir, z.options.dirName));
            z.appname = z.options.dirName;
        }
        glob.sync('**', {
            cwd: z.sourceRoot()
        }).forEach((file) => {
            z.fs.copy(z.templatePath(file), z.destinationPath(file), z);
        });
    }
};