'use strict'
const sqlite = require('./sqlite')
const DB = sqlite.DB
const Memo = sqlite.Memo


function CommandLine() {}

CommandLine.prototype = {
  readLines: function() {
    return new Promise(resolve => {
      let lines = []
      const reader = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })
      reader.on('line', (line) => {
        lines.push(line);
      })
      reader.on('close', () => {
        resolve(lines)
      })
    })
  },
  selectCLI: function(titles, message) {
    return new Promise(resolve => {
      const { Select } = require('enquirer')
      const prompt = new Select({
        name: 'memos',
        message: message,
        choices: titles
      })
      prompt.run()
        .then(answer => {
          resolve(answer)
        })
        .catch(console.error)
    })
  }
}

function MemoCRUD(tableName) {
  this.db = new DB(tableName)
  this.db.init()
  this.db.createTable()
}

MemoCRUD.prototype = new CommandLine

MemoCRUD.prototype.create = async function() {
  const lines = await this.readLines()
  if (lines.length > 0) {
    const title = lines[0]
    const text = lines.join('\n')
    const memo = new Memo(title, text)
    await this.db.save(memo)
    console.log(`created memo: ${title}`)
  }
  return true
}

MemoCRUD.prototype.show = async function() {
  const titles = await this.db.all()
  titles.forEach(title => { console.log(title) })
  return true
}

MemoCRUD.prototype.read = async function() {
  const titles = await this.db.all()
  if (titles.length == 0) { return }
  const answer = await this.selectCLI(titles, 'Choose a memo you want to see')
  const memo = await this.db.find(answer)
  console.log(memo.text)
  return true
}

MemoCRUD.prototype.delete = async function() {
  const titles = await this.db.all()
  if (titles.length == 0) { return }
  const answer = await this.selectCLI(titles, 'Choose a memo you want to delete')
  await this.db.delete(answer)
  console.log(`deleted memo: ${answer}`)
  return true
}

module.exports = { MemoCRUD }
