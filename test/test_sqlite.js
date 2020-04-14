'use strict'
const assert = require('assert')
const sqlite = require('../src/sqlite')
const Memo = sqlite.Memo

describe("sqlite.js", function() {
  const db = new sqlite.DB('test_sqlite')
  const memo1 = new Memo('test1', 'My name is John.')
  const memo2 = new Memo('test2', 'My name is Pen.')
  
  it('init db', function() {
    assert.ok(db.init())
  })

  it('create table', async function() {
    const res = await db.createTable()
    assert.ok(res)
  })

  it('delete all memos from db', async function() {
    const res = await db.deleteAll()
    assert.ok(res)
  })

  it('insert memo1 into db', async function() {
    const res = await db.save(memo1)
    assert.ok(res)
  })

  it('insert memo2 into db', async function() {
    const res = await db.save(memo2)
    assert.ok(res)
  })

  it('return all titles from db', async function() {
    const res = await db.all()
    assert.deepStrictEqual(res, [ 'test1', 'test2' ])
  })

  it('find and return memo1 from db', async function() {
    const res = await db.find(memo1.title)
    assert.deepStrictEqual(res, memo1)
  })

  it('find and return memo2 from db', async function() {
    const res = await db.find(memo2.title)
    assert.deepStrictEqual(res, memo2)
  })

  it('delete memo1 from db', async function() {
    const res = await db.delete(memo1.title)
    assert.ok(res)
  })

  it('delete memo2 from db', async function() {
    const res = await db.delete(memo2.title)
    assert.ok(res)
  })

  it('find and return all titles from db', async function() {
    const res = await db.all()
    assert.deepStrictEqual(res, [])
  })
})
