'use strict'
const assert = require('assert')
const chai = require('chai')
const memo = require('../src/memo')

describe("main.js", () => {
  const memoCRUD = new memo.MemoCRUD('test_main')
  it("read standard input lines and return it as list", () => {
    console.log('[readLines test]')
    console.log("input text: '入力テスト\\n'")
    return memoCRUD.readLines().then(lines => {
      assert.deepStrictEqual(lines, ['入力テスト'])
    })
  })

  it("return selected item name", () => {
    console.log('[selectCLI test]')
    const titles = ['item1', 'item2', 'item3']
    const message = 'select item name'
    return memoCRUD.selectCLI(titles, message).then(answer => {
      chai.assert.include(['item1', 'item2', 'item3'], answer)
    })
  })

  it("input text, create a memo object and insert into db", () => {
    console.log('[create test]')
    console.log("input text")
    return memoCRUD.create().then((res) => {
      assert.ok(res)
    })
  })

  it("show all memo's title", () => {
    console.log('[show test]')
    return memoCRUD.show().then(res => {
      assert.ok(res)
    })
  })

  it("select a memo and show it's text", () => {
    console.log('[read test]')
    return memoCRUD.read().then(res => {
      assert.ok(res)
    })
  })

  it("select a memo and delete it from db", () => {
    console.log('[delete test]')
    return memoCRUD.delete().then(res => {
      assert.ok(res)
    })
  })
})
