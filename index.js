import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import ipld from 'ipld-dag-cbor'
import Block from 'ipfs-block'
const NeatJSON = require('./neatjson.js').neatJSON
require('./style.css')
console.log(NeatJSON)

const jimmy = {
  name: 'Jimmy',
  surname: 'Smith'
}

const john = {
  name: 'John',
  surname: 'Smith',
  father: {'/': '/h2/'}
}

ipld.util.serialize(john, (err, serialized) => {
  console.log(err, serialized)
  const block = new Block(serialized)
  console.log(block)
  ipld.resolver.resolve(block, 'name', (err, result) => {
    console.log(err, result)
  })
})
// const jimmyObj = ipld.util.marshal(jimmy)
// console.log(ipld.util.multihash(jimmyObj))

class PropertyList extends Component {
  render () {
    return <div>{this.props.name}
      <ul>
        {Object.keys(this.props.object).map((key) => {
          return <li key={key} onMouseOver={() => {
            this.props.onClick(this.props.name, key)
          }}>{key}</li>
        })}
      </ul>
    </div>
  }
}

const ExampleCode = (props) => {
  return <code><pre dangerouslySetInnerHTML={{__html: props.data}} /></code>
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      obj1: john,
      obj2: jimmy,
      selectedProperty: null,
      selectedObject: null
    }
    this.onClick = this.onClick.bind(this)
  }
  onClick (obj, key) {
    this.setState({
      selectedProperty: key,
      selectedObject: obj
    })
  }
  render () {
    const obj1JSON = NeatJSON(this.state.obj1, {wrap: 30, after_colon: 1})
    const obj2JSON = NeatJSON(this.state.obj2, {wrap: 30, after_colon: 1})
    let obj1Pretty = obj1JSON
    let obj2Pretty = obj2JSON
    if (this.state.selectedProperty && this.state.selectedObject === 'obj1') {
      const key = this.state.selectedProperty
      const value = this.state[this.state.selectedObject][key]
      let jsonString = `"${key}":"${value}"`
      if (typeof value === 'object') {
        jsonString = JSON.stringify(value)
      }
      obj1Pretty = obj1JSON.replace(jsonString, `<span class="active">${jsonString}</span>`)
    } else if (this.state.selectedProperty && this.state.selectedObject === 'obj2') {
      const key = this.state.selectedProperty
      const value = this.state[this.state.selectedObject][key]
      let jsonString = `"${key}":"${value}"`
      obj2Pretty = obj2JSON.replace(jsonString, `<span class="active">${jsonString}</span>`)
    }
    return <div>
      <ExampleCode data={obj1Pretty} />
      <ExampleCode data={obj2Pretty} />
      <PropertyList name='obj1' object={john} onClick={this.onClick} />
      <PropertyList name='obj2' object={jimmy} onClick={this.onClick} />
      <code><pre>{JSON.stringify(this.state, null, 2)}</pre></code>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('react-app'))
