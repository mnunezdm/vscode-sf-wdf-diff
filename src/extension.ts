import * as vscode from 'vscode'
import { DiffProvider } from './diffProvider'

export function activate(context: vscode.ExtensionContext) {
  const diffProvider = new DiffProvider()
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider('wdf', diffProvider),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('sf-wdf-diff.gitDiffComplete', async () => {
      const activeTextEditor = vscode.window.activeTextEditor

      if (!activeTextEditor) {
        throw new Error('No active text editor found')
      }

      const dtfName = activeTextEditor.document.fileName
        ?.split('/')
        ?.at(-1)
        ?.split('.')[0]

      const workspaceFolder = vscode.workspace.getWorkspaceFolder(
        activeTextEditor?.document.uri,
      )

      if (!workspaceFolder) {
        throw new Error('No workspace folder found')
      }

      const actual = await vscode.window.showInputBox({
        title: `Fichero con el contenido actual: deja current para coger la version actual o especifica una referencia de git`,
        value: 'current',
      })

      if (!actual) {
        return
      }

      const previous = await vscode.window.showInputBox({
        title: `Fichero con el contenido anterior: deja current para coger la version actual o especifica una referencia de git`,
        value: 'HEAD~1',
      })

      if (!previous) {
        return
      }

      vscode.commands.executeCommand(
        'vscode.diff',
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: previous,
        }),
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: actual,
        }),
        `${dtfName} - ${previous} <-> ${actual}`,
      )
    }),
  )
}

// This method is called when your extension is deactivated
export function deactivate() {}
