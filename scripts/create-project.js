const readline = require("readline");
const fs = require("fs");
const Mustache = require("mustache");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inputMap = [
  {
    "input": "contrib/index.mustache",
    "output": "../example/index.html"
  },
  {
    "input": "contrib/webpack-dev.mustache",
    "output": "../config/webpack/webpack.dev.config.js"
  },
  {
    "input": "contrib/wrapper.mustache",
    "output": "../src/wrapper.js"
  },
  {
    "input": "contrib/package.mustache",
    "output": "../package.json"
  }
];

function askRemainingQuestions(rl, packageName, packageLocation) {
  rl.question("What is the name of the library as you wish it to be bundled? ", function(libraryName) {
    rl.question("What is the name of the base element to include? ", function(elementName) {
      let view = {
        'packageName': packageName,
        'libraryName': libraryName,
        'elementName': elementName,
        'packageLocation': packageLocation
      };

      for (const file of inputMap) {
          let inputFilename = __dirname + "/" + file.input;

          // read input file
          let input = fs.readFileSync(inputFilename, 'utf-8');

          // resolve mustache template
          let output = Mustache.render(input, view);

          let outputFilename = __dirname + '/' + file.output;

          // output new file
          fs.writeFileSync(outputFilename, output);
      }

      console.log("Your project is set up! Please run 'yarn install' to install necessary dependencies");
      rl.close();
    });
  });
}

rl.question("What is the name of the react package you wish to import? ", function(packageName) {
  rl.question("Is the package located on npm [Y/n]? ", function (locatedOnNpm) {

    if (locatedOnNpm === 'n' || locatedOnNpm === 'N') {
      rl.question("What is the location of the package on your local system, relative to this project's root directory? ", function(packageLocation) {
        askRemainingQuestions(rl, packageName, packageLocation);
      });
    } else {
      let packageLocation = '*';
      askRemainingQuestions(rl, packageName, packageLocation);
    }
  });
});

rl.on("close", function() {
    process.exit(0);
});
