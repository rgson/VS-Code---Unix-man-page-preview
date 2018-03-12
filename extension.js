const child_process = require('child_process');
const stream = require('stream');
const vscode = require('vscode');

exports.activate = context => {

	let previewUri = vscode.Uri.parse('man-preview://authority/man-preview');

	class TextDocumentContentProvider {

		constructor() {
			this._onDidChange = new vscode.EventEmitter();
		}

		provideTextDocumentContent(uri) {
			let editor = vscode.window.activeTextEditor;
			let text = editor.document.getText();

			return new Promise((resolve, reject) => {
				let p = child_process.execFile('man', ['-P', 'cat', '-l', '-'], (error, stdout, stderr) => {
					if (error) {
						reject(error);
					} else {
						resolve('<html><body><pre>' + stdout + '</pre></body></html>');
					}
				});

				let s = new stream.Readable();
				s.push(text);
				s.push(null);
				s.pipe(p.stdin);
			});
		}

		get onDidChange() {
			return this._onDidChange.event;
		}

		update(uri) {
			this._onDidChange.fire(uri);
		}
	}

	let provider = new TextDocumentContentProvider();
	let registration = vscode.workspace.registerTextDocumentContentProvider('man-preview', provider);

	vscode.workspace.onDidChangeTextDocument(e => {
		if (e.document === vscode.window.activeTextEditor.document) {
			provider.update(previewUri);
		}
	});

	let disposable = vscode.commands.registerCommand('extension.showManPagePreview', () => {
		return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'Unix man page Preview')
			.then(null, vscode.window.showErrorMessage);
	});

	context.subscriptions.push(disposable, registration);
}
