const request = require('request');

function getHTML(url) {
    request(url, function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
}

function Block(str) {
    let endOfOpenTagIndex = str.indexOf(">")
    startTag = str.substr(1, endOfOpenTagIndex) // get the start tag (in between opening < >)
    let attributes = startTag.split(" ")
    attributes.pop() // remove closing > or />
    this.type = attributes.shift() // get name of tag, then remove from attr list
    this.attr = {}
    for (let word of attributes) {
        let words = word.split("=")
        let key = words[0]
        let val = words[1]
        if(words[2]) val += '='+words[2]; // edge case where val is key val pair
        this.attr[key] = val
    }
    this.inner = str.substring(endOfOpenTagIndex + 1).substring(0, str.length - (((this.type.length + 2) * 2)) - 1);
}

let block2 = new Block('<meta name="robots" content="index,follow">')
console.log(block2, '\n')

let block1 = new Block("<meta http-equiv='X-UA-Compatible' content='IE=edge' />")
console.log(block1)