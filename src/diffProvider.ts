import vscode from 'vscode'

function getFileUri(originalUri: vscode.Uri): vscode.Uri {
  const reference = originalUri.query

  if (reference === 'current') {
    return originalUri.with({ scheme: 'file', query: '' })
  } else {
    return originalUri.with({
      scheme: 'git',
      query: JSON.stringify({
        path: originalUri.path,
        ref: reference,
      }),
    })
  }
}

export class DiffProvider implements vscode.TextDocumentContentProvider {
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>()
  onDidChange: vscode.Event<vscode.Uri> = this._onDidChange.event

  async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
    try {
      const fileUri = getFileUri(uri)

      const document = await vscode.workspace.openTextDocument(fileUri)
      const jsonArrayString = document.getText()

      const jsonObject = this.parseJsonArray(jsonArrayString)
      return JSON.stringify(jsonObject, null, 2)
    } catch (error) {
      return 'Error: ' + error
    }
  }

  private parseJsonArray(jsonArrayString: string): object {
    const dataflowMetadata: string[] = JSON.parse(jsonArrayString)
    const nonNullNode = dataflowMetadata.filter(
      (data) => Boolean(data) && data !== '{}',
    )[0]
    return JSON.parse(nonNullNode)
  }
}
