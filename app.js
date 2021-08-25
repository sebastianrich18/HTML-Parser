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
    // console.log(attributes)
    this.type = attributes.shift() // get name of tag, then remove from attr list
    if(attributes[attributes.length-1] == ">" || attributes[attributes.length-1] == "/>") attributes.pop() // remove closing > or /> if there

    this.attr = {}

    for (let word of attributes) {
        let words = word.split("=")

        let lastWordIndex = words.length-1;
        let lastWord = words[lastWordIndex]
        if(lastWord.charAt(lastWord.length-1) == ">"){ // remove closing > from last attribute
            words[lastWordIndex] = words[lastWordIndex].substring(0, lastWord.length-1)
        }

        // console.log(words)
        let key = words[0]
        if (key.charAt(0) == "'" || key.charAt(0) == '"') key = key.substring(1) // remove quotes if they are there
        if (key.charAt(key.length-1) == "'" || key.charAt(key.length-1) == '"') key = key.substring(0, key.length-1) 
        // console.log(key)

        let val = words[1]
        if(words[2]) val += '='+words[2]; // edge case where val is key val pair
        if (val.charAt(0) == "'" || val.charAt(0) == '"') val = val.substring(1) // remove quotes if they are there
        if (val.charAt(val.length-1) == "'" || val.charAt(val.length-1) == '"') val = val.substring(0, val.length-1) 
        // console.log(val)

        this.attr[key] = val
    }

    let startOfEndTagIndex = str.indexOf('</') // find first < after start tag

    if(startOfEndTagIndex != -1) this.inner = str.substring(endOfOpenTagIndex+1, startOfEndTagIndex)
}

let scriptBlock = new Block('<script src="/sites/courses/js/jquery-1.12.4.min.js">console.log("cum")</script>')
let metaBlock = new Block('<meta name="google-site-verification" content="ru2q69kfM8frBqiA_4DzYrOSI8cPkgJs826VChwZzgM" />')
let edgeCaseBlock = new Block('<meta name="viewport" content="initial-scale=1" />')

console.log(scriptBlock)
console.log(metaBlock)
console.log(edgeCaseBlock)