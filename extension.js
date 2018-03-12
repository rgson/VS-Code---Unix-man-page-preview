const vscode = require('vscode');

function activate(context) {

	const disposable = vscode.commands.registerCommand('extension.showManPagePreview', function () {
		vscode.window.showInformationMessage('Not yet implemented');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;
