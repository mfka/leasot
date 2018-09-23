"use strict";
exports.__esModule = true;
var fs = require("fs");
var leasot = require("../src/index");
var path = require("path");
var should = require("should");
var definitions_1 = require("../src/definitions");
var eol_1 = require("eol");
function getFixturePath(file) {
    return path.join('./tests/fixtures/', file);
}
function getReport(filename, reporter, parseOptions) {
    parseOptions.filename = filename;
    var content = fs.readFileSync(filename, 'utf8');
    var comments = leasot.parse(content, parseOptions);
    var report = leasot.report(comments, reporter);
    return eol_1.split(report);
}
describe('reporting', function () {
    describe('vscode', function () {
        it('typescript', function () {
            var file = getFixturePath('typescript.ts');
            var report = getReport(file, definitions_1.BuiltinReporters.vscode, { extension: '.ts' });
            should.exist(report);
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L1) | 1 | change to public',
                '',
                '### FIXMEs',
                '| Filename | line # | FIXME',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L11) | 11 | use jquery',
            ]);
        });
        it('reference-leading', function () {
            var file = getFixturePath('reference-leading.js');
            var report = getReport(file, definitions_1.BuiltinReporters.vscode, { extension: '.js' });
            should.exist(report);
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L3) | 3 | @tregusti Use Symbol instead',
            ]);
        });
        it('edge-cases', function () {
            var file = getFixturePath('edge-cases.js');
            var report = getReport(file, definitions_1.BuiltinReporters.vscode, { extension: '.js' });
            should.exist(report);
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L1) | 1 | ',
                '| [' + file + '](' + file + '#L2) | 2 | ',
                '| [' + file + '](' + file + '#L3) | 3 | text',
                '| [' + file + '](' + file + '#L4) | 4 | something / after slash',
                '| [' + file + '](' + file + '#L5) | 5 | something with a URL http://example.com/path',
            ]);
        });
    });
});
