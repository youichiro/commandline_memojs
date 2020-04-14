'use strict'
const memo = require('./memo')

async function main() {
  const memoCRUD = new memo.MemoCRUD('memos')
  const argv = require('minimist')(process.argv.slice(2))
  if (Object.keys(argv).length > 2) {
    throw "Expected only one argument. '-h', '-n', '-l', '-r' or '-d'"
  }
  if (Object.keys(argv).length < 2) {
    memoCRUD.create()
    return
  }
  else if ('h' in argv) {
    console.log("usage:\n  -n, メモの新規作成\n  -l, メモの一覧\n  -r, メモの閲覧\n  -d, メモの削除")
  } else if ('n' in argv) {
    memoCRUD.create()  // 作成
  } else if ('l' in argv) {
    memoCRUD.show()  // 一覧
  } else if ('r' in argv) {
    memoCRUD.read()  // 参照
  } else if ('d' in argv) {
    memoCRUD.delete()  // 削除
  } else {
    console.log("usage:\n  -n, メモの新規作成\n  -l, メモの一覧\n  -r, メモの閲覧\n  -d, メモの削除")
  }
}

main()