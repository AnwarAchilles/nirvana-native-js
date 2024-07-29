
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
  <div nirvana-component="Demo">
    <h1 id="result">0</h1>
    <button onclick="Nirvana.run('Demo').click()">Click Me</button>
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
  configure: {},
  provider: {},
  service: {}
});


Nirvana.component(
  class Demo extends Nirvana {
    store = Nirvana.store("Demo");
    start() {
      this.store.set("result", 0);
    }
    click() {
      this.store.set("result", 
        this.store.get("result") + 1
      );
      this.select("#result").item(0).innerHTML = this.store.get("result");
    }
  }
);

Nirvana.run("Demo").start();
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