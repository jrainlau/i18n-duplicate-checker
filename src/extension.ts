import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { isSubPath, findParentIndex, createDiagnosticWithLink } from './utils';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "i18n-duplicate-checker" is now active!');

	const diagnosticCollection = vscode.languages.createDiagnosticCollection('i18nDuplicateChecker');
	const pluginConfig = vscode.workspace.getConfiguration('i18nDuplicateChecker');

	const configI18nFolderPath: string = pluginConfig.get<string>('i18nFolderPath')!;
	const configCommonI18nPaths: string[] = pluginConfig.get<string[]>('commonI18nPaths')!;

	const i18nFolderPath = path.join(vscode.workspace.rootPath || '', configI18nFolderPath);
	const commonI18nFilePaths = configCommonI18nPaths.map(filepath => path.join(vscode.workspace.rootPath || '', filepath));

	const commonKVs: Map<string, string>[] = [];

  function loadCommonKV() {
		commonI18nFilePaths.forEach((commonI18nFilePath, index) => {
			if (!commonKVs[index]) {
				commonKVs[index] = new Map<string, string>();
			}
			if (commonI18nFilePath && fs.existsSync(commonI18nFilePath)) {
				const content = fs.readFileSync(commonI18nFilePath, 'utf-8');
				const json: { [key: string]: string } = JSON.parse(content);
				Object.entries(json).forEach(([key, value]) => commonKVs[index].set(key, value));
			}
		});
  }

	loadCommonKV();

	if (vscode.window.activeTextEditor?.document) {
		checkForDuplicateKeys(vscode.window.activeTextEditor.document);
	}

  vscode.workspace.onDidChangeTextDocument(event => {
    checkForDuplicateKeys(event.document);
  });

	vscode.workspace.onDidOpenTextDocument(document => {
		checkForDuplicateKeys(document);
	});

	function checkForDuplicateKeys(document: vscode.TextDocument) {
		if (!(document.languageId === 'json' && isSubPath(i18nFolderPath, document.uri.path) && !commonI18nFilePaths.includes(document.uri.path))) {
			return;
		}

		const i18nPathsIndex = findParentIndex(commonI18nFilePaths, document.uri.path);
		if (i18nPathsIndex === -1) { return; }

		const commonKV = commonKVs[i18nPathsIndex];
    const text = document.getText();
    const json = JSON.parse(text);
    const diagnostics: vscode.Diagnostic[] = [];

    Object.keys(json).forEach(key => {
      if (commonKV.has(key)) {
				const i18nValue = commonKV.get(key);
        const index = text.indexOf(`"${key}"`);
        const position = document.positionAt(index);
        const range = new vscode.Range(position, position.translate(0, key.length + 2));
        const diagnostic = createDiagnosticWithLink(
					range,
					key,
					configCommonI18nPaths[i18nPathsIndex],
					commonKV,
				);
				diagnostic.code = 'i18n-duplicate-checker';
				diagnostic.source = `\n\n"${key}": "${i18nValue}"\n\n`;
        diagnostics.push(diagnostic);
      }
    });

    
		diagnosticCollection.clear();
    diagnosticCollection.set(document.uri, diagnostics);
  }

	const disposable = vscode.commands.registerCommand('i18n-duplicate-checker.checkDuplicate', () => {
		vscode.window.showInformationMessage('i18n-duplicate-checker checked.');

		const editor = vscode.window.activeTextEditor;
    if (editor) {
      checkForDuplicateKeys(editor.document);
    }
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
