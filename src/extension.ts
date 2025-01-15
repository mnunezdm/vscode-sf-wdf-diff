import * as vscode from 'vscode'
import { DiffProvider } from './diffProvider'

function compareFiles(title: string, previous: vscode.Uri, actual: vscode.Uri) {
  vscode.commands.executeCommand('vscode.diff', previous, actual, title)
}

const getName = (activeTextEditor: vscode.TextEditor) => {
  const wdfName = activeTextEditor.document.fileName
    ?.split('/')
    ?.at(-1)
    ?.split('.')[0]

  if (!wdfName) {
    throw new Error('No active text editor found')
  }

  return wdfName
}

const getActiveTextEditor = () => {
  const activeTextEditor = vscode.window.activeTextEditor

  if (!activeTextEditor) {
    throw new Error('No active text editor found')
  }

  return activeTextEditor
}

export function activate(context: vscode.ExtensionContext) {
  const diffProvider = new DiffProvider()
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider('wdf', diffProvider),
  )

  // diffComplete
  context.subscriptions.push(
    vscode.commands.registerCommand('sf-wdf-diff.diffComplete', async () => {
      const activeTextEditor = getActiveTextEditor()

      const dtfName = getName(activeTextEditor)

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

      compareFiles(
        `${dtfName} - ${previous} <-> ${actual}`,
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: previous,
        }),
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: actual,
        }),
      )
    }),
  )
  // diffActual
  context.subscriptions.push(
    vscode.commands.registerCommand('sf-wdf-diff.diffActual', async () => {
      const activeTextEditor = getActiveTextEditor()

      const dtfName = getName(activeTextEditor)
      const actual = 'current'
      const previous = 'HEAD'

      compareFiles(
        `${dtfName} - ${previous} <-> ${actual}`,
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: previous,
        }),
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: actual,
        }),
      )
    }),
  )
  // diffPrevious
  context.subscriptions.push(
    vscode.commands.registerCommand('sf-wdf-diff.diffPrevious', async () => {
      const activeTextEditor = getActiveTextEditor()

      const dtfName = getName(activeTextEditor)
      const actual = 'current'
      const previous = 'HEAD~1'

      compareFiles(
        `${dtfName} - ${previous} <-> ${actual}`,
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: previous,
        }),
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: actual,
        }),
      )
    }),
  )
  // diffCurrent
  context.subscriptions.push(
    vscode.commands.registerCommand('sf-wdf-diff.diffCurrent', async () => {
      const activeTextEditor = getActiveTextEditor()
      const dtfName = getName(activeTextEditor)
      const actual = 'current'

      const previous = await vscode.window.showInputBox({
        title: `Fichero con el contenido anterior: deja current para coger la version actual o especifica una referencia de git`,
        value: 'HEAD',
      })

      if (!previous) {
        return
      }

      compareFiles(
        `${dtfName} - ${previous} <-> ${actual}`,
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: previous,
        }),
        activeTextEditor.document.uri.with({
          scheme: 'wdf',
          query: actual,
        }),
      )
    }),
  )
}

// This method is called when your extension is deactivated
export function deactivate() {}
