/*
 * Copyright 2020 Peter Stacey
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without 
 * restriction, including without limitation the rights to use, copy, 
 * modify, merge, publish, distribute, sublicense, and/or sell copies 
 * of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 */

import * as vscode from 'vscode';
import { languageTable } from './languages';

enum Types {
    File = "FILE",
    Function = "FUNCTION",
    Struct = "STRUCT",
}

var studentID: string;
var languageId: string;
var studentName: string;
var subjectName: string;
var subjectCode: string;
var exerciseName: string;

/**
 * Called when the extension is first activated.
 * 
 * @param context the context for the extention
 */
function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand(
        'extension.SIT102.insertFileComment', generateFileComment)
    );

    context.subscriptions.push(vscode.commands.registerCommand(
        'extension.SIT102.insertFunctionComment', generateFunctionComment)
    );

    context.subscriptions.push(vscode.commands.registerCommand(
        'extension.SIT102.insertStructComment', generateStructComment)
    );
}

exports.activate = activate;

/**
 * Called when the extension is deactivated.
 */
function deactivate() { }

exports.deactivate = deactivate;

/**
 * Shows an error message in a notification window.
 * 
 * @param msg the message to display in the window
 */
function showErrorInformation(msg: string) {
    vscode.window.showInformationMessage(`Comment Error: ${msg}`);
    return;
}

/**
 * Loads the current workspace configuration variables.
 */
function loadCurrentConfiguration() {
    let student = vscode.workspace.getConfiguration('student');
    let subject = vscode.workspace.getConfiguration('subject');
    studentID = String(student.get('id'));
    studentName = String(student.get('name'));
    subjectCode = String(subject.get('code'));
    subjectName = String(subject.get('name'));
}

/**
 * Sets the exercise name to the current working director name and
 * sets the languageId based on the language being used in the editor,
 * based off the file extension.
 */
function getCurrentExercise() {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        // assumes present working directory is exercise name
        exerciseName = String(vscode.workspace.name);
        languageId = String(editor.document.languageId);
    }
}

/**
 * Returns the current line that the cursor is on.
 */
function getCurrentLine(): number {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        return editor.selection.active.line;
    }
    return 0;  // unreachable as we know the editor is true
}

function getFunctionSignature(): string {
    let signature = '';
    let line = getCurrentLine();
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        signature = editor.document.lineAt(line).text;
    }
    return signature;
}

/**
 * Control function to load the required information for the extension
 * commands to work effectively. 
 */
function setEnvironmentVariables() {
    loadCurrentConfiguration();
    getCurrentExercise();
}

/**
 * Generates a file level docstring or comment.
 */
function generateFileComment() {
    insertComment(Types.File);
}

/**
 * Generates a function or procedure comment.
 */
function generateFunctionComment() {
    insertComment(Types.Function);
}

/**
 * Generates an enum or struct comment.
 */
function generateStructComment() {
    insertComment(Types.Struct);
}

/**
 * Returns an array of the parameter names for the procedure or function.
 * 
 * @param signature the function declaration signature
 */
function getParams(signature: string): string[] {
    var paramNames = new Array();
    let idxOpen = signature.indexOf('(');
    let idxClose = signature.indexOf(')');
    if (idxOpen <= 0 || idxClose <= 0) {
        return paramNames;
    }
    if (idxClose - idxOpen === 1) {
        return paramNames;
    }
    let params = signature.substring(idxOpen + 1, idxClose);
    let paramsList = params.split(',');
    paramsList.forEach((element) => {
        let elements = element.trim().split(' ');
        if (elements.length > 1) {
            paramNames.push(elements[elements.length - 1]);
        }
    });
    return paramNames;
}

/**
 * Inserts the relevant comment type into the document.
 * 
 * @param type type of comment to insert (file, function, struct)
 */
function insertComment(type: string) {
    setEnvironmentVariables();
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        try {
            let chars = languageTable(languageId);
            if (chars === null) {
                let msg = `${languageId} files not currently supported.`;
                showErrorInformation(msg);
                return;
            }
            var comment = "";
            var line = 0;
            switch (type) {
                case Types.File:
                    comment = fileCommentFormat(chars);
                    break;
                case Types.Function:
                    let signature = getFunctionSignature();
                    let parameters = getParams(signature);
                    let procedure = signature.startsWith("void");
                    comment = functionCommentFormat(chars, parameters, procedure);
                    line = getCurrentLine();
                    break;
                case Types.Struct:
                    comment = structCommentFormat(chars);
                    line = getCurrentLine();
                    break;
            }
            editor.edit(editBuilder => {
                editBuilder.insert(new vscode.Position(line, 0), comment);
            });
        } catch (err) {
            vscode.window.showInformationMessage(
                `Comment Error: "${err.message}"`);
        }
    } else {
        let msg = "no file open to add comment to.";
        showErrorInformation(msg);
        return;
    }
}

/**
 * Returns a comment ore docstring formatted correctly for a file.
 * 
 * @param language object containing the language specific characters
 */
function fileCommentFormat(language: any) {
    let comment = `${language.chars.start}${language.first_line_end}` +
        `${language.chars.middle} ${subjectCode} - ${subjectName}\n` +
        `${language.chars.middle}\n` +
        `${language.chars.middle} Exercise:       ${exerciseName}\n` +
        `${language.chars.middle} Student Name:   ${studentName}\n` +
        `${language.chars.middle} Student ID:     ${studentID}\n` +
        `${language.chars.end}\n\n`;
    if (languageId === 'python') {
        return comment.replace(' ', '');
    }
    return comment;
}

/**
 * Returns a comment formatted correctly for a function or procedure.
 * 
 * @param language object containing the language specific characters
 */
function functionCommentFormat(language: any, params: string[], procedure: boolean) {
    let comment = `${language.chars.start}${language.first_line_end}` +
        `${language.chars.middle} [Summary of the Procedure or Function]\n`;
    if (params.length > 0) {
        comment += `${language.chars.middle}\n`;
        params.forEach((param) => {
            comment += `${language.chars.middle} @param ${param} \n`;
        });
    } else if (!procedure) {
        comment += `${language.chars.middle} \n`;
    }
    if (!procedure) {
        comment += `${language.chars.middle} @returns \n`;
    }
    comment += `${language.chars.end}\n`;

    if (languageId === 'python') {
        return comment.replace(' ', '');
    }
    return comment;
}
/**
 * Returns a comment formatted correctly for a function or procedure.
 * 
 * @param language object containing the language specific characters
 */
function structCommentFormat(language: any) {
    let comment = `${language.chars.start}${language.first_line_end}` +
        `${language.chars.middle} [Description of the Enum or Struct]\n` +
        `${language.chars.end}\n`;
    if (languageId === 'python') {
        return comment.replace(' ', '');
    }
    return comment;
}