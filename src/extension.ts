import * as vscode from 'vscode';
//import * as languageSettings from './languages';

const C_STYLE = ['c', 'cpp', 'csharp', 'go', 'java', 'javascript'];

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.sit102b', () => {

        let student = vscode.workspace.getConfiguration('student');
        let name = student.get('name');
        let id = student.get('id');

        let editor = vscode.window.activeTextEditor;

        var BLOCK_COMMENT_START;
        var BLOCK_COMMENT_MIDDLE;
        var BLOCK_COMMENT_END;

        if (editor) {

            let language = editor.document.languageId;

            if (C_STYLE.indexOf(language) > -1) {
                BLOCK_COMMENT_START = '/**';
                BLOCK_COMMENT_MIDDLE = ' *';
                BLOCK_COMMENT_END = ' */';
            } else if (language === 'python') {
                BLOCK_COMMENT_START = '"""';
                BLOCK_COMMENT_MIDDLE = '';
                BLOCK_COMMENT_END = '"""';
            } else {
                console.log("Language not supported. No action taken");
                return;
            }

            let text =
                `${BLOCK_COMMENT_START}  \n` +
                `${BLOCK_COMMENT_MIDDLE} SIT102 - Introduction to Programming\n` +
                `${BLOCK_COMMENT_MIDDLE} \n` +
                `${BLOCK_COMMENT_MIDDLE} Student:       ` + name + `\n` +
                `${BLOCK_COMMENT_MIDDLE} StudentID:     ` + id + `\n` +
                `${BLOCK_COMMENT_END}    \n\n`;

            editor.edit(editBuilder => {
                editBuilder.insert(new vscode.Position(0, 0), text);
            });
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
