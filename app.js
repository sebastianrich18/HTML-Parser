const request = require('request');
const selfClosingTags = ['area', 'base', 'br', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

function getHTML(url) {
    request(url, function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
}

/*

    * Find end of start tag
            * first >
    * check if there is a space within the substr
    IF there is a space
        * str.substr(1, indexOfSpace) to get tag
    ELSE
        * str.substr(1, indexOf >) to get tag

    * set this.type to tag name

    * check if tag type has closing tag
        * make list of all tags that have closing tag
    IF HAS CLOSING TAG
        let count = 0
        get name of first tag
        find first index of that name
        IF char before index is /
            that is closing tag
            there is no other tags in inner 
        ELSE
            count + 1
            closeIndex = -1
            While (count != 0)
                If there is another occurence of a open tag
                    count + 1
                If there is an occorence of a close tag
                    count -1
                If count == 0
                    that is the close tag
                    closeIndex = thisIndex
    * parse attributes into this.attr as obj
*/

// Find Difference Between Two String
function findDiff(str1, str2){ 
    let diff= "";
    str2.split('').forEach(function(val, i){
      if (val != str1.charAt(i))
        diff += val ;         
    });
    return diff;
  }

function Block(rawStr) {
    let endOfStartTagIndex = rawStr.indexOf('>')
    let spaceIndex = rawStr.indexOf(' ')
    if (spaceIndex != -1) {
        this.type = rawStr.substring(1, spaceIndex)
    } else {
        this.type = rawStr.substring(1, endOfStartTagIndex)
    }
    // get args here

    let str = rawStr.substring(endOfStartTagIndex + 1) // remove start tag from str

    if (!selfClosingTags.includes(this.type)) {
        // console.log('not self closing')
        let count = 0 // counts number of open tags
        let closeTagIndex = str.indexOf(this.type)
        // console.log(str, closeTagIndex)
        if (str.charAt(closeTagIndex - 1) != '' && str.charAt(closeTagIndex - 1) != '/') { // if tag isnt close tag
            console.log('there is another tag in inner')
            str = str.substr(closeTagIndex + this.type.length) // remove first occurance of tag
            do {
                closeTagIndex = str.indexOf(this.type)
                console.log(closeTagIndex, count)
                
                if (str.charAt(closeTagIndex - 1) != "/") {
                    console.log('anotha one', str)
                    str = str.substr(closeTagIndex+ this.type.length)
                    count++
                } else {
                    console.log('close', str)
                    str = str.substr(closeTagIndex+ this.type.length)
                    count--

                }
            } while (count > 0)
            let diff = findDiff(rawStr, str)
            console.log(diff)
            this.inner = rawStr.substr(endOfStartTagIndex+diff.length - 1, closeTagIndex-2)
        } else { // you found the close tag
            this.inner = rawStr.substr(endOfStartTagIndex+1, closeTagIndex-2)
        }
    } else {
        console.log('there is no inner')
        this.inner = ""
    }
}

// function oldBlock(str) {
//     let endOfOpenTagIndex = str.indexOf(">")
//     console.log(endOfOpenTagIndex)
//     startTag = str.substr(1, endOfOpenTagIndex - 1) // get the start tag (in between opening < >)
//     let attributes = startTag.split(" ")
//     // console.log(attributes)
//     this.type = attributes.shift() // get name of tag, then remove from attr list
//     if (attributes[attributes.length - 1] == ">" || attributes[attributes.length - 1] == "/>") attributes.pop() // remove closing > or /> if there

//     this.attr = {}

//     for (let word of attributes) {
//         let words = word.split("=")

//         let lastWordIndex = words.length - 1;
//         let lastWord = words[lastWordIndex]
//         if (lastWord.charAt(lastWord.length - 1) == ">") { // remove closing > from last attribute
//             words[lastWordIndex] = words[lastWordIndex].substring(0, lastWord.length - 1)
//         }

//         // console.log(words)
//         let key = words[0]
//         if (key.charAt(0) == "'" || key.charAt(0) == '"') key = key.substring(1) // remove quotes if they are there
//         if (key.charAt(key.length - 1) == "'" || key.charAt(key.length - 1) == '"') key = key.substring(0, key.length - 1)
//         // console.log(key)

//         let val = words[1]
//         if (words[2]) val += '=' + words[2]; // edge case where val is key val pair
//         if (val.charAt(0) == "'" || val.charAt(0) == '"') val = val.substring(1) // remove quotes if they are there
//         if (val.charAt(val.length - 1) == "'" || val.charAt(val.length - 1) == '"') val = val.substring(0, val.length - 1)
//         // console.log(val)

//         this.attr[key] = val
//     }

//     let startOfEndTagIndex = str.indexOf('</') // find first < after start tag
//     this.inner = ""
//     if (startOfEndTagIndex != -1) this.inner = str.substring(endOfOpenTagIndex + 1, startOfEndTagIndex).replace(/\s+/g, '')
// }






function tester() {
    let tests = [
        // ['<script src="/sites/courses/js/jquery-1.12.4.min.js">console.log("cum")</script>',
        //     { 'type': 'script', 'attr': { "src": "/sites/courses/js/jquery-1.12.4.min.js" }, "inner": 'console.log("cum")' }],

        // ['<script src="/sites/courses/js/jquery-1.12.4.min.js"> console.log("cum")</script>',
        //     { 'type': 'script', 'attr': { "src": "/sites/courses/js/jquery-1.12.4.min.js" }, "inner": 'console.log("cum")' }],

        // ['<script src="/sites/courses/js/jquery-1.12.4.min.js">console.log("cum") </script>',
        //     { 'type': 'script', 'attr': { "src": "/sites/courses/js/jquery-1.12.4.min.js" }, "inner": 'console.log("cum")' }],

        // ['<script src="/sites/courses/js/jquery-1.12.4.min.js"> console.log("cum") </script>',
        //     { 'type': 'script', 'attr': { "src": "/sites/courses/js/jquery-1.12.4.min.js" }, "inner": 'console.log("cum")' }],

        // ['<meta name="google-site-verification" content="ru2q69kfM8frBqiA_4DzYrOSI8cPkgJs826VChwZzgM" />',
        //     { 'type': 'meta', 'attr': { 'content': 'ru2q69kfM8frBqiA_4DzYrOSI8cPkgJs826VChwZzgM' }, 'inner': "" }],

        ['<meta name="viewport" content="initial-scale=1">',
            { 'type': 'meta', 'attr': { 'content': 'initial-scale=1' }, 'inner': "" }],

        ['<title>Title</title>',
            { 'type': 'title', 'attr': {}, "inner": "Title" }],

        ['<header><h1>Header</h1></header>',
            { 'type': 'header', 'attr': {}, "inner": "<h1>Header</h1>" }],

        ['<div><div>Header</div></div>',
            { 'type': 'div', 'attr': {}, "inner": "<div>Header</div>" }],

        ['<div><div><div>Header</div></div></div>',
            { 'type': 'div', 'attr': {}, "inner": "<div><div>Header</div></div>" }],

        ['<div>First</div>',
            { 'type': 'div', 'attr': {}, "inner": "First" }]
    ]

    loop1:
    for (let test of tests) {
        function failed(where) {
            console.log("FAILED! at", where);
            console.log("Expected: ", test[1]);
            console.log("Actual: ", block, '\n');
        }

        console.log("TESTING\t", test[0])
        let block = new Block(test[0])
        if (block.type != test[1].type) {
            failed("type")
            continue
        }
        if (block.inner != test[1].inner) {
            failed("inner")
            continue
        }
        for (let key of Object.keys(test[1].attr)) {
            if (block.attr && test[1].attr[key] != block.attr[key]) {
                failed("attributes")
                continue loop1
            }
        }
        console.log("PASSED!\n")

    }
}

tester()