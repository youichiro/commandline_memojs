'use strict'
const sqlite3 = require('sqlite3')
const fs = require('fs')


function DB(tableName) {
  this.tableName = tableName || 'memos'
  this.saveDir = process.env.HOME + '/.npm/'
  this.fname = 'memomemo.sqlite3'
}

DB.prototype = {
  init: function() {
    if (!fs.existsSync(this.saveDir)) {
      fs.mkdirSync(this.saveDir)
    }
    this.db = new sqlite3.Database(this.saveDir + this.fname)
    return true
  },
  createTable: async function() {
    return new Promise((resolve, reject) => {
      try {
        this.db.serialize(() => {
          this.db.run(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
            title TEXT PRIMARY KEY NOT NULL, text TEXT)`
            )
        })
        return resolve(true)
      } catch (err) {
        return reject(err)
      }
    })
  },
  save: async function(memo) {
    return new Promise((resolve, reject) => {
      try {
        this.db.run(
          `INSERT OR REPLACE INTO ${this.tableName}
          (title, text) values ($title, $text)`,
          memo.title, memo.text
        )
        return resolve(true)
      } catch (err) {
        return reject(err)
      }
    })
  },
  all: async function() {
    const result = []
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all(`SELECT title, text FROM ${this.tableName}`,
        (err, rows) => {
          if (err) return reject(err)
          rows.forEach(row => { result.push(row.title) })
          return resolve(result)
        })
      })
    })
  },
  find: async function(title) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT title, text FROM ${this.tableName} WHERE title = ?`,
        [title],
        (err, row) => {
          if (err) return reject(err)
          return resolve(new Memo(row.title, row.text))
      })
    })
  },
  delete: async function(title) {
    return new Promise((resolve, reject) => {
      try {
        this.db.run(`DELETE FROM ${this.tableName} WHERE title = $title`, title)
        return resolve(true)
      } catch (err) {
        return reject(err)
      }
    })
  },
  deleteAll: async function() {
    return new Promise((resolve, reject) => {
      try {
        this.db.run(`DELETE FROM ${this.tableName}`)
        return resolve(true)
      } catch (err) {
        return reject(err)
      }
    })
  }
}

function Memo(title, text) {
  this.title = title
  this.text = text
}

module.exports = { DB, Memo }
