
# Nirvana JS
Lightweight device to build simple JS-based Apps in JavaScript programming language environment

version - Beta


#

## Example Use

#### Install Via NPM
```bash
npm i nirvana-native-js
```
#### HTML Structure
Create an index.html project, create a basic html structure, like the example below.
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div nirvana-component="Main">
    <h1>Should Be Change</h1>
    <h1>Should Be Change</h1>
    <button onclick="Nirvana.run('Main').index()">Run Index</button>
  </div>
  
  <script src="./node_modules/nirvana-native-js/nirvana.js"></script>
  <script src="./index.js"></script>
</body>
</html>
```
#### JS Structure
After that, create the index.js file and then setup the nirvana environment & components
```js
Nirvana.environment({
  Configure: {},
  Provider: {},
  Service: {}
});


Nirvana.component(
  class Main extends Nirvana {
    index() {
      this.select("h1").item(0).innerHTML = "nirvana ready 1";
      this.select("h1").item(1).innerHTML = "nirvana ready 2";
    }
  }
);
```


## API Reference


#### Environment Configure

| Properties | Type  | Description |
| :-------- | :------- | :------------------------- |
| `constant` | `string` | **Optional**. you can change Nirvana instance to NV or anything. |
| `separator` | `string` | **(deprecated)** |


#### Nirvana Method

| Method & Properties | Type  | Description |
| :-------- | :------- | :------------------------- |
| `element` | | return dom element from the component. |
| `inSelector` |  | return dom selector string from the component. |
| `select` | `string` | selector for the element inner the component. |


#
[![portfolio](https://ik.imagekit.io/anwarachilles/devneet-powered.svg?updatedAt=1704715329026)]('#')