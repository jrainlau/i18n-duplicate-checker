import * as vscode from 'vscode';
import * as path from 'path';

export function isSubPath(parentPath: string, childPath: string) {
	const normalizedParentPath = path.resolve(parentPath);
	const normalizedChildPath = path.resolve(childPath);
	
	const relativePath = path.relative(normalizedParentPath, normalizedChildPath);
	
	const result = !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
	
	return result;
}

export function findParentIndex(paths: string[], targetPath: string) {
  const targetDir = path.dirname(targetPath);

  for (let i = 0; i < paths.length; i++) {
    const currentDir = path.dirname(paths[i]);
    if (targetDir.startsWith(currentDir)) {
      return i;
    }
  }

  return -1;
}

export function createDiagnosticWithLink(range: vscode.Range, key: string, filePath: string, commonKV: Map<string, string>) {
	const message = `Key "${key}" is already defined in ${filePath}`;
	const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);

	const linkPath = path.join(vscode.workspace.rootPath || '', filePath);
	console.log(getKeyIndex(commonKV, key));
	diagnostic.relatedInformation = [
		new vscode.DiagnosticRelatedInformation(
			new vscode.Location(vscode.Uri.file(linkPath), new vscode.Position(getKeyIndex(commonKV, key) + 1, 0)),
			''
		)
	];

	return diagnostic;
}

export function getKeyIndex(map: Map<string, string>, key: string) {
  let index = 0;
  for (let k of map.keys()) {
    if (k === key) {
      return index;
    }
    index++;
  }
  return -1;
}