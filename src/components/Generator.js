import React, { Component } from 'react'
import _ from 'lodash'

class Generator extends Component {

  state = {}


  componentDidMount() {

    const init = _.cloneDeep(this.props.data)
    const changed = this.cleanPlaceholder(_.cloneDeep(this.props.data))

    // const init = { ...this.props.data } // fails as it only performes a shallow clone
    // const changed = { ...data } // fails as it only performes a shallow clone

    // const init = JSON.parse(JSON.stringify(this.props.data))
    // const changed = JSON.parse(JSON.stringify(data))

    this.setState({
      init,
      changed
    })


  }

  cleanPlaceholder = (data) => {

    let copy = { ...data }

    const recursivlyCleanData = (value, route = []) => {
      _.forEach(value, (entry, key, array) => {
        const currentRoute = [...route, key]

        if (typeof entry === 'object') {
          recursivlyCleanData(entry, currentRoute)
        } else {
          _.set(copy, currentRoute, '')
        }
      })
    }

    recursivlyCleanData(copy)

    return copy

  }

  handleChange = e => {
    const state = this.state
    const route = JSON.parse(e.target.attributes.route.value)
    console.log('Before', state, route)

    _.set(state, route, e.target.value)
    console.log('After', state)

    this.setState(state)
    return
  }

  getInput = (data, route = []) => {
    const style = { marginLeft: _.size(route) > 1 ? 20 : 0 }

    return _.map(data, (value, key) => {


      if (typeof value === 'object') {

        switch (key) {
          case 'changed':
            return this.getInput(value, [...route, key])
          case 'init':
            return null

          default:
            return (<div key={key} style={style}>
              <div>
                {key}:
              </div>
              <div>
                {this.getInput(value, [...route, key])}
              </div>
            </div>)
        }
      }

      if (typeof value !== 'object') {

        const currentRoute = [...route, key]
        const initRoute = ['init', ..._.tail(currentRoute)]

        return <div key={key} style={style}>
          <span>{key}: </span>
          <input
            key={key}
            ref={e => _.set(this, currentRoute, e)}
            type="text"
            route={JSON.stringify(currentRoute)}
            value={_.get({ ...this.state }, currentRoute)}
            onChange={this.handleChange}
            placeholder={_.get({ ...this.state }, initRoute)} />
        </div>
      }
    })
  }


  render() {
    const state = { ...this.state }

    return (
      <div className="es-generator">
        {
          this.getInput(state)
        }
        <button onClick={() => this.props.handleSubmit({ ...this.state.changed })} >submit</button>
      </div>
    )
  }
}

export default Generator


